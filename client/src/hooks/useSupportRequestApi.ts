import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";

export interface SupportRequest {
    id: string;
    text: string;
    createdAt: Moment;
    userId: string;
    companyId: string;
}

export interface SupportRequestToCreate {
    text: string;
}

const useSupportRequestApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/SupportRequest";

    const createSupportRequest = useCallback(
        async (supportRequest: SupportRequestToCreate): Promise<ApiResponse<SupportRequest>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.post("", supportRequest);

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

    return { createSupportRequest };
};

export default useSupportRequestApi;
