import { host } from ".";

const createRequest = async (requestText: string) => {
    const response = await host.post("/api/SupportRequest", requestText);

    return response;
};

export { createRequest };
