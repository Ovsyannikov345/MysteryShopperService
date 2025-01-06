import { ApiResponse } from "./responses";
import AxiosFactory from "./axiosFactory";

export interface Company {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    contactPerson: {
        id: string;
        name: string;
        surname: string;
        patronymic: string;
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
            patronymic: string;
        };
    }[];
}

export interface CompanyToUpdate {
    id: string;
    name: string;
    contactPerson: {
        id: string;
        name: string;
        surname: string;
        patronymic: string | null;
        phone: string;
        email: string;
    };
}

const useCompanyApi = () => {
    const baseURL = process.env.REACT_APP_API_URL + "/Company";

    const getMyCompanyData = async (): Promise<ApiResponse<Company>> => {
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

    const getCompanyData = async (id: string): Promise<ApiResponse<Company>> => {
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

    const updateCompanyData = async (updatedCompany: CompanyToUpdate): Promise<ApiResponse<Company>> => {
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
    };

    return { getMyCompanyData, getCompanyData, updateCompanyData };
};

export default useCompanyApi;
