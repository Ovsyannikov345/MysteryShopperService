import { LatLngExpression } from "leaflet";
import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { markerIcon } from "./mapIcons";

const PlaceableMarker = ({ onMoveCallback }: { onMoveCallback: Function }) => {
    const [position, setPosition] = useState<LatLngExpression>();

    useMapEvents({
        click: (e: { latlng: LatLngExpression }) => {
            setPosition(e.latlng);
            onMoveCallback?.(e.latlng);
        },
    });

    return position ? <Marker position={position} icon={markerIcon} /> : <></>;
};

export default PlaceableMarker;
