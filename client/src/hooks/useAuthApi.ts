import { Roles } from "../utils/enums/roles";
import { Genders } from "../utils/enums/genders";
import { ApiResponse } from "./responses";
import AxiosFactory from "./axiosFactory";

export interface EmailAvailability {
    available: Boolean;
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
    patronymic: string | null;
    email: string;
    phone: string;
}

export interface CompanyRegistrationData {
    name: string;
    email: string;
    password: string;
    companyContactPerson: ContactPersonData;
}

interface AuthData {
    accessToken: string;
    refreshToken: string;
    role: Roles;
}

const useAuthApi = () => {
    const baseURL = process.env.REACT_APP_AUTH_API_URL!;

    const saveAuthData = (data: AuthData) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("role", data.role.toString());
        window.dispatchEvent(new Event("auth"));
    };

    const clearAuthData = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("auth"));
    };

    const login = async (email: string, password: string): Promise<ApiResponse<null>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL, false);

        try {
            const response = await client.post("login", { email, password });

            saveAuthData(response.data);

            return null;
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    };

    const logout = async (): Promise<ApiResponse<null>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL, false);

        try {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                await client.post("logout", null, { params: { refreshToken: refreshToken } });
            }
        } catch (error: any) {
        } finally {
            clearAuthData();
            return null;
        }
    };

    const checkEmailAvailability = async (email: string): Promise<ApiResponse<EmailAvailability>> => {
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
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    };

    const registerUser = async (userData: UserRegistrationData): Promise<ApiResponse<null>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL, false);

        try {
            const response = await client.post("register/user", userData);

            saveAuthData(response.data);

            return null;
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    };

    const registerCompany = async (companyData: CompanyRegistrationData): Promise<ApiResponse<null>> => {
        const client = await AxiosFactory.createAxiosInstance(baseURL, false);

        try {
            const response = await client.post("register/company", companyData);

            saveAuthData(response.data);

            return null;
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    };

    return { login, logout, checkEmailAvailability, registerUser, registerCompany };
};

export default useAuthApi;
