import React from "react"
import Hook from "./hook/Hook";
import './SideBar.scss';

class SideBar extends React.Component {
    render() {
        return (
            <div className="d-flex flex-column m-md-2 pl-3 pr-3 pb-3 pt-1 pt-lg-3 sidebar">
                <div className="row h-100">
                    <Hook />
                </div>
            </div>
        )
    }
}

export default SideBar;