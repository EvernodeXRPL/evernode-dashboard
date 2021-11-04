import React from "react"
import Evernode from "../services/EvernodeService"
import "./MapNode.scss"

const NOTIFY_LIFE = 5000;

class MapNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idx: this.props.idx,
            node: this.props.node,
            selected: this.props.selected,
            status: null
        }
    }

    componentDidMount() {
        const { node } = this.state;
        node.on(Evernode.events.hostEvent, (event) => {
            clearTimeout(this.timeout);
            this.timeout = null;

            this.changeStatus(event);
            // Set status disappear after NOTIFY_LIFE.
            this.timeout = setTimeout(() => {
                this.changeStatus();
            }, NOTIFY_LIFE);
        });
    }

    changeStatus(event = null) {
        let state = this.state;
        state.status = event ? {
            type: event.type,
            name: event.name,
            ledgerSeq: event.ledgerSeq
        } : null;
        this.setState(state);
        this.props.onStatusChange(this.state.node.idx, state.status);
    }

    render() {
        const { idx, status } = this.state;
        return (
            <div className={"map-node-marker-container event-" + (status ? `${status.type} front` : (this.props.selected ? "selected" : "active"))}
                style={{ marginTop: idx === 0 ? 0 : 3, marginLeft: idx * 4 }}>
                <i className="fas fa-server map-node-marker"></i>
            </div>
        );
    }
}

export default MapNode;