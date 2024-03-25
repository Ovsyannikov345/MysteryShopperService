import { nearestAddress } from ".";

const getAddressFromCoordinates = async (location) => {
    try {
        const response = await nearestAddress.get(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`);

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

export { getAddressFromCoordinates };
