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

    render() {
        const { show } = this.state;
        const { header, tabs, pos } = this.props;
        const selectedTab = tabs.find(t => t.idx === this.state.selectedIdx);

        return (
            <div ref={this.popupRef} className={"rounded shadow popup " + (pos.anchor && `anchor-${pos.anchor} `) + (show && "show")}>
                {header && <div className="row header">
                    <span className="col text-center p-1">{header}</span>
                </div>}
                <div className="flex m-1 p-2 popup-content">
                    <div className="row m-0">
                        {tabs.map((t, idx) => <div className={"col m-0 tab " + (t === selectedTab && "active")} onClick={() => this.onTabClick(t.idx)} key={idx}>
                            {t.name}
                        </div>)}
                    </div>
                    <div className="tab-content">
                        <div className="d-inline-block w-100 line-1">
                            <span className="badge badge-secondary address">
                                {selectedTab.content.xrpAddress}
                            </span>
                            <span className="badge badge-pill badge-secondary token">
                                {selectedTab.content.token}
                            </span>
                        </div>
                        <div className="d-inline-block w-100 line-2">
                            <span className="badge badge-secondary balance">
                                {selectedTab.content.evrBalance}<span className="text-small">EVR</span>
                            </span>
                            <span className="badge badge-secondary ip">
                                {selectedTab.content.ip}
                            </span>
                        </div>
                        <div className="d-inline-block w-100 line-3">
                            <span className="host-info">
                                <span className="badge badge-secondary p-1">{selectedTab.content.location}</span>
                                <span className="badge badge-secondary p-1">{selectedTab.content.size}</span>
                            </span>
                            {selectedTab.content.lastStatus && <span className="badge status">{selectedTab.content.lastStatus.component}</span>}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default PopUp;