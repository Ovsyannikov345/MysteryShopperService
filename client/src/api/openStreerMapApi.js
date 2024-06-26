import { nearestAddress, routeCalcutator } from ".";

const getAddressFromCoordinates = async (location) => {
    try {
        const response = await nearestAddress.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
        );

        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            console.log("Server did not respond.");
        } else {
            console.log("Error while creating request");
        }
    }
};

const calculateRouteLength = async (startLocation, endLocation) => {
    try {
        const response = await routeCalcutator.get(
            `https://router.project-osrm.org/route/v1/driving/${startLocation.lng},${startLocation.lat};${endLocation.lng},${endLocation.lat}`
        );

        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            console.log("Server did not respond.");
        } else {
            console.log("Error while creating request");
        }
    }
};

export { getAddressFromCoordinates, calculateRouteLength };
