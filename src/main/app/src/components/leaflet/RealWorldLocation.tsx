import * as React from "react";
import {useEffect, useState} from "react";
import {getBaseURL} from "../../js/common";
import 'leaflet/dist/leaflet.css';

import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import {OpenStreetMapProvider} from "leaflet-geosearch";
import SearchControl from "./SearchControl";
import 'leaflet-geosearch/dist/geosearch.css';
import * as L from 'leaflet';
import {LatLngExpression} from "leaflet";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

type RealWorldLocationProps = {
    locationId: string
}

export default function RealWorldLocation(props: RealWorldLocationProps) {
    const [latLong, setLatLong] = useState<LatLngExpression>(null);

    useEffect(() => {
        if (props.locationId) {
            fetch(getBaseURL() + 'locations/' + props.locationId)
                .then((result) => result.json())
                .then((locationData) => {
                    if (locationData) {
                        prov.search({ query: locationData.address }).then((result) => {
                            setLatLong([result[0].y, result[0].x]);
                            console.log(latLong);
                        });
                    }
                })
        }
    }, [props.locationId]);

    const prov = new OpenStreetMapProvider();

    console.log(latLong);

    return (
        <div>
            <MapContainer center={[51.505, -0.09]} zoom={15} scrollWheelZoom={false}>
                {latLong ? <PanMap mapCenter={latLong} /> :
                    <SearchControl
                        provider={prov}
                        showMarker={true}
                        showPopup={false}
                        maxMarkers={3}
                        retainZoomLevel={false}
                        animateZoom={true}
                        autoClose={false}
                        searchLabel={"Enter an address to search"}
                        keepResult={true}
                        style={'bar'}
                    />}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={latLong ? latLong : [51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
function PanMap(props: any) : any {
    const map = useMap();
    map.panTo(props.mapCenter);
    return null;
}