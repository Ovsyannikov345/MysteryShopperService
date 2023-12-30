import host from ".";

const createReport = async (orderId, reportData) => {
    try {
        const response = await host.post(`/api/orders/${orderId}/reports`, reportData);

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

export { createReport };
