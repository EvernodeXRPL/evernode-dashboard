import EventEmitter from "EventEmitter"

const connectionStatus = {
    none: 0,
    connected: 1
}

const events = {
    regionListUpdated: "regionListUpdated",
    hostEvent: "hostEvent",
    hookEvent: "hookEvent"
}

const eventTypes = {
    RedeemReq: 'redeem-req',
    RedeemRes: 'redeem-res',
    AuditReq: 'audit-req',
    AuditRes: 'audit-res'
}

const hostRegions = {};

class HostNode {
    constructor(name, host, idx, pos, nodeManager) {
        this.name = name;
        this.host = host;
        this.idx = idx;
        this.pos = pos;
        this.nodeManager = nodeManager;

        this.status = connectionStatus.none;
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
    }

    async start() {
        await this.loadHosts();

        this.mockListener();
    }

    async loadHosts() {
        let isListUpdated = false;
        const rows = []
        for (let i = 0; i <= 40; i++) {
            rows.push({
                rowKey: (i + 1).toString(),
                uri: i.toString()
            });
        }

        for await (const row of rows) {
            if (this.addNode({
                idx: parseInt(row.rowKey),
                uri: row.uri
            })) {
                isListUpdated = true;
            }

        }
        if (isListUpdated)
            this.emitter.emit(events.regionListUpdated, hostRegions);
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

        if (!hostRegions[region.id]) {
            hostRegions[region.id] = region;
            hostRegions[region.id].nodes = {};
            hostRegions[region.id].nodes[msg.uri] = new HostNode(region.name, msg.uri, msg.idx, region.pos, exports.evernodeManager);
            isListUpdated = true;
        } else if (!hostRegions[region.id].nodes[msg.uri]) {
            isListUpdated = true;
            hostRegions[region.id].nodes[msg.uri] = new HostNode(region.name, msg.uri, msg.idx, region.pos, exports.evernodeManager);
        }

        return isListUpdated;
    }

    mockListener() {
        const evs = [
            {
                type: eventTypes.RedeemReq
            },
            {
                type: eventTypes.RedeemRes
            },
            {
                type: eventTypes.AuditReq
            },
            {
                type: eventTypes.AuditRes
            }
        ];

        let hi = 0
        setInterval(() => {
            const i = (Math.floor(100000 + Math.random() * 900000)) % 4;
            const event = evs[i];
            const host = (hi % 40) + 1
            for (let region of Object.values(hostRegions)) {
                let node = region.nodes[host];
                if (node) {
                    node.emitter.emit(events.hostEvent, event)
                    this.emitter.emit(events.hookEvent, { node: node, event: event });
                }
            }
            hi++;
        }, 3000);
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