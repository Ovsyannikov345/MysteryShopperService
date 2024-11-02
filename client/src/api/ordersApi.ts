import { host } from ".";

interface OrderData {
    title: string;
    description: string;
    place: string;
    timeToComplete: string;
    price: number;
    lat: number;
    lng: number;
}

const getOrders = async () => {
    const response = await host.get("/api/Order");

    return response;
};

const getUserOrders = async () => {
    const response = await host.get("/api/Order/my-orders");

    return response;
};

const getOrder = async (orderId: string) => {
    const response = await host.get(`/api/Order/${orderId}`);

    return response;
};

const createOrder = async (orderData: OrderData) => {
    const response = await host.post("/api/Order", orderData);

    return response;
};

const completeUserOrder = async (orderId: string, userId: string) => {
    const response = await host.post(`/api/Order/${orderId}/complete`, null, { params: { userId } });

    return response;
};

const finishOrder = async (orderId: string) => {
    const response = await host.post(`/api/Order/${orderId}/finish`);

    return response;
};

export { getOrders, getUserOrders, getOrder, createOrder, completeUserOrder, finishOrder };
