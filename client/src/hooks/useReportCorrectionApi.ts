import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";

export interface Correction {
    id: string;
    description: string;
    createdAt: Moment;
    updatedAt: Moment;
    reportId: string;
}

export interface CorrectionToCreate {
    description: string;
    reportId: string;
}

const useReportCorrectionApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/ReportCorrection";

    const createCorrection = useCallback(
        async (correction: CorrectionToCreate): Promise<ApiResponse<Correction>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.post("", correction);

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

    return { createCorrection };
};

export default useReportCorrectionApi;
