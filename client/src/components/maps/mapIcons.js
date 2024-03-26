import L from "leaflet";
import userIconImage from "../../images/user-marker.svg";
import orderIconImage from "../../images/target-marker.svg";

let userIcon = L.icon({
    iconUrl: userIconImage,
    iconRetinaUrl: userIconImage,
    iconAnchor: [15, 55],
    popupAnchor: [10, -44],
    iconSize: [35, 65],
});

let orderIcon = L.icon({
    iconUrl: orderIconImage,
    iconRetinaUrl: orderIconImage,
    iconAnchor: [15, 55],
    popupAnchor: [10, -44],
    iconSize: [35, 65],
});

export { userIcon, orderIcon };
