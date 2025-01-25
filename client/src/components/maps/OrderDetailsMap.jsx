import { MapContainer, Marker, TileLayer } from "react-leaflet";
import ZoomCalculator from "./utils/ZoomCalculator";
import { orderIcon, userIcon } from "./utils/mapIcons";
import { Typography } from "@mui/material";
import { calculateRouteLength } from "../../api/openStreetMapApi";
import { useEffect, useState } from "react";

const OrderDetailsMap = ({ orderPosition }) => {
    // Mock Data
    const userPosition = {
        lat: 53.90112,
        lng: 30.33562,
    };

    const [routeLength, setRouteLength] = useState(null);

    useEffect(() => {
        const loadLength = async () => {
            const response = await calculateRouteLength(userPosition, orderPosition);

            if (response.status !== 200) {
                console.log("Error while loading distance");
                return;
            }

            if (response.data.code !== "Ok") {
                setRouteLength(undefined);
                return;
            }

            setRouteLength(response.data.routes[0].distance);
        };

        loadLength();
    });

    const getDistanceString = () => {
        if (routeLength == null) {
            return "Рассчитывается..."
        }
        
        if (routeLength === undefined) {
            return "Не удалось рассчитать";
        }

        if (routeLength < 1000) {
            return routeLength.toFixed(0) + " м.";
        }

        return (routeLength / 1000).toFixed(1) + " км.";
    };

    return (
        <>
            <MapContainer
                center={[orderPosition.lat, orderPosition.lng]}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: "450px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={orderPosition} icon={orderIcon} />
                <Marker position={userPosition} icon={userIcon} />
                <ZoomCalculator orderPosition={orderPosition} userPosition={userPosition} />
            </MapContainer>
            <Typography>Расстояние до заказа: {getDistanceString()}</Typography>
        </>
    );
};

export default OrderDetailsMap;
