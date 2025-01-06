import axios, { AxiosInstance } from "axios";
import AuthDataManager from "./utils/authDataManager";

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}

class AxiosFactory {
    static isRefreshing = false;

    static failedRequestsQueue: FailedRequest[] = [];

    static createAxiosInstance = async (baseURL: string, addTokenAuth: boolean = true): Promise<AxiosInstance> => {
        const instance = axios.create({
            baseURL: baseURL,
        });

        if (addTokenAuth) {
            const token = localStorage.getItem("accessToken");

            instance.interceptors.request.use((config) => {
                config.headers.Authorization = `Bearer ${token}`;

                return config;
            });

            instance.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const originalRequest = error.config;

                    if (error.response?.status === 401 && !originalRequest._retry) {
                        if (AxiosFactory.isRefreshing) {
                            try {
                                const newToken = await new Promise<string>((resolve, reject) => {
                                    AxiosFactory.failedRequestsQueue.push({ resolve, reject });
                                });

                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                return axios(originalRequest);
                            } catch (err) {
                                return Promise.reject(err);
                            }
                        }

                        originalRequest._retry = true;
                        AxiosFactory.isRefreshing = true;

                        try {
                            const refreshToken = localStorage.getItem("refreshToken");

                            const response = await axios.post(`${process.env.REACT_APP_AUTH_API_URL}/refresh`, null, {
                                params: { refreshToken: refreshToken },
                            });

                            const tokenPair: TokenPair = response.data;

                            localStorage.setItem("accessToken", tokenPair.accessToken);
                            localStorage.setItem("refreshToken", tokenPair.refreshToken);

                            AxiosFactory.failedRequestsQueue.forEach((req) => req.resolve(tokenPair.accessToken));
                            AxiosFactory.failedRequestsQueue = [];

                            originalRequest.headers.Authorization = `Bearer ${tokenPair.accessToken}`;
                            return axios(originalRequest);
                        } catch (refreshError) {
                            AxiosFactory.failedRequestsQueue.forEach((req) => req.resolve);
                            AxiosFactory.failedRequestsQueue = [];

                            AuthDataManager.clearAuthData();

                            return Promise.reject(refreshError);
                        } finally {
                            AxiosFactory.isRefreshing = false;
                        }
                    }

                    return Promise.reject(error);
                }
            );
        }

        return instance;
    };
}

export default AxiosFactory;
