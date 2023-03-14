import * as React from "react"
import {useEffect, useState} from "react";
import {getBaseURL} from "../../js/common";

type LocationData = {
    id:     string
    name:   string
}

type LocationProps = {
    admin:                  boolean
    locationId:             string
    campaignId:             string
    handleLocationClick:    Function
}

export default function Location(props: LocationProps) {
    const [locations, setLocations] = useState<LocationData[]>(null);

    useEffect(() => {
        fetch(getBaseURL() + "campaign/" + props.campaignId + "/locations")
            .then((result) => result.json())
            .then((response) => {
                console.log(response);
                setLocations(response)
            });
    }, []);

    return (
        <div id={'locations__btns__wrapper'}>
            <div id={'add-location'} className={'btn'}>+</div>
            <div className={'title'}>Locations</div>
            {locations ?
            locations.length === 0 ? <div className={'center'}>No Locations Yet!</div> :
                locations.map((location) =>
                    <div className={'btn btn-location' + (props.locationId === location.id ? ' active' : '')}
                         onClick={() => props.handleLocationClick(location.id)}>{location.name}</div>
                ) :
                <div className={'center'}>Loading...</div>}
        </div>
    )
}