import host from ".";

const getOrders = async () => {
    try {
        const response = await host.get("/api/company/orders");

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

const createOrder = async (orderData) => {
    try {
        const response = await host.post("/api/orders", orderData);

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

export { getOrders, createOrder };
