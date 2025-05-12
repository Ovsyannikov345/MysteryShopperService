import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";

export interface OrderAnalysisResult {
    compatibility: Compatibility | null;
    timeToComplete: number | null;
}

export interface Compatibility {
    age: number;
    gender: number;
    profession: number;
    experience: number;
}

const useAnalysisApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Analysis";

    const getOrderAnalysis = useCallback(
        async (orderId: string): Promise<ApiResponse<OrderAnalysisResult>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.get(`order/${orderId}`);

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

    return { getOrderAnalysis };
};

export default useAnalysisApi;
