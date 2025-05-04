import { ApiResponse, PagedResult } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";
import { OrderSortOptions } from "../utils/enums/orderSortOptions";
import QueryParamNames from "./utils/queryParamNames";
import { UserOrderStatus } from "../utils/enums/userOrderStatus";

export interface Order {
    id: string;
    title: string;
    description?: string;
    place: string;
    timeToComplete?: string;
    price?: number;
    createdAt: Moment;
    updatedAt: Moment;
    lat?: number;
    lng?: number;
    isClosed: boolean;
    company: {
        id: string;
        name: string;
        email: string;
        createdAt: Moment;
        companyReviews: {
            id: string;
            grade: number;
        }[];
    };
    reports: {
        id: string;
        title: string;
        description: string;
        grade: number;
        createdAt: Moment;
        reportCorrection?: {
            id: string;
            description: string;
        };
    }[];
    disputes: {
        id: string;
        userText?: string;
        companyText?: string;
        createdAt: Moment;
        resolvedAt?: Moment;
    }[];
    userReviews: {
        id: string;
        userText: string;
        createdAt: Moment;
    }[];
}

export interface UserOrder {
    id: string;
    status: UserOrderStatus;
    createdAt: Moment;
    updatedAt: Moment;
    requestedAt: Moment;
    acceptedAt?: Moment;
    order: Order;
}

export interface CompanyOrder {
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
    users: {
        id: string;
        status: UserOrderStatus;
    }[];
    reports: {
        id: string;
        userId: string;
        reportCorrection?: {
            id: string;
        };
    }[];
    disputes: {
        id: string;
        userText?: string;
        companyText?: string;
        createdAt: Moment;
        resolvedAt?: Moment;
    }[];
}

export interface OrderQueryFilter {
    text?: string;
    maxTimeToComplete?: string;
    minTimeToComplete?: string;
    maxPrice?: string;
    minPrice?: string;
}

export interface OrderToCreate {
    title: string;
    description?: string;
    place: string;
    timeToComplete?: string;
    price?: number;
    lat?: number;
    lng?: number;
}

const useOrderApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Order";

    const ordersPerPage = 10;

    const getAvailableOrders = useCallback(
        async (
            pageNumber: number,
            sortOption: OrderSortOptions,
            filter: OrderQueryFilter
        ): Promise<ApiResponse<PagedResult<Order>>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const filterQuery = Object.entries(filter)
                    .filter(([, value]) => value)
                    .map(([key, value]) => `${key}=${value}`)
                    .join("&");

                const response = await client.get(
                    `?${QueryParamNames.PAGE_NUMBER}=${pageNumber}&${QueryParamNames.PAGE_SIZE}=${ordersPerPage}&${QueryParamNames.SORT_OPTION}=${sortOption}&${filterQuery}`
                );

                return response.data;
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
                } else {
                    return { error: true, message: "An unexpected error occurred." };
                }
            }
        },
        [baseURL]
    );

    const getUserOrders = useCallback(async (): Promise<ApiResponse<UserOrder[]>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL);

        try {
            const response = await client.get("in-progress");

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

    const getCompanyOrders = useCallback(async (): Promise<ApiResponse<CompanyOrder[]>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL);

        try {
            const response = await client.get("my");

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

    const getOrderDetails = useCallback(
        async (orderId: string): Promise<ApiResponse<UserOrder>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.get(`${orderId}`);

                return response.data;
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
                } else {
                    return { error: true, message: "An unexpected error occurred." };
                }
            }
        },
        [baseURL]
    );

    const createOrder = useCallback(
        async (orderData: OrderToCreate): Promise<ApiResponse<CompanyOrder>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.post("", orderData);

                return response.data;
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
                } else {
                    return { error: true, message: "An unexpected error occurred." };
                }
            }
        },
        [baseURL]
    );

    const requestOrder = useCallback(
        async (orderId: string): Promise<ApiResponse<any>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.post(`${orderId}/request`);

                return response.data;
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
                } else {
                    return { error: true, message: "An unexpected error occurred." };
                }
            }
        },
        [baseURL]
    );

    return { getAvailableOrders, getUserOrders, getCompanyOrders, getOrderDetails, createOrder, requestOrder };
};

export default useOrderApi;
