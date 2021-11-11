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
        const w = 255;
        const h = 150;
        const mapView = document.getElementsByClassName("map-view")[0];
        const parent = mapView.parentElement.parentElement;

        const calculateRatio = function () {
            const maxw = parent.clientWidth;
            const maxh = parent.clientHeight;
            return Math.min(maxw / w, maxh / h);
        }

        if (mapView) {
            let ratio = calculateRatio();
            // If ratio is 0, calculate the ratio again after 500ms.
            // Because the map-view parent might not've resized yet.
            if (ratio === 0) {
                setTimeout(() => {
                    ratio = calculateRatio();
                    mapView.style.width = (w * ratio) + "px";
                    mapView.style.height = (h * ratio) + "px";
                }, 500);
            }
            else {
                mapView.style.width = (w * ratio) + "px";
                mapView.style.height = (h * ratio) + "px";
            }
        }
    }

    window.adjustEventListScrollViewSize = function () {
        const eventListScroll = document.getElementsByClassName("event-scroll-list")[0];
        if (eventListScroll) {
            eventListScroll.style.height = (eventListScroll.parentElement.clientHeight - 300) + "px"
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