import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";

export interface Review {
    id: string;
    text: string;
    grade: number;
    createdAt: Moment;
    userId: string;
    orderId: string;
    companyId: string;
}

export interface ReviewToCreate {
    text: string | null;
    grade: number;
    orderId: string;
}

const useReviewApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Review";

    const createUserReview = useCallback(
        async (userId: string, review: ReviewToCreate): Promise<ApiResponse<Review>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.post(`user/${userId}`, review);

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

    const createCompanyReview = useCallback(
        async (companyId: string, review: ReviewToCreate): Promise<ApiResponse<Review>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.post(`company/${companyId}`, review);

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

    return { createUserReview, createCompanyReview };
};

export default useReviewApi;
