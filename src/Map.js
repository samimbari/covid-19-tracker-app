import React from 'react';
import "./Map.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from "./util";

function Map({countries, casesType, center, zoom}) {

    function ChaneView({center, zoom}) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }
    return (
        <MapContainer
         className="map"
         casesType={casesType}
         center={center}
         zoom={zoom}
         scrollWheelZoom={false}
         >
          <ChaneView center={center} zoom={zoom}/>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* loop through countries and draw circles */}
            {showDataOnMap(countries, casesType)}
        </MapContainer>
    );
}

export default Map;
