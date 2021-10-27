import React from "react"
import Evernode from "../services/EvernodeService"
import "./MapNode.scss"

class MapNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idx: this.props.idx,
            node: this.props.node,
            count: this.props.count,
            event: null
        }
    }

    componentDidMount() {
        const { node } = this.state;
        node.on(Evernode.events.hostEvent, (event) => {
            clearTimeout(this.timeout);
            this.timeout = null;

            let state = this.state;
            state.event = event;
            this.setState(state);
            this.timeout = setTimeout(() => {
                state.event = null;
                this.setState(state);
            }, 1000);
        });
    }

    render() {
        const { idx, event } = this.state;
        return (
            <div className={"map-node-marker-container event-" + (event ? event.type : "active")} style={{ marginTop: (idx * 2), marginLeft: (idx * 2) }}>
                {event ? <div className="node-event-container">
                    <span className={"node-event badge badge-secondary p-1 event-" + (event ? event.type : "active")}>
                        <span className="d-none d-lg-inline">{event.type}</span>
                    </span>
                </div> : <></>}
                <i className="fas fa-home map-node-marker"></i>
            </div>
        );
    }
}

export default MapNode;