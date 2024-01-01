import host from ".";

const createRequest = async (requestData) => {
    try {
        const response = await host.post("/api/support-requests", requestData);

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

export { createRequest };
