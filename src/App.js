import React from "react"
import Evernode from "./services/EvernodeService"
import MapView from "./map/MapView"
import SideBar from "./sidebar/SideBar"
import './App.scss';

class App extends React.Component {

    componentDidMount() {
        Evernode.evernodeManager.start();

        // Dom manipulations.
        window.onresize = () => {
            window.adjustMapViewSize();
            window.adjustEventListScrollViewSize();
        };
    }

    render() {
        return (
            <div>
                <div className="wrapper d-flex flex-column flex-md-row">
                    <MapView />
                    <SideBar />
                </div>
                <div className="title-container p-3"><h3>Evernode Cluster Dashboard</h3></div>
            </div>
        )
    }
}

export default App;
