import './EventCard.scss';

const EventCard = (props) => {
    const { data } = props;
    return (
        <div className="event-card border border-dark rounded shadow mb-2">
            <div className={"event-header clearfix event-" + (data ? data.type : "active")}>
                {data.name}
                {data.ledgerSeq && <span className="ledger">(&nbsp;{data.ledgerSeq}&nbsp;)</span>}
            </div>
            <ul className="list-group list-group-flush event-content">
                {data.amount && <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fa fa-map-marker" title="node"></i><span className="col-11">{data.region}</span>
                </li>}
                {data.nodeId && <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fas fa-server" title="node"></i><span className="col-11">Host {data.nodeId}</span>
                </li>}
                <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fa fa-address-card" title="node"></i><span className="col-11">{data.address}</span>
                </li>
                {data.amount && <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fa fa-money" title="node"></i><span className="col-11">{data.amount}</span>
                </li>}
            </ul>
        </div>
    )
}

export default EventCard;