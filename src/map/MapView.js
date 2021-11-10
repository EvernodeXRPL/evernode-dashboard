import React from "react"
import Evernode from "../services/EvernodeService"
import MapRegion from "./MapRegion";
import './MapView.scss';

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            regionList: Evernode.evernodeManager.regions
        }
    }

    componentDidMount() {
        const onUpdated = (regionList) => {
            this.setState({
                regionList: regionList
            });
        };
        Evernode.evernodeManager.on(Evernode.events.regionListLoaded, onUpdated);
        // Adjust map-view size on mount.
        window.adjustMapViewSize();
    }

    render() {
        const nodeList = Object.values(this.state.regionList);
        return (
            <div className="content flex-fill d-flex align-items-center">
                <div className="map-view-container">
                    <div className="map-view">
                        <div className="title-container p-3 d-inline-flex">
                            <h3>Evernode Dashboard</h3>
                            <h5 className="pl-3 replicator-link"><a className="badge badge-secondary" href="https://hpdemo.evernode.org/replicator"><i className="fa fa-link mr-1"></i>Replicator Cluster Dashboard</a></h5>
                        </div>
                        {nodeList.map((n, idx) => <MapRegion key={idx} region={n} />)}
                    </div>
                </div>
            </div>
        )
    }
}

export default MapView;
