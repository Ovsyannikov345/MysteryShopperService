import { host } from ".";

interface ContactPersonData {
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    phone: string;
}

interface CompanyToUpdateData {
    name: string;
    email: string;
    password: string;
    companyContactPerson: ContactPersonData;
}

const getProfile = async () => {
    const response = await host.get("/api/Company/my");

    return response;
};

const getCompany = async (id: string) => {
    const response = await host.get(`/api/Company/${id}`);

    return response;
};

const updateCompany = async (id: string, companyData: CompanyToUpdateData) => {
    const response = await host.put(`/api/Company/${id}`, companyData);

    return response;
};

const updateAvatar = async (id: string, image: Blob) => {
    let formData = new FormData();
    formData.append("image", image);

    const response = await host.post(`/api/Company/${id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response;
};

export { getProfile, getCompany, updateCompany, updateAvatar };
