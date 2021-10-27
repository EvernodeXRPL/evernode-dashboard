import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

if (window.isUnsupportedBrowser) {
    document.body.innerHTML =
        "<p class='lead m-4 text-center' style='font-size:2rem'>You are using an unsupported browser.<br />Sorry for the inconvenience.</p>";
}
else {
    window.adjustMapViewSize = function () {
        const mapView = document.getElementsByClassName("map-view")[0];
        if (mapView) {
            const w = 255;
            const h = 150;

            const parent = mapView.parentElement.parentElement;
            const maxw = parent.clientWidth;
            const maxh = parent.clientHeight;
            const ratio = Math.min(maxw / w, maxh / h);

            mapView.style.width = (w * ratio) + "px";
            mapView.style.height = (h * ratio) + "px";
        }
    }

    window.adjustEventListScrollViewSize = function () {
        const eventListScroll = document.getElementsByClassName("event-scroll-list")[0];
        if (eventListScroll) {
            const nodeNumBar = document.getElementsByClassName("node-num-bar")[0];
            const numBarHeight = nodeNumBar ? nodeNumBar.clientHeight : 0;
            eventListScroll.style.height = (document.body.clientHeight - numBarHeight - 200) + "px"
        }
    }

    window.onresize = () => {
        window.adjustMapViewSize();
        window.adjustEventListScrollViewSize();
    };

    ReactDOM.render(
        <App />,
        document.getElementById('root'),
        window.adjustMapViewSize
    );
}