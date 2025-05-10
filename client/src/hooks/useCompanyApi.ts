import { ApiResponse, FileResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { useCallback } from "react";
import { Moment } from "moment";

export interface Company {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    contactPerson: {
        id: string;
        name: string;
        surname: string;
        email: string;
        phone: string;
    };
    orders: { id: string }[];
    companyReviews: {
        id: string;
        text: string;
        grade: number;
        user: {
            id: string;
            name: string;
            surname: string;
        };
        createdAt: Moment;
    }[];
}

export interface CompanyToUpdate {
    id: string;
    name: string;
    contactPerson: {
        id: string;
        name: string;
        surname: string;
        phone: string;
        email: string;
    };
}

const useCompanyApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Company";

    const baseImageURL = process.env.REACT_APP_API_URL + "/CompanyImage";

    const getMyCompanyData = useCallback(async (): Promise<ApiResponse<Company>> => {
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

    const getCompanyData = useCallback(
        async (id: string): Promise<ApiResponse<Company>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.get(id);

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

    const updateCompanyData = useCallback(
        async (updatedCompany: CompanyToUpdate): Promise<ApiResponse<Company>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.put(updatedCompany.id, updatedCompany);

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

    const getProfileImage = useCallback(
        async (id: string): Promise<ApiResponse<FileResponse>> => {
            const client = await AxiosFactory.createAxiosInstance(baseImageURL);

            try {
                let response = await client.get(`${id}/exists`);

                if (response.data === false) {
                    return { error: true, statusCode: 404, message: "Image not found" };
                }

                response = await client.get(id, {
                    responseType: "blob",
                });

                return { contentType: response.headers["content-type"] as string, blob: response.data };
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;
                    return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
                } else {
                    return { error: true, message: "An unexpected error occurred." };
                }
            }
        },
        [baseImageURL]
    );

    const updateProfileImage = useCallback(
        async (file: File): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseImageURL);

            const formData = new FormData();

            formData.append("file", file);

            try {
                await client.post("", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

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
        [baseImageURL]
    );

    return { getMyCompanyData, getCompanyData, getProfileImage, updateCompanyData, updateProfileImage };
};

export default useCompanyApi;
