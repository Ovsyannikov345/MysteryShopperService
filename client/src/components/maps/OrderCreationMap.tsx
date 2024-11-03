import { MapContainer, TileLayer } from "react-leaflet";
import MapLocationFinder from "./MapLocationFinder";
import PlaceableMarker from "./PlaceableMarker";
import { getAddressFromCoordinates } from "../../api/openStreetMapApi";
import { LatLng } from "leaflet";
import { ApiError } from "../../api";
import { useNotifications } from "@toolpad/core";

const OrderCreationMap = ({ onLocationChange }: { onLocationChange: (newLocation: LatLng, address: any) => any }) => {
    const notifications = useNotifications();

    const changeLocation = async (newLocation: LatLng) => {
        const isApiError = (response: any | ApiError): response is ApiError => {
            return (response as ApiError).message !== undefined;
        };

        const response = await getAddressFromCoordinates({ lat: newLocation.lat, lng: newLocation.lng });

        if (isApiError(response)) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
        } else {
            const address = response.address;

            onLocationChange(newLocation, address);
        }
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={12} scrollWheelZoom={true} style={{ height: "450px", width: "100%" }}>
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
