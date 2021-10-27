import React from "react"
import Evernode from "./services/EvernodeService"
import MapView from "./map/MapView"
import SideBar from "./sidebar/SideBar"
import './App.scss';

class App extends React.Component {

    componentDidMount() {
        Evernode.evernodeManager.start();
    }

    render() {
        return (
            <div className="wrapper d-flex flex-column flex-md-row">
                <MapView />
                <SideBar />
            </div>
        )
    }
}

export default App;
