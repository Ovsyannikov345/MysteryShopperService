import { MapContainer, TileLayer } from "react-leaflet";
import MapLocationFinder from "./MapLocationFinder";
import PlaceableMarker from "./PlaceableMarker";
import { getAddressFromCoordinates } from "../../api/openStreerMapApi";

const OrderCreationMap = ({ onLocationChange }) => {
    const changeLocation = async (newLocation) => {
        console.log(newLocation);

        const response = await getAddressFromCoordinates(newLocation);

        if (response.status !== 200) {
            console.log("Error while searching nearest services");
        }

        const address = response.data.address;

        onLocationChange(newLocation, address);
    };

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: "450px", width: "100%" }}
        >
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
