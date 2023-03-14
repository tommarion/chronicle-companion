import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";

// @ts-ignore
const SearchControl = (props: any) => {
    const map = useMap();

    // @ts-ignore
    useEffect(() => {
        // @ts-ignore
        const searchControl = new GeoSearchControl({
            provider: props.provider,
            ...props
        });

        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
    }, [props]);

    return null;
};
export default SearchControl;