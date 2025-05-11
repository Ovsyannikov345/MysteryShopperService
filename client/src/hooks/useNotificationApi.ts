import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";

export interface Notification {
    id: string;
    text: string;
    isRead: boolean;
    createdAt: Date;
    userId: string | null;
    companyId: string | null;
}

const useNotificationApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Notification";

    const getNotifications = useCallback(async (): Promise<ApiResponse<Notification[]>> => {
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

    const readNotification = useCallback(
        async (id: string): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                await client.put(`${id}/read`);

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

    return { getNotifications, readNotification };
};

export default useNotificationApi;
