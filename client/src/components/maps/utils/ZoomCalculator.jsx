import { latLngBounds } from "leaflet";
import { useMap } from "react-leaflet";

const ZoomCalculator = ({ orderPosition, userPosition }) => {
    const map = useMap();

    let markerBounds = latLngBounds([]);

    markerBounds.extend([orderPosition.lat, orderPosition.lng]);
    markerBounds.extend([userPosition.lat, userPosition.lng]);

    map.fitBounds(markerBounds);

    return null;
};

export default ZoomCalculator;
