import L, { LatLngExpression } from "leaflet";
import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import placedMarkerIconImage from "../../../images/marker.png";

const placedMarkerIcon = L.icon({
    iconUrl: placedMarkerIconImage,
    iconRetinaUrl: placedMarkerIconImage,
    iconAnchor: [23, 45],
    popupAnchor: [10, -44],
    iconSize: [45, 45],
});

const PlaceableMarker = ({ onMoveCallback }: { onMoveCallback: Function }) => {
    const [position, setPosition] = useState<LatLngExpression>();

    useMapEvents({
        click: (e: { latlng: LatLngExpression }) => {
            setPosition(e.latlng);
            onMoveCallback?.(e.latlng);
        },
    });

    return position ? <Marker position={position} icon={placedMarkerIcon} /> : <></>;
};

export default PlaceableMarker;
