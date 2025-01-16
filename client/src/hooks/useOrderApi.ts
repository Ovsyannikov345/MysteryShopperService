import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";

export interface Order {
    id: string;
    title: string;
    description?: string;
    place: string;
    timeToComplete?: string;
    price?: number;
    createdAt: Moment;
    lat?: number;
    lng?: number;
    isClosed: boolean;
    company: {
        id: string;
        name: string;
        email: string;
        createdAt: Moment;
        companyReviews: [
            {
                id: string;
                grade: number;
            },
        ];
    };
}

// TODO add fields
export interface OrderQueryFilter {}

const useOrderApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Order";

    const getAvailableOrders = useCallback(async (): Promise<ApiResponse<Order>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL);

        try {
            const response = await client.get("");

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    }, [baseURL]);

    return { getAvailableOrders };
};

export default useOrderApi;
