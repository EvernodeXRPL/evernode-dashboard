import React from "react"
import "./PopUp.scss"

class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            header: this.props.header,
            tabs: this.props.tabs,
            pos: this.props.pos,
            selectedTab: this.props.tabs[0],
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

    onTabClick(t) {
        let state = this.state;
        state.selectedTab = t;
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
        const { header, tabs, pos, selectedTab, show } = this.state;

        return (
            <div ref={this.popupRef} className={"popup border border-dark rounded shadow " + (pos.anchor && `anchor-${pos.anchor} `) + (show && "show")}>
                {header && <div className="row m-0">
                    <div className="col text-center header">{header}</div>
                </div>}
                <div className="row m-0">
                    {tabs.map((t, idx) => <div className={"col clearfix tab " + (t === selectedTab && "active")} onClick={() => this.onTabClick(t)} key={idx}>{t.name}</div>)}
                </div>
                <ul className="list-group list-group-flush tab-content">
                    {Object.keys(selectedTab.content).map((k, idx) => <li className="list-group-item item text-truncate" key={idx}><i>{k}&nbsp;:&nbsp;{selectedTab.content[k]}</i></li>)}
                </ul>
            </div>
        );
    }
}

export default PopUp;