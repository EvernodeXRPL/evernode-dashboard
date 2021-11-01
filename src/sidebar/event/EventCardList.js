import React from "react"
import EventCard from "./EventCard"
import Evernode from "../../services/EvernodeService"
import { CSSTransitionGroup } from 'react-transition-group'
import './EventCardList.scss';

class EventCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        Evernode.evernodeManager.on(Evernode.events.hookEvent, (event) => {
            let state = this.state;
            state.events.push(event);
            this.setState(state);
        });

        window.adjustEventListScrollViewSize();
    }

    render() {
        const { events } = this.state;
        const eventList = events.map((event, idx) =>
            <div key={idx}>
                <div className="m-1">
                    <EventCard data={event} />
                </div>
            </div>
        );
        return (
            <div className="event-scroll-list d-flex flex-column p-1 flex-fill">
                <div className="flex-fill">
                    {/* Filler space to push the card list down */}
                </div>
                <div className="card-list-container">
                    <div className="card-list pb-1">
                        {eventList &&
                            <CSSTransitionGroup
                                transitionName="event"
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={500}>
                                {eventList}
                            </CSSTransitionGroup>}
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCardList;