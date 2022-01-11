import React from "react"
import PopUp from "../popup/PopUp";
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import "./MapCountry.scss"
import Evernode from "../services/EvernodeService"

const NOTIFY_LIFE = 5000;

class MapCountry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            country: this.props.country,
            nodeList: Object.values(this.props.country.nodes),
            showInfo: false,
            statuses: []
        }

        this.onClick = this.onClick.bind(this);
        this.onPopUpClose = this.onPopUpClose.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.onHostUpdate = this.onHostUpdate.bind(this);
        const timeoutRefs = [];

        Evernode.evernodeManager.on(Evernode.events.hostEvent, e => {
            if (e.countryCode === this.state.country.code) {
                clearTimeout(timeoutRefs[e.idx]);
                timeoutRefs[e.idx] = null;
                this.onStatusChange(e.idx, e);

                timeoutRefs[e.idx] = setTimeout(() => {
                    this.onStatusChange(e.idx);
                }, NOTIFY_LIFE);
            }
        });

        Evernode.evernodeManager.on(Evernode.events.hostUpdate, e => {
            if (e.countryCode === this.state.country.code) {
                this.onHostUpdate();
            }
        });
    }

    onClick() {
        let state = this.state;
        state.showInfo = true;
        this.setState(state);
    }

    onPopUpClose() {
        let state = this.state;
        state.showInfo = false;
        this.setState(state);
    }

    onStatusChange(idx, status) {
        let state = this.state;
        if (status) {
            // Remove existing statueses and add new to the top.
            state.statuses = state.statuses.filter(s => s.idx !== idx);
            state.statuses.unshift({ idx: idx, lastStatus: status, hide: false });
        }
        else {
            // If there's a last status, set hide flag to true.
            let nodeStatus = state.statuses.find(s => s.idx === idx);
            if (nodeStatus)
                nodeStatus.hide = true;
        }

        this.setState(state);
    }

    onHostUpdate() {
        this.setState(this.state);
    }

    getCssClass(status) {
        return status ? `event-${status.type} front` : (this.state.showInfo ? "selected" : "active");
    }

    render() {
        const { country, nodeList, showInfo, statuses } = this.state;
        const { pos } = country;
        const statusComponents = statuses.map((s, idx) => {
            return {
                idx: s.idx,
                component: <span className={"col-12 badge badge-secondary p-1 country-status event-" + s.lastStatus.type} key={idx}>
                    <span className="d-inline">{s.lastStatus.name}{s.lastStatus.ledgerSeq && <span className="ledger-seq ml-1">({s.lastStatus.ledgerSeq})</span>}</span>
                </span>,
                hide: s.hide,
                lastStatus: s.lastStatus
            }
        });

        const tabs = nodeList.map((n) => {
            return {
                idx: n.idx,
                name: `${n.idx}`,
                content: {
                    evrBalance: n.evrBalance,
                    xrpAddress: n.address,
                    countryCode: n.countryCode,
                    cpuMicroSec: n.cpuMicroSec,
                    description: n.description,
                    diskMb: n.diskMb,
                    ramMb: n.ramMb,
                    lastHeartbeatLedgerIndex: n.lastHeartbeatLedgerIndex,
                    lockedTokenAmount: n.lockedTokenAmount,
                    token: n.token,
                    instanceCount: n.instanceCount,
                    lastStatus: statusComponents.find(s => s.idx === n.idx),
                    online: n.online
                }
            }
        });

        let statusList = statusComponents.filter(s => !s.hide);
        let status = null;
        if (statusList.length > 0) {
            status = statusList[0].lastStatus;
            statusList = [<CSSTransition key={0} timeout={500} classNames="status">
                {statusList[0]?.component}
            </CSSTransition>];

        }

        const popupPos = {
            anchor: pos.anchor
        }
        return (
            <div className="map-country-container" style={{ top: pos.top, left: pos.left }}>
                <div onClick={this.onClick}>
                    <div className={"map-node-marker-container " + this.getCssClass(status)}>
                        <i className="fas fa-server map-node-marker" style={{ fontSize: `${Evernode.evernodeManager.getMarkerSize(nodeList.length)}rem` }}></i>
                    </div>
                </div>
                {showInfo && <div className="popup-container"><PopUp onClose={this.onPopUpClose} header={country.name} tabs={tabs} pos={popupPos} /></div>}
                <div className={"row m-1 country-status-container " + (pos.anchor && `anchor-${pos.anchor}`)}>
                    {statusList && <TransitionGroup>{statusList}</TransitionGroup>}
                </div>
            </div>
        );
    }
}

export default MapCountry;