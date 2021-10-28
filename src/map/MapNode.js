import React from "react"
import Evernode from "../services/EvernodeService"
import "./MapNode.scss"

const NOTIFY_LIFE = 5000;

class MapNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            regionIdx: this.props.regionIdx,
            node: this.props.node,
            count: this.props.count,
            status: null
        }
    }

    componentDidMount() {
        const { node } = this.state;
        node.on(Evernode.events.hostEvent, (event) => {
            clearTimeout(this.timeout);
            this.timeout = null;

            this.changeStatus(event.type);
            this.timeout = setTimeout(() => {
                this.changeStatus();
            }, NOTIFY_LIFE);
        });
    }

    changeStatus(status = null) {
        let state = this.state;
        state.status = status;
        this.setState(state);
        this.props.onStatusChange(this.state.regionIdx, status);
    }

    render() {
        const { regionIdx, status } = this.state;
        return (
            <div className={"map-node-marker-container event-" + (status ? `${status} front` : "active")}
                style={{ marginTop: regionIdx === 0 ? 0 : 2, marginLeft: regionIdx }}>
                <i className="fas fa-server map-node-marker"></i>
            </div>
        );
    }
}

export default MapNode;