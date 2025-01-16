interface ApiError {
    error: boolean;
    statusCode?: number;
    message: string;
}

export interface ProfileImage {
    blob: Blob;
}

export type ApiResponse<T> = T | ApiError;
