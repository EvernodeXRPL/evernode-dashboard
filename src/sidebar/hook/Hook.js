import React from "react"
import EventCardList from "../event/EventCardList";
import './Hook.scss';

class Hook extends React.Component {
    render() {
        return (
            <div className="col d-flex flex-column p-2 sidebar-hook">
                <div className="row">
                    <div className="col col-lg-12">
                        <h3 className="sidebar-title">
                            Hook Actions
                        </h3>
                    </div>
                </div>
                <EventCardList />
            </div>
        )
    }
}

export default Hook;