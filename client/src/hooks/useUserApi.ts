import { ApiResponse, FileResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import { Genders } from "../utils/enums/genders";
import { useCallback } from "react";
import { Moment } from "moment";

export interface User {
    id: string;
    email: string;
    name: string;
    surname: string;
    birthDate?: Moment;
    gender: Genders;
    workingExperience?: string;
    city?: string;
    phone: string;
    description?: string;
    createdAt: Date;
    orders: {
        id: string;
    }[];
    userReviews: {
        id: string;
        text: string;
        grade: number;
        company: {
            id: string;
            name: string;
        };
        createdAt: Moment;
    }[];
}

export interface UserToUpdate {
    id: string;
    name: string;
    surname: string;
    birthDate?: Moment;
    gender: Genders;
    workingExperience?: string;
    city?: string;
    phone: string;
    description?: string;
}

const useUserApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/User";

    const baseImageURL = process.env.REACT_APP_API_URL + "/UserImage";

    const getMyUserData = useCallback(async (): Promise<ApiResponse<User>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL);

        try {
            const response = await client.get("my");

            return response.data;
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Произошла ошибка. Попробуйте позже" };
            } else {
                return { error: true, message: "Произошла ошибка. Попробуйте позже" };
            }
        }
    }, [baseURL]);

    const getUserData = useCallback(
        async (id: string): Promise<ApiResponse<User>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.get(id);

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

    const updateUserData = useCallback(
        async (updatedUser: UserToUpdate): Promise<ApiResponse<User>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL);

            try {
                const response = await client.put(updatedUser.id, updatedUser);

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
                    return { error: true, statusCode: status, message: data.message ?? "Произошла ошибка. Попробуйте позже" };
                } else {
                    return { error: true, message: "Произошла ошибка. Попробуйте позже" };
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
                    return { error: true, statusCode: status, message: data.message ?? "Произошла ошибка. Попробуйте позже" };
                } else {
                    return { error: true, message: "Произошла ошибка. Попробуйте позже" };
                }
            }
        },
        [baseImageURL]
    );

    return { getMyUserData, getUserData, getProfileImage, updateUserData, updateProfileImage };
};

export default useUserApi;
