import EventEmitter from "EventEmitter"

const events = {
    regionListLoaded: "regionListLoaded",
    hostEvent: "hostEvent",
    hookEvent: "hookEvent"
}

const eventTypes = {
    RedeemReq: 'redeem-req',
    RedeemRes: 'redeem-res',
    AuditReq: 'audit-req',
    AuditRes: 'audit-res'
}

const regions = {};
const nodeRegions = {};

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
    }

    async start() {
        await this.loadHosts();
    }

    // -------------------- Mock functions ------------------------


    generateString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    async loadHosts() {
        const rows = []
        for (let i = 0; i <= 40; i++) {
            const string = this.generateString(29);
            rows.push({
                rowKey: (i + 1).toString(),
                location: string.substr(0, 3),
                size: string.substr(3, 3),
                token: string.substr(6, 3).toUpperCase(),
                address: string.substr(9).toLowerCase()
            });
        }

        for await (const row of rows) {
            this.addNode({
                idx: parseInt(row.rowKey),
                ...row
            })
        }

        this.emitter.emit(events.regionListLoaded, regions);

        this.mockListener(rows);
    }

    mockListener(rows) {
        const evs = [eventTypes.RedeemReq, eventTypes.RedeemRes, eventTypes.AuditReq, eventTypes.AuditRes];

        setInterval(() => {
            const iterations = (Math.floor(100000 + Math.random() * 900000)) % 4;
            for (let i = 0; i < iterations; i++) {
                const random = (Math.floor(100000 + Math.random() * 900000));
                const node = rows[random % rows.length];
                const event = evs[random % 4];
    
                const e = {
                    type: event,
                    address: node.address,
                    amount: (random % 100),
                    info: 'Test'
                }
    
                const regionId = nodeRegions[e.address];
                const eventNode = regions[regionId].nodes[e.address];
                if (eventNode) {
                    eventNode.emitter.emit(events.hostEvent, e)
                    this.emitter.emit(events.hookEvent, { node: eventNode, event: e });
                }
            }
        }, 3000);
    }

    // ------------------------------------------------------------------

    addNode(msg) {
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

        if (!regions[region.id]) {
            regions[region.id] = region;
            regions[region.id].nodes = {};
            regions[region.id].nodes[msg.address] = new HostNode(region.name, region.pos, msg);
        } else if (!regions[region.id].nodes[msg.address]) {
            regions[region.id].nodes[msg.address] = new HostNode(region.name, region.pos, msg);
        }

        nodeRegions[msg.address] = region.id;
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