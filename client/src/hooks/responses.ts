interface ApiError {
    error: boolean;
    statusCode?: number;
    message: string;
}

export type ApiResponse<T> = T | ApiError;
