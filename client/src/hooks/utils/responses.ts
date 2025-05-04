interface ApiError {
    error: boolean;
    statusCode?: number;
    message: string;
}

export interface FileResponse {
    contentType: string;
    blob: Blob;
}

export interface PagedResult<T> {
    pageContent: T[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}

export type ApiResponse<T> = T | ApiError;
