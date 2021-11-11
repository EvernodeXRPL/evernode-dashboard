import React from "react"
import EventCardList from "./event/EventCardList";
import './Events.scss';

class Events extends React.Component {
    render() {
        return (
            <div className="col d-flex flex-column p-1 sidebar-events">
                <EventCardList />
            </div>
        )
    }
}

export default Events;