import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";

const useRequestApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Request";

    const acceptRequest = useCallback(
        async (requestId: string): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                await client.post(`/${requestId}/accept`);

                return null;
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

    const rejectRequest = useCallback(
        async (requestId: string): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                await client.post(`/${requestId}/reject`);

                return null;
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

    return { acceptRequest, rejectRequest };
};

export default useRequestApi;
