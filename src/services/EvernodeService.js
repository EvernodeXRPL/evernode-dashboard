import EventEmitter from "EventEmitter"
const { TableClient, AzureSASCredential } = require("@azure/data-tables");
const signalR = require("@microsoft/signalr");

const signalREvents = {
    HostRegistered: "hostRegistered",
    HostDeregistered: "hostDeregistered",
    Redeem: "redeem",
    RedeemSuccess: "redeemSuccess",
    RedeemError: "redeemError",
    RefundRequest: "refundRequest",
    AuditRequest: "auditRequest",
    AuditSuccess: "auditSuccess"
}

const eventPlaceholders = {
    hostRegistered: 'host-reg',
    hostDeregistered: 'host-dereg',
    redeem: 'redeem-req',
    redeemSuccess: 'redeem-suc',
    redeemError: 'redeem-err',
    refundRequest: 'refund-req',
    auditRequest: 'audit-req',
    auditSuccess: 'audit-suc'
}

const events = {
    regionListLoaded: "regionListLoaded",
    hostEvent: "hostEvent",
    hookEvent: "hookEvent"
}

class HostNode {
    constructor(name, pos, node) {
        this.region = name;
        this.pos = pos;

        this.idx = node.idx;
        this.location = node.location;
        this.size = node.size;
        this.token = node.token;
        this.address = node.address;

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
    }

    async loadHosts() {
        const tableClient = new TableClient(
            window.dashboardConfig.tableAccount,
            window.dashboardConfig.tableName,
            new AzureSASCredential(window.dashboardConfig.tableSas));

        const rows = await tableClient.listEntities({ queryOptions: { filter: `PartitionKey eq '${window.dashboardConfig.partitionKey}'` } });

        let isListUpdated = false;
        for await (const row of rows) {
            const hosts = JSON.parse(row.hosts);
            for (const host of hosts) {
                if (this.addNode({
                    idx: this.nextIdx,
                    location: host?.location,
                    size: host?.instanceSize,
                    token: host?.token,
                    address: host?.address
                })) {
                    isListUpdated = true;
                }
            }
        }
        if (isListUpdated)
            this.emitter.emit(events.regionListLoaded, this.regions);
    }

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

            let node = null;
            let region = null;

            if (event === signalREvents.HostRegistered) {
                node = this.addNode({
                    idx: this.nextIdx,
                    location: data.location,
                    size: data.instanceSize,
                    token: data.token,
                    address: data.host
                });
                if (node) {
                    this.emitter.emit(events.regionListLoaded, this.regions);
                    region = this.regions[this.nodeLookup[data.host]];
                }
            }
            else if (event === signalREvents.HostDeregistered) {
                region = this.regions[this.nodeLookup[data.host]];
                if (this.removeNode(data.host))
                    this.emitter.emit(events.regionListLoaded, this.regions);
            }
            else {
                region = this.regions[this.nodeLookup[data.host]];
                node = region.nodes[data.host];
            }

            const eventType = eventPlaceholders[event];

            // Emit event to node.
            if (node)
                node.emitter.emit(events.hostEvent, { type: eventType });

            // Emit event to hook.
            this.emitter.emit(events.hookEvent, {
                type: eventType,
                region: region?.name,
                address: data.host
            });
        });
    }

    addNode(msg) {
        let isListUpdated = false;
        let region = null;

        // Check whether there's a special region assignment for this node index.
        const specialAssignment = window.dashboardConfig.specialRegionAssignments.filter(a => a.idx === msg.idx)[0];
        if (specialAssignment) {
            region = window.dashboardConfig.regions.filter(r => r.id === specialAssignment.regionId)[0];
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

        if (isListUpdated) {
            this.nodeLookup[msg.address] = region.id;
            this.nextIdx++;
        }

        return isListUpdated ? node : null;
    }

    removeNode(address) {
        let isListUpdated = false;

        const regionId = this.nodeLookup[address];
        if (!regionId)
            return false;

        delete this.nodeLookup[address];
        const region = this.regions[regionId];

        if (region && region.nodes[address]) {
            delete this.regions[regionId].nodes[address];
            isListUpdated = true;
        }

        if (region && Object.keys(region.nodes).length === 0) {
            delete this.regions[regionId];
            isListUpdated = true;
        }

        return isListUpdated;
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