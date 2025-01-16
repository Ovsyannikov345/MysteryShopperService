import { ApiResponse, PagedResult } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";
import { OrderSortOptions } from "../utils/enums/orderSortOptions";
import QueryParamNames from "./utils/queryParamNames";

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

export interface OrderQueryFilter {
    text?: string;
    maxTimeToComplete?: string;
    minTimeToComplete?: string;
    maxPrice?: string;
    minPrice?: string;
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

    return { getAvailableOrders };
};

export default useOrderApi;
