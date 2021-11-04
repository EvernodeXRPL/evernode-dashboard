import React from "react"
import MapNode from "./MapNode";
import PopUp from "../popup/PopUp";
import { CSSTransitionGroup } from 'react-transition-group'
import "./MapRegion.scss"

class MapRegion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: this.props.region,
            nodeList: Object.values(this.props.region.nodes),
            showInfo: false,
            statuses: []
        }

        this.onClick = this.onClick.bind(this);
        this.onPopUpClose = this.onPopUpClose.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
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
        let nodeStatus = state.statuses.find(s => s.idx === idx);
        if (!nodeStatus) {
            state.statuses.unshift({ idx: idx, lastStatus: status, hide: false });
        }
        else {
            if (!status)
                nodeStatus.hide = true;
            else {
                nodeStatus.hide = false;
                nodeStatus.lastStatus = status;
            }
        }

        this.setState(state);
    }

    render() {
        const { region, nodeList, showInfo, statuses } = this.state;
        const { pos } = region;
        const statusComponents = statuses.map((s, idx) => {
            return {
                idx: s.idx,
                component: <span className={"col-12 badge badge-secondary p-1 region-status event-" + s.lastStatus.type} key={idx}>
                    <span className="d-inline">{s.lastStatus.name}<span className="ledger-seq ml-1">({s.lastStatus.ledgerSeq})</span></span>
                </span>,
                hide: s.hide
            }
        });

        const tabs = nodeList.map((n) => {
            return {
                idx: n.idx,
                name: `Host ${n.idx}`,
                content: {
                    ip: n.ip,
                    evrBalance: n.evrBalance,
                    xrpAddress: n.address,
                    location: n.location,
                    size: n.size,
                    token: n.token,
                    lastStatus: statusComponents.find(s => s.idx === n.idx)
                }
            }
        });

        const statusList = statusComponents.filter(s => !s.hide).map(s => s.component);

        const popupPos = {
            anchor: pos.anchor
        }

        return (
            <div className="map-region-container" style={{ top: pos.top, left: pos.left }}>
                <div onClick={this.onClick}>
                    {nodeList.map((n, idx) => <MapNode key={idx} idx={idx} node={n} selected={showInfo} onStatusChange={this.onStatusChange} />)}
                </div>
                {showInfo && <div className="popup-container"><PopUp onClose={this.onPopUpClose} header={region.name} tabs={tabs} pos={popupPos}/></div>}
                <div className={"row m-1 region-status-container " + (pos.anchor && `anchor-${pos.anchor}`)}>
                    {statusList && <CSSTransitionGroup
                        transitionName="status"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}>
                        {statusList}
                    </CSSTransitionGroup>}
                </div>
            </div>
        );
    }
}

export default MapRegion;