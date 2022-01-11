import EventEmitter from "EventEmitter"
const { TableClient, AzureSASCredential } = require("@azure/data-tables");
const signalR = require("@microsoft/signalr");

const signalREvents = {
    // Central streamer events.
    HostRegistered: "HostRegistered",
    HostDeregistered: "HostDeregistered",
    Redeem: "Redeem",
    RedeemSuccess: "RredeemSuccess",
    RedeemError: "RedeemError",
    Refund: "Refund",
    Audit: "Audit",
    AuditAssignment: "AuditAssignment",
    AuditSuccess: "AuditSuccess",
    Reward: "Reward",
    Recharge: "Recharge",
    Offline: "Offline",
    // Host streamer events.
    HostInstanceCreate: 'hostInstanceCreation',
    HostInstanceTimeout: 'hostInstanceTimeout',
    HostInstanceExpire: 'hostInstanceExpire',
    HostInstanceCount: 'hostInstanceCount',
}

const eventInfo = {
    // Central streamer events.
    HostRegistered: {
        type: 'host-reg',
        name: 'Host Registration',
        hostSilent: true
    },
    HostDeregistered: {
        type: 'host-dereg',
        name: 'Host De-Registration',
        hostSilent: true
    },
    Redeem: {
        type: 'redeem-req',
        name: 'Redeem Request'
    },
    RedeemSuccess: {
        type: 'redeem-suc',
        name: 'Redeem Success'
    },
    RedeemError: {
        type: 'redeem-err',
        name: 'Redeem Error'
    },
    Refund: {
        type: 'refund-req',
        name: 'Refund Request'
    },
    Audit: {
        type: 'audit-req',
        name: 'Audit Request'
    },
    AuditSuccess: {
        type: 'audit-suc',
        name: 'Audit Success'
    },
    Reward: {
        type: 'reward',
        name: 'Reward'
    },
    Offline: {
        type: 'offline',
        name: 'Offline',
        hookSilent: true,
        hostSilent: true
    },
    Recharge: {
        type: 'recharge',
        name: 'Recharge'
    },
    // Host streamer events.
    hostInstanceCreation: {
        type: 'instance-create',
        name: 'Instance Create'
    },
    hostInstanceTimeout: {
        type: 'instance-timeout',
        name: 'Instance Timeout'
    },
    hostInstanceExpire: {
        type: 'instance-expire',
        name: 'Instance Expire'
    },
    hostInstanceCount: {
        type: 'instance-count',
        name: 'Host Count Update',
        hookSilent: true,
        hostSilent: true
    },
    // These events aren't emitted from the host streamer yet.
    // Anyway the underlying UI is wired up for later use when it's implemented.
    hostOnline: {
        type: 'online',
        name: 'Online',
        hookSilent: true,
        hostSilent: true
    },
    hostOffline: {
        type: 'offline',
        name: 'Offline',
        hookSilent: true,
        hostSilent: true
    }
}

const sashiErrorCodes = {
    internal_error: 'Internal error occured.',
    max_alloc_reached: 'Max instance count reached.',
    contractid_bad_format: 'Provided invalid contract id format.',
    docker_image_invalid: 'Provided invalid docker image.'
}

const events = {
    countryListLoaded: "countryListLoaded",
    hostEvent: "hostEvent",
    hostUpdate: "hostUpdate",
    hookEvent: "hookEvent"
}

class HostNode {
    constructor(country, pos, node) {
        this.country = country;
        this.pos = pos;

        this.idx = node.idx;
        this.address = node.address;
        this.evrBalance = node.evrBalance;
        this.countryCode = node.countryCode;
        this.token = node.token;
        this.instanceCount = 0;
        this.online = node.active;
        this.cpuMicroSec = node.cpuMicroSec;
        this.description = node.description;
        this.diskMb = node.diskMb;
        this.lastHeartbeatLedgerIndex = node.lastHeartbeatLedgerIndex;
        this.lockedTokenAmount = node.lockedTokenAmount
        this.ramMb = node.ramMb;

        this.emitter = new EventEmitter();
    }

    on(event, handler) {
        this.emitter.on(event, handler);
    }

    off(event, handler) {
        this.emitter.off(event, handler);
    }
}

class EvernodeManager {

    constructor() {
        this.emitter = new EventEmitter();

        this.countries = {};
        this.nodeLookup = {};
        this.nextIdx = 1;
        this.maxNodes = 0;
    }

    async start() {
        await this.loadHosts();
        this.connectToSignalR(); // Connect to signalr asynchronously.
        // This mock listener is used for UI testing to emit mock events
        // this.mockListener()
    }

    async loadHosts() {
        const tableClient = new TableClient(
            window.dashboardConfig.tableAccount,
            window.dashboardConfig.tableName,
            new AzureSASCredential(window.dashboardConfig.tableSas));

        const rows = await tableClient.listEntities({ queryOptions: { filter: `PartitionKey eq '${window.dashboardConfig.partitionKey}'` } });
        let isListUpdated = false;
        for await (const row of rows) {
            if (this.addNode({
                idx: parseInt(row.rowKey) + 1,
                address: row.address,
                token: row.token,
                evrBalance: row.evrBalance,
                countryCode: row.countryCode,
                cpuMicroSec: row.cpuMicroSec,
                ramMb: row.ramMb,
                diskMb: row.diskMb,
                description: row.description,
                lastHeartbeatLedgerIndex: row.lastHeartbeatLedgerIndex,
                accumulatedAmount: row.accumulatedAmount,
                lockedTokenAmount: row.lockedTokenAmount,
                active: row.active
            })) {
                isListUpdated = true;
            }
        }
        const r = Object.values(this.countries).map(c => {
            return c.nodes ? Object.keys(c.nodes).length : 0;
        })
        this.maxNodes = Math.max(...r);
        if (isListUpdated)
            this.emitter.emit(events.countryListLoaded, this.countries);
    }

    getMarkerSize(nodeCount) {
        const minSize = 0.8;
        const dif = 1.7;
        const size = minSize + (nodeCount / this.maxNodes) * dif;
        return size;
    }

    // ----------------- Mock Events -------------------- //

    generateString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    mockListener() {
        const evs = [signalREvents.Redeem,
        signalREvents.RedeemSuccess,
        signalREvents.RedeemError,
        signalREvents.Audit,
        signalREvents.AuditSuccess,
        signalREvents.HostDeregistered,
        signalREvents.HostRegistered,
        signalREvents.Refund,
        signalREvents.Reward,
        signalREvents.HostInstanceCount,
        signalREvents.HostInstanceCreate,
        signalREvents.HostInstanceExpire,
        signalREvents.HostInstanceTimeout];

        let ledgerSeq = 1000;

        setInterval(() => {
            const iterations = (Math.floor(100000 + Math.random() * 900000)) % 4;
            for (let i = 0; i < iterations; i++) {
                const hosts = Object.keys(this.nodeLookup);
                let event = evs[(Math.floor(100000 + Math.random() * 900000)) % evs.length];
                ledgerSeq = ledgerSeq + 3;

                let data = {
                    host: (event === signalREvents.HostRegistered || event === signalREvents.HostDeregistered) ? this.generateString(34) :
                        ((event !== signalREvents.AuditRequest && event !== signalREvents.AuditSuccess) ? hosts[(Math.floor(100000 + Math.random() * 900000)) % hosts.length] : null),
                    auditor: (event === signalREvents.AuditRequest || event === signalREvents.AuditSuccess) ? this.generateString(34) : null,
                    ledgerSeq: (event === signalREvents.HostRegistered || event === signalREvents.HostDeregistered || !event.startsWith('host')) ? ledgerSeq : null,
                    evrBalance: null,
                    count: null,
                    amount: null,
                    moments: null,
                    reason: event === signalREvents.RedeemError ? 'max_alloc_reached' : null
                }

                let info = eventInfo[event];
                // If info map object is not found for this event, Return without handling.
                if (!info)
                    return;

                const country = data.host ? this.countries[this.nodeLookup[data.host]] : null;
                const node = country?.nodes[data.host];

                if (node) {
                    if (!node.online) {
                        event = signalREvents.HostOnline;
                        info = eventInfo[event];
                    }

                    if (event === signalREvents.Reward) {
                        data.amount = (Math.floor(100000 + Math.random() * 900000)) % 5 + 0.1;
                        data.evrBalance = +node.evrBalance + data.amount;
                    }
                    else if (event === signalREvents.Redeem) {
                        data.moments = ((Math.floor(100000 + Math.random() * 900000)) + 1) % 10;
                    }
                    else if (event === signalREvents.HostInstanceCount) {
                        const count = (Math.floor(100000 + Math.random() * 900000)) % 5;
                        data.count = count;
                    }
                }


                if (node) {
                    let hostUpdated = false;
                    if (event === signalREvents.Reward) {
                        node.evrBalance = data.evrBalance;
                        hostUpdated = true;
                    }
                    else if (event === signalREvents.HostOnline) {
                        node.online = true;
                        hostUpdated = true;
                    }
                    else if (event === signalREvents.HostOffline) {
                        node.online = false;
                        hostUpdated = true;
                    }
                    else if (event === signalREvents.HostInstanceCount) {
                        node.instanceCount = data.count;
                        hostUpdated = true;
                    }

                    if (!info.hostSilent) {
                        this.emitter.emit(events.hostEvent, {
                            countryCode: country.code,
                            idx: node.idx,
                            type: info.type,
                            name: info.name,
                            ledgerSeq: data.ledgerSeq
                        });
                    }
                    // If the event is host silent, but host object is updated we send hostUpdate event.
                    else if (hostUpdated) {
                        this.emitter.emit(events.hostUpdate, { countryCode: country.code });
                    }
                }

                if (!info.hookSilent) {
                    this.emitter.emit(events.hookEvent, {
                        type: info.type,
                        name: info.name,
                        county: country?.name,
                        address: data.host || data.auditor,
                        message: data.reason && sashiErrorCodes[data.reason],
                        amount: (data.amount && `${data.amount} ${data.token ? data.token : 'EVR'}`) ||
                            (data.moments && `${data.moments} ${node ? node.token : ''}`),
                        nodeId: node?.idx,
                        ledgerSeq: data.ledgerSeq
                    });
                }
            }
        }, 3000);
    }

    // -------------------------------------------------- //

    async connectToSignalR() {
        try {
            this.signalRConnection = new signalR.HubConnectionBuilder()
                .withUrl(window.dashboardConfig.signalRUrl, {
                    headers: { "x-ms-client-principal-id": window.dashboardConfig.clusterKey }
                })
                .configureLogging(signalR.LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            this.initiateSignalRHandlers();

            await this.signalRConnection.start();
        } catch (error) {
            console.error(error);
        }
    }

    initiateSignalRHandlers() {
        this.signalRConnection.on("newMessage", (message) => {
            const event = message.event;
            const data = message.data;

            let info = eventInfo[event];
            // If info map object is not found for this event, Return without handling.
            if (!info)
                return;

            // Handle offline event seperately since it's receiving an array of host addresses.
            if (event === signalREvents.Offline) {
                console.log(`${info.name} event received.`);
                data.forEach(host => {
                    const country = this.countries[this.nodeLookup[host]];
                    const node = country?.nodes[host];
                    node.online = false;
                    this.emitter.emit(events.hostUpdate, { countryCode: country.code });
                });
                return;
            }

            const country = data.host ? this.countries[this.nodeLookup[data.host]] : null;
            const node = country?.nodes[data.host];
            if (node) {
                let hostUpdated = false;
                if (event === signalREvents.Reward) {
                    node.evrBalance = data.evrBalance;
                    hostUpdated = true;
                }
                else if (event === signalREvents.HostInstanceCount) {
                    node.instanceCount = data.count;
                    hostUpdated = true;
                } else if (event === signalREvents.Recharge) {
                    node.online = true;
                    hostUpdated = true;
                }

                if (!info.hostSilent) {
                    this.emitter.emit(events.hostEvent, {
                        countryCode: country.code,
                        idx: node.idx,
                        type: info.type,
                        name: info.name,
                        ledgerSeq: data.ledgerSeq
                    });
                }
                // If the event is host silent, but host object is updated we send hostUpdate event.
                else if (hostUpdated) {
                    this.emitter.emit(events.hostUpdate, { countryCode: country.code });
                }
            }

            if (!info.hookSilent) {
                this.emitter.emit(events.hookEvent, {
                    type: info.type,
                    name: info.name,
                    country: country?.name,
                    address: event === signalREvents.Refund ? data.redeemRefId : (data.host || data.auditor), // Refund event only has tx id. Add it to address field for display.
                    message: data.reason && sashiErrorCodes[data.reason],
                    amount: (data.amount && `${data.amount} ${data.token ? data.token : 'EVR'}`) ||
                        (data.moments && `${data.moments} ${node ? node.token : ''}`),
                    nodeId: node?.idx,
                    ledgerSeq: data.ledgerSeq
                });
            }
        });
    }

    addNode(msg) {
        let isListUpdated = false;
        let country = null;

        if (msg.countryCode) {
            country = window.dashboardConfig.countries.filter(r => r.code === msg.countryCode)[0];
            if (!country)
                country = window.dashboardConfig.defCountry;
        }
        const node = new HostNode(country.name, country.pos, msg);
        if (!this.countries[country.code]) {
            this.countries[country.code] = country;
            this.countries[country.code].nodes = {};
            this.countries[country.code].nodes[msg.address] = node;
            isListUpdated = true;
        } else if (!this.countries[country.code].nodes[msg.address]) {
            this.countries[country.code].nodes[msg.address] = node;
            isListUpdated = true;
        }

        if (isListUpdated)
            this.nodeLookup[msg.address] = country.code;

        return isListUpdated ? node : null;
    }

    on(event, handler) {
        this.emitter.on(event, handler);
    }

    off(event, handler) {
        this.emitter.off(event, handler);
    }
}

const exports = {
    events: events,
    evernodeManager: new EvernodeManager()
}

export default exports