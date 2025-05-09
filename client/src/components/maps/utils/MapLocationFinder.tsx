import { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

const MapLocationFinder = () => {
    const map = useMapEvents({
        locationfound: (location: { latlng: LatLngExpression }) => {
            map.flyTo(location.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        map.locate();
    }, [map]);

    return <></>;
};

export default MapLocationFinder;
