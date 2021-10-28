import './EventCard.scss';

const EventCard = (props) => {
    const { node, event } = props;
    return (
        <div className="event-card border border-dark rounded shadow">
            <div className={"event-header clearfix event-" + (event ? event.type : "active")}>
                {event.type}
            </div>
            <ul className="list-group list-group-flush event-content">
                <li className="list-group-item event-item text-truncate">
                    <i className="fas fa-server" title="node">&nbsp;{node.region}</i>
                </li>
                <li className="list-group-item event-item text-truncate">
                    <i className="fa fa-address-card" title="node">&nbsp;{node.address}</i>
                </li>
                {event.info ? <li className="list-group-item event-item text-truncate">
                    <i className="fa fa-info-circle" title="node">&nbsp;{event.info}</i>
                </li> : <></>}
            </ul>
        </div>
    )
}

export default EventCard;