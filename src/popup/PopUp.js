import React from "react"
import "./PopUp.scss"

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIdx: this.props.tabs[0].idx,
            show: false
        }

        this.onTabClick = this.onTabClick.bind(this);

        this.popupRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.onOpen();
    }

    onTabClick(tabIdx) {
        let state = this.state;
        state.selectedIdx = tabIdx;
        this.setState(state);
    }

    handleClickOutside(event) {
        if (this.popupRef && !this.popupRef.current.contains(event.target)) {
            document.removeEventListener('mousedown', this.handleClickOutside);
            this.onClose();
        }
    }

    onOpen() {
        setTimeout(() => {
            let state = this.state;
            state.show = true;
            this.setState(state);
        });
    }

    onClose() {
        let state = this.state;
        state.show = false;
        this.setState(state);
        setTimeout(() => {
            this.props.onClose();
        }, 500);
    }

    getDisplayText(text, maxLength) {
        return text.length > maxLength ? `${text.substring(0, maxLength)}..` : text;
    }

    getDisplayBalance(balance) {
        return Number(balance).toFixed(3);
    }

    render() {
        const { show } = this.state;
        const { header, tabs, pos } = this.props;
        const selectedTab = tabs.find(t => t.idx === this.state.selectedIdx);

        return (
            <div ref={this.popupRef} className={"rounded shadow popup " + (pos.anchor && `anchor-${pos.anchor} `) + (show && "show")}>
                {header && <div className="row header">
                    <span className="col text-center p-1">{header}</span>
                </div>}
                <div className="flex m-1 popup-content">
                    <div className="row m-0">
                        {tabs.map((t, idx) => <div className={"col m-0 tab " + (t === selectedTab && "active")} onClick={() => this.onTabClick(t.idx)} key={idx}>
                            {t.name}
                        </div>)}
                    </div>
                    <div className="tab-content">
                        <div className="row">
                            <div className="col text-center">
                                <span className="badge badge-secondary address">
                                    {selectedTab.content.xrpAddress}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <ul className="col-5 pr-0 list-group list-group-flush list-content">
                                <li className="row list-group-item list-item text-truncate">
                                    <i className="col-1 fas fa-at"></i><span className="col-11">{selectedTab.content.ip}</span>
                                </li>
                                <li className="row list-group-item list-item text-truncate">
                                    <i className="col-1 fa fa-cubes"></i><span className="col-11">{selectedTab.content.instanceCount}</span>
                                </li>
                            </ul>
                            <ul className="col-7 pr-0 list-group list-group-flush list-content">
                                <li className="row list-group-item list-item text-truncate">
                                    <i className="col-1 fa fa-location-arrow"></i><span className="col-11">{this.getDisplayText(selectedTab.content.location, 10)}</span>
                                </li>
                                <li className="row list-group-item list-item text-truncate">
                                    <i className="col-1 fa fa-hdd"></i><span className="col-11">{this.getDisplayText(`CPU:${selectedTab.content.cpuMicroSec};RAM:${selectedTab.content.ramMb};Disk:${selectedTab.content.diskMb}`, 15)}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col">
                                <span className="badge badge-secondary balance">
                                    {this.getDisplayBalance(selectedTab.content.evrBalance)}<span className="text-small">EVR</span>
                                </span>
                                <span className="badge badge-secondary token">
                                    {selectedTab.content.token}
                                </span>
                                {selectedTab.content.lastStatus && <span className="badge status">{selectedTab.content.lastStatus.component}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default PopUp;