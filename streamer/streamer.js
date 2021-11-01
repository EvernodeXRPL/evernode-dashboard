const { EvernodeHook, HookEvents, RippleAPIWrapper, XrplAccount } = require('evernode-js-client');
const fs = require('fs');
const azure = require('azure-storage');
const fetch = require('node-fetch');
const { exec } = require('child_process');

const CONFIG_PATH = __dirname + '/config.json';
const HOST_PARTITION_KEY = 'host';
const EVR = 'EVR';

class Streamer {
    constructor(hookAddress = null, rippledServer = null) {
        this.rippleAPI = new RippleAPIWrapper(rippledServer);
        this.evernodeHook = new EvernodeHook(this.rippleAPI, hookAddress);
        this.hookAddress = this.evernodeHook.account.address;
        this.evernodeHook.events.on(HookEvents.Redeem, async (ev) => {
            await this.broadcast(HookEvents.Redeem, {
                user: ev.user,
                host: ev.host,
                token: ev.token,
                moments: ev.moments,
                redeemTxHash: ev.transaction.hash,
                nodeid: this.hostAccounts[ev.host]?.nodeid
            });
        });
        this.evernodeHook.events.on(HookEvents.RedeemSuccess, async (ev) => {
            await this.broadcast(HookEvents.RedeemSuccess, {
                host: ev.transaction.Account,
                redeemTxHash: ev.redeemTxHash,
                nodeid: this.hostAccounts[ev.transaction.Account]?.nodeid
            });
        });
        this.evernodeHook.events.on(HookEvents.RedeemError, async (ev) => {
            await this.broadcast(HookEvents.RedeemError, {
                host: ev.transaction.Account,
                redeemTxHash: ev.redeemTxHash,
                reason: ev.reason,
                nodeid: this.hostAccounts[ev.transaction.Account]?.nodeid
            });
        });
        this.evernodeHook.events.on(HookEvents.HostDeregistered, async (ev) => {
            await this.broadcast(HookEvents.HostDeregistered, { host: ev.host, nodeid: this.hostAccounts[ev.host]?.nodeid });
        });
        this.evernodeHook.events.on(HookEvents.HostRegistered, async (ev) => {
            await this.broadcast(HookEvents.HostRegistered, {
                host: ev.host,
                token: ev.token,
                instanceSize: ev.instanceSize,
                location: ev.location,
                nodeid: this.hostAccounts[ev.host]?.nodeid
            });
        });
        this.evernodeHook.events.on(HookEvents.RefundRequest, async (ev) => {
            await this.broadcast(HookEvents.RefundRequest, { redeemTxHash: ev.redeemTxHash });
        });
        this.evernodeHook.events.on(HookEvents.AuditRequest, async (ev) => {
            await this.broadcast(HookEvents.AuditRequest, { auditor: ev.auditor });
        });
        this.evernodeHook.events.on(HookEvents.AuditSuccess, async (ev) => {
            await this.broadcast(HookEvents.AuditSuccess, { auditor: ev.auditor });
        });

        // [Todo]
        // 1. audit success reward event.
        // 2. refund success payment.

    }

    async start() {
        if (!fs.existsSync(CONFIG_PATH))
            throw new Error(`Config file ${CONFIG_PATH} not found.`);
        this.config = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());

        if (!this.config.azure_function || !this.config.azure_function.hostname || !this.config.azure_function.path || !this.config.azure_table ||
            !this.config.azure_table.host || !this.config.azure_table.table || !this.config.azure_table.sas)
            throw new Error(`Config file ${CONFIG_PATH} is missing required fields.`);

        await this.rippleAPI.connect();
        this.evernodeHook.subscribe();

        await this.updateHostsTable();
    }

    // Get VM list from vultr and match them with hosts from the hook state. Get EVR balance of each host.
    async updateHostsTable() {
        
        this.hostAccounts = {};
        
        const hostObjs = await this.getVultrHosts(this.config.vultr.group);
        if (hostObjs && hostObjs.length > 0) {
            await Promise.all(hostObjs.map(hostObj => this.initHostAccountData(hostObj)))
            
            const latestHosts = await this.evernodeHook.getHosts();
            console.log(`Got ${latestHosts.length} hosts from evernode.`);
            latestHosts.forEach(host => {
                const data = this.hostAccounts[host.address];
                if (data)
                data.state = {
                    txHash: host.txHash,
                    instanceSize: host.instanceSize,
                    location: host.location
                };
            });
            
            const ent = azure.TableUtilities.entityGenerator;
            const tableBatch = new azure.TableBatch();
            Object.values(this.hostAccounts).forEach(host => {
                tableBatch.insertOrReplaceEntity({
                    PartitionKey: ent.String(HOST_PARTITION_KEY),
                    RowKey: ent.String(host.nodeid.toString()),
                    ip: ent.String(host.ip),
                    region: ent.String(host.region),
                    address: ent.String(host.hostAccount.address),
                    token: ent.String(host.hostAccount.token),
                    evrBalance: ent.String(host.evrBalance),
                    txHash: ent.String(host.state.txHash),
                    instanceSize: ent.String(host.state.instanceSize),
                    location: ent.String(host.state.location)
                });
            });
            
            const tableSvc = azure.createTableServiceWithSas(this.config.azure_table.host, this.config.azure_table.sas);
            tableSvc.executeBatch(this.config.azure_table.table, tableBatch, (err) => err && console.error(err));
            console.log(`Updated ${Object.keys(this.hostAccounts).length} hosts in table storage.`);
        }
    }

    // Broadcast the event to all the clients subscribed to signalR.
    async broadcast(event, eventData) {
        const data = JSON.stringify({
            systemDashboard: {
                event: event,
                data: eventData
            }
        });
        console.log(`Broadcasting ${event}: ${data.length} bytes`);
        const res = await fetch(`https://${this.config.azure_function.hostname}${this.config.azure_function.path}`, {
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        }).catch(error => { console.error(error) });
    }

    getVultrHosts(group) {

        return new Promise(async (resolve) => {

            if (!group || group.trim().length === 0)
                resolve([]);

            const resp = await fetch(`https://api.vultr.com/v2/instances?tag=${group}`, {
                method: 'GET',
                headers: { "Authorization": `Bearer ${this.config.vultr.api_key}` }
            });

            const vms = (await resp.json()).instances;
            if (!vms) {
                console.log("Failed to get vultr instances.");
                resolve([]);
                return;
            }
            const hosts = vms.sort((a, b) => (a.label < b.label) ? -1 : 1).map((i, index) => { return { ip: i.main_ip, region: i.region, nodeid: index } });
            console.log(`${hosts.length} hosts retrieved from Vultr.`)
            resolve(hosts);
        })
    }

    async initHostAccountData(hostObj) {
        const output = await this.execSsh(hostObj.ip, "cat /etc/sashimono/mb-xrpl/mb-xrpl.cfg");
        if (!output || output.trim() === "") {
            console.log(`ERROR: No output from mb-xrpl config read. IP: ${hostObj.ip}`);
            return;
        }

        const conf = JSON.parse(output);
        const acc = {
            address: conf.xrpl.address,
            secret: conf.xrpl.secret,
            token: conf.xrpl.token
        }

        // Checking EVR balance of hosts.
        const xrpAcc = new XrplAccount(this.rippleAPI, acc.address, acc.secret);
        const lines = await xrpAcc.getTrustLines(EVR, this.hookAddress);
        this.hostAccounts[acc.address] = {
            ip: hostObj.ip,
            region: hostObj.region,
            nodeid: hostObj.nodeid,
            hostAccount: acc,
            evrBalance: lines.length > 0 ? lines[0].state.balance : 0
        }
    }

    execSsh(host, command) {
        return new Promise(resolve => {
            const cmd = `ssh -o StrictHostKeychecking=no root@${host} ${command}`;
            exec(cmd, (err, stdout, stderr) => {
                resolve(stdout);
            });
        })
    }
}
async function main() {
    const streamer = new Streamer(process.env.HOOK_ADDRESS);
    await streamer.start().catch(e => console.error(e));
}
main();