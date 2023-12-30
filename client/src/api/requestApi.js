import host from ".";

const createRequest = async (orderId) => {
    try {
        const response = await host.post(`/api/orders/${orderId}/requests`);

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

const acceptRequest = async (id) => {
    try {
        const response = await host.put(`/api/requests/${id}`, { accepted: true });

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

const rejectRequest = async (id) => {
    try {
        const response = await host.put(`/api/requests/${id}`, { accepted: false });

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

export { createRequest, acceptRequest, rejectRequest };
