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
                {data.country && <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fa fa-map-marker"></i><span className="col-11">{data.country}</span>
                </li>}
                {data.nodeId && <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fas fa-server"></i><span className="col-11">Host {data.nodeId}</span>
                </li>}
                <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fa fa-address-card"></i><span className="col-11">{data.address}</span>
                </li>
                {data.message && <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fas fa-info-circle"></i><span className="col-11">{data.message}</span>
                </li>}
                {data.amount && <li className="row list-group-item event-item text-truncate">
                    <i className="col-1 fas fa-money-bill-alt"></i><span className="col-11">{data.amount}</span>
                </li>}
            </ul>
        </div>
    )
}

export default EventCard;