import { ApiError, host } from ".";
import { Genders, Roles } from "./enums";

interface LoginData {
    email: string;
    password: string;
}

interface UserRegistrationData {
    name: string;
    surname: string;
    birthDate: Date;
    gender: Genders;
    workingExperience: string;
    city: string;
    phone: string;
    description: string;
    email: string;
    password: string;
}

interface ContactPersonData {
    name: string;
    surname: string;
    patronymic: string;
    email: string;
    phone: string;
}

interface CompanyRegistrationData {
    name: string;
    email: string;
    password: string;
    companyContactPerson: ContactPersonData;
}

export interface AuthCredentials {
    accessToken: string;
    refreshToken: string;
    role: Roles;
}

const login = async (loginData: LoginData): Promise<AuthCredentials | ApiError> => {
    const response = await host.post("/auth/login", loginData);

    console.log(response);
    return response.data;
};

const checkEmail = async (email: string) => {
    const response = await host.post("/auth/register", JSON.stringify(email), {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response;
};

const registerUser = async (userData: UserRegistrationData) => {
    const response = await host.post("/auth/register/user", userData);

    return response;
};

const registerCompany = async (companyData: CompanyRegistrationData) => {
    const response = await host.post("/auth/register/company", companyData);

    return response.data;
};

export { login, checkEmail, registerUser, registerCompany };
