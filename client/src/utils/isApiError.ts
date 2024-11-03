import { ApiError } from "../api";

export default function isApiError<T>(response: T | ApiError): response is ApiError {
    return (response as ApiError).message !== undefined;
}
