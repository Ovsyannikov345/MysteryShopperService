import { MapContainer, TileLayer } from "react-leaflet";
import MapLocationFinder from "./utils/MapLocationFinder";
import PlaceableMarker from "./utils/PlaceableMarker";
import { LatLng } from "leaflet";
import { useNotifications } from "@toolpad/core";
import useOSMApi from "../../hooks/useOSMApi";
import "./map.css";

export interface Location {
    lat: number;
    lng: number;
}

const OrderCreationMap = ({ onLocationChange }: { onLocationChange: (newLocation: LatLng, address: string) => void }) => {
    const notifications = useNotifications();

    const { getAddressFromCoordinates } = useOSMApi();

    const changeLocation = async (newLocation: LatLng) => {
        const response = await getAddressFromCoordinates({ lat: newLocation.lat, lng: newLocation.lng });

        if ("error" in response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        onLocationChange(newLocation, response.display_name);
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={12} scrollWheelZoom={true} style={{ width: "100%", aspectRatio: "16/9" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapLocationFinder />
            <PlaceableMarker onMoveCallback={changeLocation} />
        </MapContainer>
    );
};

export default OrderCreationMap;
