import React from "react"
import Hook from "./hook/Hook";
import './SideBar.scss';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false
        }

        this.onToggle = this.onToggle.bind(this);
    }

    componentDidMount() {
        window.onresize = () => {
            if (this.state.hidden)
                this.onToggle();
        };
    }

    onToggle() {
        let state = this.state;
        state.hidden = !state.hidden;
        this.setState(state);
    }

    render() {
        const { hidden } = this.state;

        return (
            <div className={"d-flex flex-column m-md-2 p-2 pt-lg-3 sidebar " + (hidden && "hidden")}>
                <div className="menu-icon" onClick={this.onToggle}>
                    {hidden ? <i className="fas fa-bars"></i> : <i className="fas fa-times"></i>}
                </div>
                <div className={"row m-0 h-100 sidebar-content " + (hidden && "hidden")}>
                    <Hook />
                </div>
            </div>
        )
    }
}

export default SideBar;