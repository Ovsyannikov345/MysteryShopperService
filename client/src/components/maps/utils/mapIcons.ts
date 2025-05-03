import L from "leaflet";
import markerIconImage from "../../../images/marker.png";

const markerIcon = L.icon({
    iconUrl: markerIconImage,
    iconRetinaUrl: markerIconImage,
    iconAnchor: [23, 45],
    popupAnchor: [10, -44],
    iconSize: [45, 45],
});

export { markerIcon };
