import axios, { AxiosInstance } from "axios";

export interface ApiError {
    status: number;
    message: string;
}

const host: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
});

host.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const errorResponse: ApiError = {
                status: error.response.data.statusCode || 500,
                message: error.response.data.message || "An error occurred",
            };

            return Promise.resolve({ data: errorResponse });
        }

        const errorResponse: ApiError = {
            status: 500,
            message: "Network error occured",
        };

        return Promise.resolve({ data: errorResponse });
    }
);

const nearestAddress: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: false,
});

nearestAddress.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorResponse: ApiError = {
            status: error?.response?.status || 500,
            message: "Error occured while getting address",
        };

        return Promise.resolve({ data: errorResponse });
    }
);

const routeCalcutator: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: false,
});

routeCalcutator.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorResponse: ApiError = {
            status: error?.response?.status || 500,
            message: "Error occured while calculating distance",
        };

        return Promise.resolve({ data: errorResponse });
    }
);

const aiServer: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_AI_API_URL,
    withCredentials: false,
});

export { host, nearestAddress, routeCalcutator, aiServer };
