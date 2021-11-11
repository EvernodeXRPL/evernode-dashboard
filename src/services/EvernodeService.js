import EventEmitter from "EventEmitter"
const { TableClient, AzureSASCredential } = require("@azure/data-tables");
const signalR = require("@microsoft/signalr");

const signalREvents = {
    // Central streamer events.
    HostRegistered: "hostRegistered",
    HostDeregistered: "hostDeregistered",
    Redeem: "redeem",
    RedeemSuccess: "redeemSuccess",
    RedeemError: "redeemError",
    RefundRequest: "refundRequest",
    AuditRequest: "auditRequest",
    AuditSuccess: "auditSuccess",
    Reward: "reward",
    // Host streamer events.
    HostInstanceCreate: 'hostInstanceCreation',
    HostInstanceTimeout: 'hostInstanceTimeout',
    HostInstanceExpire: 'hostInstanceExpire',
    HostInstanceCount: 'hostInstanceCount',
    // These events aren't emitted from the host streamer yet.
    // Anyway the underlying UI is wired up for later use when it's implemented.
    HostOnline: 'hostOnline',
    HostOffline: 'hostOffline'
}

const eventInfo = {
    // Central streamer events.
    hostRegistered: {
        type: 'host-reg',
        name: 'Host Registration',
        hostSilent: true
    },
    hostDeregistered: {
        type: 'host-dereg',
        name: 'Host De-Registration',
        hostSilent: true
    },
    redeem: {
        type: 'redeem-req',
        name: 'Redeem Request'
    },
    redeemSuccess: {
        type: 'redeem-suc',
        name: 'Redeem Success'
    },
    redeemError: {
        type: 'redeem-err',
        name: 'Redeem Error'
    },
    refundRequest: {
        type: 'refund-req',
        name: 'Refund Request'
    },
    auditRequest: {
        type: 'audit-req',
        name: 'Audit Request'
    },
    auditSuccess: {
        type: 'audit-suc',
        name: 'Audit Success'
    },
    reward: {
        type: 'reward',
        name: 'Reward'
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

const events = {
    regionListLoaded: "regionListLoaded",
    hostEvent: "hostEvent",
    hostUpdate: "hostUpdate",
    hookEvent: "hookEvent"
}

class HostNode {
    constructor(region, pos, node) {
        this.region = region;
        this.pos = pos;

        this.idx = node.idx;
        this.address = node.address;
        this.ip = node.ip;
        this.evrBalance = node.evrBalance;
        this.location = node.location;
        this.size = node.size;
        this.token = node.token;
        this.instanceCount = 0;
        this.online = true;

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

        this.regions = {};
        this.nodeLookup = {};
        this.nextIdx = 1;
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
                region: row.region,
                evrBalance: row.evrBalance,
                ip: row.ip,
                location: row.location,
                size: row.instanceSize,
                token: row.token,
            })) {
                isListUpdated = true;
            }
        }
        if (isListUpdated)
            this.emitter.emit(events.regionListLoaded, this.regions);
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
        signalREvents.AuditRequest,
        signalREvents.AuditSuccess,
        signalREvents.HostDeregistered,
        signalREvents.HostRegistered,
        signalREvents.RefundRequest,
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
                    moments: null
                }

                let info = eventInfo[event];
                // If info map object is not found for this event, Return without handling.
                if (!info)
                    return;

                const region = data.host ? this.regions[this.nodeLookup[data.host]] : null;
                const node = region?.nodes[data.host];

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
                        node.emitter.emit(events.hostEvent, {
                            type: info.type,
                            name: info.name,
                            ledgerSeq: data.ledgerSeq
                        });
                    }
                    // If the event is host silent, but host object is updated we send hostUpdate event.
                    else if (hostUpdated) {
                        node.emitter.emit(events.hostUpdate);
                    }
                }

                if (!info.hookSilent) {
                    this.emitter.emit(events.hookEvent, {
                        type: info.type,
                        name: info.name,
                        region: region?.name,
                        address: data.host || data.auditor,
                        amount: (data.amount && `${data.amount} EVR`) ||
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

            const region = data.host ? this.regions[this.nodeLookup[data.host]] : null;
            const node = region?.nodes[data.host];

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
                    node.emitter.emit(events.hostEvent, {
                        type: info.type,
                        name: info.name,
                        ledgerSeq: data.ledgerSeq
                    });
                }
                // If the event is host silent, but host object is updated we send hostUpdate event.
                else if (hostUpdated) {
                    node.emitter.emit(events.hostUpdate);
                }
            }

            if (!info.hookSilent) {
                this.emitter.emit(events.hookEvent, {
                    type: info.type,
                    name: info.name,
                    region: region?.name,
                    address: data.host || data.auditor,
                    amount: (data.amount && `${data.amount} EVR`) ||
                        (data.moments && `${data.moments} ${node ? node.token : ''}`),
                    nodeId: node?.idx,
                    ledgerSeq: data.ledgerSeq
                });
            }
        });
    }

    addNode(msg) {
        let isListUpdated = false;
        let region = null;

        // Check whether there's a special region assignment for this node index.
        // If region exists in the message, assign to that region directly.
        // Otherwise take from the cycle regions.
        const specialAssignment = window.dashboardConfig.specialRegionAssignments.filter(a => a.idx === msg.idx)[0];
        if (specialAssignment) {
            region = window.dashboardConfig.regions.filter(r => r.id === specialAssignment.regionId)[0];
            if (!region)
                return;
        }
        else if (msg.region) {
            region = window.dashboardConfig.regions.filter(r => r.id === msg.region)[0];
            if (!region)
                return;
        }
        else {
            const cycleRegions = window.dashboardConfig.regions.filter(r => r.skipCycling !== true);
            const regionIndex = (msg.idx - 1) % cycleRegions.length;
            region = cycleRegions[regionIndex];
        }

        const node = new HostNode(region.name, region.pos, msg);
        if (!this.regions[region.id]) {
            this.regions[region.id] = region;
            this.regions[region.id].nodes = {};
            this.regions[region.id].nodes[msg.address] = node;
            isListUpdated = true;
        } else if (!this.regions[region.id].nodes[msg.address]) {
            this.regions[region.id].nodes[msg.address] = node;
            isListUpdated = true;
        }

        if (isListUpdated)
            this.nodeLookup[msg.address] = region.id;

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