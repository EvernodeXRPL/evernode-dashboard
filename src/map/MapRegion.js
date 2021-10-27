import React from "react"
import MapNode from "./MapNode";
import PopUp from "../popup/PopUp";
import "./MapRegion.scss"

class MapRegion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: this.props.region,
            nodeList: Object.values(this.props.region.nodes),
            showInfo: false
        }

        this.onClick = this.onClick.bind(this);
        this.onPopUpClose = this.onPopUpClose.bind(this);
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

    render() {
        const { region, nodeList, showInfo } = this.state;
        const { pos } = region;

        const tabs = nodeList.map((n, idx) => {
            return {
                idx: idx,
                name: `${n.host} - ${n.name}`
            }
        })
        return (
            <div className="map-region-container" style={{ top: pos.top, left: pos.left }}>
                <div onClick={this.onClick}>
                    {nodeList.map((n, idx) => <MapNode key={idx} idx={idx} node={n} />)}
                </div>
                <PopUp show={showInfo} onClose={this.onPopUpClose} tabs={tabs} />
            </div>
        );
    }
}

export default MapRegion;