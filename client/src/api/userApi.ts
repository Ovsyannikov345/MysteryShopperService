import { host } from ".";

enum Genders {
    Male = 1,
    Female = 2,
}

interface UserData {
    id: string;
    name: string;
    surname: string;
    birthDate: Date;
    gender: Genders;
    workingExperience: string;
    city: string;
    phone: string;
    description: string;
}

const getProfile = async () => {
    const response = await host.get("/api/User/my");

    return response;
};

const getUser = async (id: string) => {
    const response = await host.get(`/api/User/${id}`);

    return response;
};

const updateUser = async (id: string, userData: UserData) => {
    const response = await host.put(`/api/User/${id}`, userData);

    return response;
};

const updateAvatar = async (id: string, image: Blob) => {
    let formData = new FormData();
    formData.append("image", image);

    const response = await host.post(`/api/users/${id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response;
};

export { getProfile, getUser, updateUser, updateAvatar };
