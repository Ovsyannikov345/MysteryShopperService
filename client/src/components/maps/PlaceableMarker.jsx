import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

const PlaceableMarker = ({ onMoveCallback }) => {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click: (e) => {
            setPosition(e.latlng);
            onMoveCallback?.(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

export default PlaceableMarker;
