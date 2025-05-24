import { Genders } from "../utils/enums/genders";
import { ApiResponse } from "./utils/responses";
import AxiosFactory from "./utils/axiosFactory";
import AuthDataManager from "./utils/authDataManager";
import { useCallback } from "react";

export interface EmailAvailability {
    available: boolean;
}

export interface UserRegistrationData {
    name: string;
    surname: string;
    birthDate: Date | null;
    gender: Genders;
    workingExperience?: string | null;
    city: string | null;
    phone: string;
    description: string | null;
    email: string;
    password: string;
}

export interface ContactPersonData {
    name: string;
    surname: string;
    email: string;
    phone: string;
}

export interface CompanyRegistrationData {
    name: string;
    email: string;
    password: string;
    companyContactPerson: ContactPersonData;
}

const useAuthApi = () => {
    const baseURL = process.env.REACT_APP_AUTH_API_URL!;

    const login = useCallback(
        async (email: string, password: string): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL, false);

            try {
                const response = await client.post("login", { email, password });

                AuthDataManager.saveAuthData(response.data);

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
        [baseURL]
    );

    const logout = useCallback(async (): Promise<ApiResponse<null>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL, false);

        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                await client.post("logout", null, { params: { refreshToken: refreshToken } });
            }
        } catch {
        } finally {
            AuthDataManager.clearAuthData();
            return null;
        }
    }, [baseURL]);

    const checkEmailAvailability = useCallback(
        async (email: string): Promise<ApiResponse<EmailAvailability>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL, false);

            try {
                const response = await client.post("check-email", JSON.stringify(email), {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

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

    const registerUser = useCallback(
        async (userData: UserRegistrationData): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL, false);

            try {
                const response = await client.post("register/user", userData);

                AuthDataManager.saveAuthData(response.data);

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
        [baseURL]
    );

    const registerCompany = useCallback(
        async (companyData: CompanyRegistrationData): Promise<ApiResponse<null>> => {
            const client = await AxiosFactory.createAxiosInstance(baseURL, false);

            try {
                const response = await client.post("register/company", companyData);

                AuthDataManager.saveAuthData(response.data);

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
        [baseURL]
    );

    return { login, logout, checkEmailAvailability, registerUser, registerCompany };
};

export default useAuthApi;
