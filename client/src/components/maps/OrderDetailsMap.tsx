import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { markerIcon } from "./utils/mapIcons";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNotifications } from "@toolpad/core";
import useOSMApi from "../../hooks/useOSMApi";

interface OrderDetailsMapProps {
    orderPosition: {
        lat: number;
        lng: number;
    };
}

const OrderDetailsMap = ({ orderPosition }: OrderDetailsMapProps) => {
    const notifications = useNotifications();

    const { getRouteLength } = useOSMApi();

    const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);

    const [routeLength, setRouteLength] = useState<number | null>();

    useEffect(() => {
        const loadUserPosition = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserPosition({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    () => notifications.show("Geolocation permission denied", { severity: "error", autoHideDuration: 3000 })
                );
            }
        };

        loadUserPosition();
    }, [getRouteLength, notifications, orderPosition]);

    useEffect(() => {
        // TODO try later
        const loadLength = async () => {
            if (!userPosition) {
                return;
            }

            const response = await getRouteLength(userPosition, orderPosition);

            if ("error" in response) {
                setRouteLength(null);
                return;
            }

            setRouteLength(response.distance);
        };

        loadLength();
    }, [getRouteLength, orderPosition, userPosition]);

    const getDistanceString = () => {
        if (routeLength === undefined) {
            return "Calculating...";
        }

        if (routeLength === null) {
            return "Distance not available";
        }

        if (routeLength < 1000) {
            return routeLength.toFixed(0) + " m.";
        }

        return (routeLength / 1000).toFixed(1) + " km.";
    };

    return (
        <>
            <MapContainer
                center={[orderPosition.lat, orderPosition.lng]}
                zoom={12}
                scrollWheelZoom={true}
                style={{ width: "100%", aspectRatio: "16/9" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={orderPosition} icon={markerIcon} />
            </MapContainer>
            <Typography mb={2} ml={2}>
                Distance to order: {getDistanceString()}
            </Typography>
        </>
    );
};

export default OrderDetailsMap;
