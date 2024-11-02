import { host } from ".";

interface LoginData {
    email: string;
    password: string;
}

enum Genders {
    Male = 1,
    Female = 2,
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

const login = async (loginData: LoginData) => {
    const response = await host.post("/auth/login", loginData);

    return response;
};

const checkEmail = async (email: string) => {
    const response = await host.post("/auth/register", email);

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
