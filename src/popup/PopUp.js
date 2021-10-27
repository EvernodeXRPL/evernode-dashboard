import React from "react"
import "./PopUp.scss"

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: this.props.tabs,
            selectedTab: this.props.tabs[0],
            show: this.props.show
        }

        this.onTabClick = this.onTabClick.bind(this);

        this.popupRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    onTabClick(t) {
        let state = this.state;
        state.selectedTab = t;
        this.setState(state);
    }

    handleClickOutside(event) {
        if (this.popupRef && !this.popupRef.current.contains(event.target)) {
            this.props.onClose();
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }

    render() {
        this.state = {
            tabs: this.props.tabs,
            selectedTab: this.props.tabs[0],
            show: this.props.show
        }

        const { tabs, selectedTab, show } = this.state;

        if (show) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }

        return (
            <div ref={this.popupRef} className={"popup border border-dark rounded shadow " + (show ? "show" : "hide")}>
                <div className="row m-0">
                    {tabs.map((t, idx) => <div className={"col clearfix tab " + (t === selectedTab ? "active" : "")} onClick={() => this.onTabClick(t)} key={idx}>{t.name}</div>)}
                </div>
                <ul className="list-group list-group-flush tab-content">
                    <li className="list-group-item item text-truncate">
                        <i className="fas fa-home" title="node">&nbsp;{selectedTab.name}</i>
                    </li>
                </ul>
            </div>
        );
    }
}

export default PopUp;