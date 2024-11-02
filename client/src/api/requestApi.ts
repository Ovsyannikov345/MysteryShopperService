import { host } from ".";

const createRequest = async (orderId: string) => {
    const response = await host.post(`/api/Order/${orderId}/request`);

    return response;
};

const acceptRequest = async (id: string) => {
    const response = await host.post(`/api/Request/${id}/accept`);

    return response;
};

const rejectRequest = async (id: string) => {
    const response = await host.post(`/api/Request/${id}/reject`);

    return response;
};

export { createRequest, acceptRequest, rejectRequest };
