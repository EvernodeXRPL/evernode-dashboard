import React from "react"
import Evernode from "../services/EvernodeService"
import "./MapNode.scss"

const NOTIFY_LIFE = 5000;

class MapNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null
        }
    }

    componentDidMount() {
        const { node } = this.props;
        node.on(Evernode.events.hostEvent, (event) => {
            clearTimeout(this.timeout);
            this.timeout = null;

            this.changeStatus(event);
            // Set status disappear after NOTIFY_LIFE.
            this.timeout = setTimeout(() => {
                this.changeStatus();
            }, NOTIFY_LIFE);
        });

        node.on(Evernode.events.hostUpdate, () => {
            this.props.onHostUpdate();
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
        this.props.onStatusChange(this.props.node.idx, state.status);
    }

    getCssClass(status) {
        return !this.props.node.online ? "inactive" : (status ? `event-${status.type} front` : (this.props.selected ? "selected" : "active"));
    }

    render() {
        const { status } = this.state;
        return (
            <div className={"map-node-marker-container " + this.getCssClass(status)}
                style={{ marginTop: this.props.idx === 0 ? 0 : 3, marginLeft: this.props.idx * 4 }}>
                <i className="fas fa-server map-node-marker"></i>
            </div>
        );
    }
}

export default MapNode;