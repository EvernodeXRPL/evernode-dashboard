const { EvernodeHook, HookEvents, RippleAPIWrapper } = require('evernode-js-client');
const https = require('https');
const fs = require('fs');
const azure = require('azure-storage');

const CONFIG_PATH = __dirname + '/config.json';
const HOST_PARTITION_KEY = 'hosts';
const HOST_ROW_KEY = '1';
const HOST_MONITOR_INTERVAL = 15000; // 15 seconds.

class Streamer {
    constructor(hookAddress = null, rippledServer = null) {
        this.rippleApi = new RippleAPIWrapper(rippledServer);
        this.evernodeHook = new EvernodeHook(this.rippleApi, hookAddress);
        this.evernodeHook.events.on(HookEvents.Redeem, async (ev) => {
            this.broadcast(HookEvents.Redeem, { user: ev.user, host: ev.host, token: ev.token, moments: ev.moments, redeemTxHash: ev.transaction.hash });
        })
        this.evernodeHook.events.on(HookEvents.RedeemSuccess, async (ev) => {
            this.broadcast(HookEvents.RedeemSuccess, { host: ev.transaction.Account, redeemTxHash: ev.redeemTxHash });
        })
        this.evernodeHook.events.on(HookEvents.RedeemError, async (ev) => {
            this.broadcast(HookEvents.RedeemError, { host: ev.transaction.Account, redeemTxHash: ev.redeemTxHash, reason: ev.reason });
        });
        this.evernodeHook.events.on(HookEvents.HostDeregistered, async (ev) => {
            this.broadcast(HookEvents.HostDeregistered, { host: ev.host });
        });
        this.evernodeHook.events.on(HookEvents.HostRegistered, async (ev) => {
            this.broadcast(HookEvents.HostRegistered, { host: ev.host, token: ev.token, instanceSize: ev.instanceSize, location: ev.location });
        });
        this.evernodeHook.events.on(HookEvents.RefundRequest, async (ev) => {
            this.broadcast(HookEvents.RefundRequest, { redeemTxHash: ev.redeemTxHash });
        });
        this.evernodeHook.events.on(HookEvents.AuditRequest, async (ev) => {
            this.broadcast(HookEvents.AuditRequest, { auditor: ev.auditor });
        });
        this.evernodeHook.events.on(HookEvents.AuditSuccess, async (ev) => {
            this.broadcast(HookEvents.AuditSuccess, { auditor: ev.auditor });
        });

        // [Todo]
        // 1. audit success reward event.
        // 2. refund success payment.

    }
    async start() {
        if (!fs.existsSync(CONFIG_PATH))
            throw new Error(`Config file ${CONFIG_PATH} not found.`);
        this.config = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());

        if (!this.config.hostname || !this.config.path || !this.config.azure_table || !this.config.azure_table.host ||
            !this.config.azure_table.table || !this.config.azure_table.sas)
            throw new Error(`Config file ${CONFIG_PATH} is missing required fields.`);

        await this.rippleApi.connect();
        this.evernodeHook.subscribe();

        this.tableSvc = azure.createTableServiceWithSas(this.config.azure_table.host, this.config.azure_table.sas);
        this.hosts = [];
        await this.monitorHosts();
    }

    // Get host list every HOST_MONITOR_INTERVAL and update table storage if the list has changed.
    async monitorHosts() {
        const latestHosts = await this.evernodeHook.getHosts();
        // String version of two arrays are compared to determine if the hosts have changed.
        if (JSON.stringify(this.hosts) !== JSON.stringify(latestHosts)) {
            console.log(`Hosts changed (${this.hosts.length} -> ${latestHosts.length}). Updating hosts table.`);
            this.hosts = latestHosts;
            this.updateHosts(this.hosts);
        }
        setTimeout(() => this.monitorHosts(), HOST_MONITOR_INTERVAL);
    }

    // Broadcast the event to all the clients subscribed to signalR.
    broadcast(event, eventData) {
        const data = JSON.stringify({
            systemDashboard: {
                event: event,
                data: eventData
            }
        });
        console.log(`Broadcasting ${event}: ${data.length} bytes`);
        const req = https.request({
            hostname: this.config.hostname,
            port: 443,
            path: this.config.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        });

        req.on('error', error => {
            console.error(error);
        })

        req.write(data);
        req.end();
    }

    // Update the table storage with the latest hosts.
    updateHosts(hosts) {
        const ent = azure.TableUtilities.entityGenerator;
        const tableBatch = new azure.TableBatch();
        tableBatch.insertOrReplaceEntity({
            PartitionKey: ent.String(HOST_PARTITION_KEY),
            RowKey: ent.String(HOST_ROW_KEY),
            count: ent.Int32(hosts.length),
            hosts: ent.String(JSON.stringify(hosts))
        });

        this.tableSvc.executeBatch(this.config.azure_table.table, tableBatch, (err) => err && console.error(err));

    }
}
async function main() {
    const streamer = new Streamer(process.env.HOOK_ADDRESS);
    await streamer.start().catch(e => console.error(e));
}
main();