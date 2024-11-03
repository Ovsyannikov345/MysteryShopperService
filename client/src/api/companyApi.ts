import { ApiError, host } from ".";
import { Genders } from "./genders";

interface ContactPerson {
    id: string;
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    phone: string;
}

export interface CompanyToUpdate {
    id: string;
    name: string;
    email: string;
    companyContactPerson: ContactPerson;
}

interface Order {
    id: string;
    title: string;
    description: string;
    place: string;
    timeToComplete: string;
    price: number;
    createdAt: Date;
    lat: number;
    lng: number;
    isClosed: boolean;
    companyId: string;
}

interface CompanyReview {
    id: string;
    text: string;
    grade: number;
    createdAt: Date;
    userId: string;
    orderId: string;
    companyId: string;
    user: User;
}

interface User {
    id: string;
    name: string;
    surname: string;
    birthDate: Date;
    gender: Genders;
    workingExperience: string;
    city: string;
    phone: string;
    email: string;
    description: string;
    createdAt: Date;
}

export interface Company {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    contactPerson: ContactPerson;
    orders: Order[];
    companyReviews: CompanyReview[];
}

export interface UpdatedCompanyData {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    contactPerson: ContactPerson;
}

const getProfile = async (): Promise<Company | ApiError> => {
    const response = await host.get("/api/Company/my");

    return response.data;
};

const getCompany = async (id: string): Promise<Company | ApiError> => {
    const response = await host.get(`/api/Company/${id}`);

    return response.data;
};

const updateCompany = async (id: string, companyData: CompanyToUpdate): Promise<UpdatedCompanyData | ApiError> => {
    console.log(companyData)

    const response = await host.put(`/api/Company/${id}`, companyData);

    return response.data;
};

const updateAvatar = async (id: string, image: Blob): Promise<boolean | ApiError> => {
    let formData = new FormData();
    formData.append("image", image);

    const response = await host.post(`/api/Company/${id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export { getProfile, getCompany, updateCompany, updateAvatar };
