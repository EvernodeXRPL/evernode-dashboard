import React from "react"
import EventCardList from "../event/EventCardList";
import './Hook.scss';

class Hook extends React.Component {
    render() {
        return (
            <div className="col h-100 d-flex flex-column m-md-2 pl-3 pr-3 pb-3 pt-1 pt-lg-3 sidebar-hook">
                <div className="row">
                    <div className="col col-lg-12">
                        <h3 className="sidebar-title">
                            Hook actions
                        </h3>
                    </div>
                </div>
                <EventCardList />
            </div>
        )
    }
}

export default Hook;