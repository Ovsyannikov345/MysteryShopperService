import { ApiError, host } from ".";

export interface OrderToCreate {
    title: string;
    description: string | null;
    place: string;
    timeToComplete: string | null;
    price: number | null;
    lat: number | null;
    lng: number | null;
}

interface CompanyReview {
    id: string;
    text: string;
    grade: number;
}

interface Company {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    companyReviews: CompanyReview[];
}

export interface Order {
    id: string;
    title: string;
    description: string;
    place: string;
    timeToComplete: string;
    price: number;
    createdAt: Date;
    lat: number;
    lng: number;
    isClosed: boolean;
    company: Company;
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

const createOrder = async (orderData: OrderToCreate): Promise<Order | ApiError> => {
    const response = await host.post("/api/Order", orderData);

    return response.data;
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
