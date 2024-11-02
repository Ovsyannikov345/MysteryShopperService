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
            console.log(error.response);

            const errorResponse: ApiError = {
                status: error.response.data.statusCode,
                message: error.response.data.message || "An error occurred",
            };

            return Promise.resolve(errorResponse);
        }

        const errorResponse: ApiError = {
            status: 500,
            message: error.response.data.message || "Network error occured",
        };

        return Promise.resolve(errorResponse);
    }
);

const nearestAddress: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: false,
});

const routeCalcutator: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: false,
});

const aiServer: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_AI_API_URL,
    withCredentials: false,
});

export { host, nearestAddress, routeCalcutator, aiServer };
