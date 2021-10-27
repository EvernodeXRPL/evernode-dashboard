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
                    <i className="fas fa-home" title="node">&nbsp;{node.host} - {node.name}</i>
                </li>
            </ul>
        </div>
    )
}

export default EventCard;