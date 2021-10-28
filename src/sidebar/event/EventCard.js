import './EventCard.scss';

const EventCard = (props) => {
    const { data } = props;
    return (
        <div className="event-card border border-dark rounded shadow">
            <div className={"event-header clearfix event-" + (data ? data.type : "active")}>
                {data.type}
            </div>
            <ul className="list-group list-group-flush event-content">
                <li className="list-group-item event-item text-truncate">
                    <i className="fas fa-server" title="node">&nbsp;{data.region}</i>
                </li>
                <li className="list-group-item event-item text-truncate">
                    <i className="fa fa-address-card" title="node">&nbsp;{data.address}</i>
                </li>
            </ul>
        </div>
    )
}

export default EventCard;