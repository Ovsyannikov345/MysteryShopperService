import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

const MapLocationFinder = () => {
    const map = useMapEvents({
        locationfound: (location) => {
            console.log("User location found");
            map.setView(location.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        map.locate();
    }, []);

    return null;
};

export default MapLocationFinder;
