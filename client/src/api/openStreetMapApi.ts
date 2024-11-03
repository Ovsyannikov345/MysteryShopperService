import { ApiError, nearestAddress, routeCalcutator } from ".";

interface Location {
    lat: number;
    lng: number;
}

const getAddressFromCoordinates = async (location: Location): Promise<any | ApiError> => {
    const response = await nearestAddress.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
    );

    return response.data;
};

const calculateRouteLength = async (startLocation: Location, endLocation: Location): Promise<any | ApiError> => {
    const response = await routeCalcutator.get(
        `https://router.project-osrm.org/route/v1/driving/${startLocation.lng},${startLocation.lat};${endLocation.lng},${endLocation.lat}`
    );

    return response;
};

export { getAddressFromCoordinates, calculateRouteLength };
