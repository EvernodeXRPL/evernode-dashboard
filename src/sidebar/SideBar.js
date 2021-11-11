import React from "react"
import Events from "./events/Events";
import './SideBar.scss';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false
        }

        this.onToggle = this.onToggle.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onResize() {
        // If the sidebar is hidden, Show it on resize.
        if (this.state.hidden)
            this.onToggle();
    }

    onToggle() {
        let state = this.state;
        state.hidden = !state.hidden;
        this.setState(state);
    }

    render() {
        const { hidden } = this.state;

        return (
            <div className={"d-flex flex-column m-md-2 p-1 sidebar " + (hidden && "hidden")}>
                <div className="menu-icon" onClick={this.onToggle}>
                    {hidden ? <i className="fas fa-bars"></i> : <i className="fas fa-times"></i>}
                </div>
                <div className={"row m-0 h-100 sidebar-content " + (hidden && "hidden")}>
                    <Events />
                </div>
            </div>
        )
    }
}

export default SideBar;