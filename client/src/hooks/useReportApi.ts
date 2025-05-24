import { ApiResponse, FileResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";

export interface Report {
    id: string;
    title: string;
    description: string;
    grade: number;
    createdAt: Moment;
    userId: string;
    orderId: string;
    reportCorrection?: {
        id: string;
        reportId: string;
        description: string;
        createdAt: Moment;
        updatedAt: Moment;
    };
}

export interface ReportToCreate {
    title: string;
    description: string;
    grade: number;
    orderId: string;
}

const useReportApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Report";

    const baseAttachmentURL = process.env.REACT_APP_API_URL + "/ReportAttachment";

    const createReport = useCallback(
        async (report: ReportToCreate): Promise<ApiResponse<Report>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.post("", report);

                return response.data;
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Произошла ошибка. Попробуйте позже" };
                } else {
                    return { error: true, message: "Произошла ошибка. Попробуйте позже" };
                }
            }
        },
        [baseURL]
    );

    const getAttachmentNames = useCallback(
        async (reportId: string): Promise<ApiResponse<string[]>> => {
            const client = await AxiosFactory.createAxiosInstance(baseAttachmentURL);

            try {
                const response = await client.get(`report/${reportId}`);

                return response.data;
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Произошла ошибка. Попробуйте позже" };
                } else {
                    return { error: true, message: "Произошла ошибка. Попробуйте позже" };
                }
            }
        },
        [baseAttachmentURL]
    );

    const getAttachment = useCallback(
        async (attachmentName: string): Promise<ApiResponse<FileResponse>> => {
            const client = await AxiosFactory.createAxiosInstance(baseAttachmentURL);

            try {
                const response = await client.get("", {
                    responseType: "blob",
                    params: { fileName: attachmentName },
                });
                
                return { contentType: response.headers["content-type"] as string, blob: response.data };
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Произошла ошибка. Попробуйте позже" };
                } else {
                    return { error: true, message: "Произошла ошибка. Попробуйте позже" };
                }
            }
        },
        [baseAttachmentURL]
    );

    const uploadAttachment = useCallback(
        async (reportId: string, file: File): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseAttachmentURL);

            const formData = new FormData();

            formData.append("file", file);

            try {
                await client.post(`report/${reportId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                return null;
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Произошла ошибка. Попробуйте позже" };
                } else {
                    return { error: true, message: "Произошла ошибка. Попробуйте позже" };
                }
            }
        },
        [baseAttachmentURL]
    );

    return { createReport, getAttachmentNames, getAttachment, uploadAttachment };
};

export default useReportApi;
