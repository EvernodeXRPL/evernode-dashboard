import React from "react"
import Evernode from "../services/EvernodeService"
import MapRegion from "./MapRegion";
import './MapView.scss';

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            regionList: []
        }
    }

    componentDidMount() {
        const onUpdated = (regionList) => {
            this.setState({
                regionList: regionList
            })
        };
        Evernode.evernodeManager.on(Evernode.events.regionListLoaded, onUpdated);
    }

    render() {
        const nodeList = Object.values(this.state.regionList);
        return (
            <div className="content flex-fill d-flex align-items-center">
                <div className="map-view-container">
                    <div className="map-view">
                        <div className="title-container p-3"><h3>Evernode Cluster Dashboard</h3></div>
                        {nodeList.map((n, idx) => <MapRegion key={idx} region={n} />)}
                    </div>
                </div>
            </div>
        )
    }
}

export default MapView;
