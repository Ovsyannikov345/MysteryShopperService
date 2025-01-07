import { ApiResponse, ProfileImage } from "./responses";
import AxiosFactory from "./axiosFactory";
import { Genders } from "../utils/enums/genders";

export interface User {
    id: string;
    email: string;
    name: string;
    surname: string;
    birthDate?: Date;
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
    }[];
}

const useUserApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/User";

    const baseImageURL = process.env.REACT_APP_API_URL + "/UserImage";

    const getMyUserData = async (): Promise<ApiResponse<User>> => {
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
    };

    const getUserData = async (id: string): Promise<ApiResponse<User>> => {
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
    };

    // const updateCompanyData = async (updatedCompany: CompanyToUpdate): Promise<ApiResponse<Company>> => {
    //     const client = await AxiosFactory.createAxiosInstance(baseURL);

    //     try {
    //         const response = await client.put(updatedCompany.id, updatedCompany);

    //         return response.data;
    //     } catch (error: any) {
    //         if (error.response) {
    //             const { status, data } = error.response;
    //             return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
    //         } else {
    //             return { error: true, message: "An unexpected error occurred." };
    //         }
    //     }
    // };

    const getProfileImage = async (id: string): Promise<ApiResponse<ProfileImage>> => {
        const client = await AxiosFactory.createAxiosInstance(baseImageURL);

        try {
            const response = await client.get(id, {
                responseType: "blob",
            });

            return { blob: response.data };
        } catch (error: any) {
            if (error.response) {
                const { status, data } = error.response;
                return { error: true, statusCode: status, message: data.message ?? "Unknown error" };
            } else {
                return { error: true, message: "An unexpected error occurred." };
            }
        }
    };

    const updateProfileImage = async (file: File): Promise<ApiResponse<null>> => {
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
    };

    return { getMyUserData, getUserData, getProfileImage, updateProfileImage };
};

export default useUserApi;
