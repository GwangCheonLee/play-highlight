import axios, {AxiosError} from "axios";

interface ServerErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}

interface ErrorDetails {
    code: string | number;
    statusCode: number | null;
    errorMessage: string;
}

export const extractAxiosErrorDetails = (error: unknown): ErrorDetails => {
    if (!axios.isAxiosError(error)) {
        return {
            code: 'UNKNOWN_ERROR',
            statusCode: null,
            errorMessage: "An unknown error has occurred. Please contact the administrator."
        };
    }
    
    const axiosError = error as AxiosError<ServerErrorResponse>;
    
    if (axiosError.response) {
        return {
            code: axiosError.response.statusText,
            statusCode: axiosError.response.data.statusCode || axiosError.response.status,
            errorMessage: axiosError.response.data.message || "Error occurred in the server response.",
        };
    } else if (axiosError.request) {
        return {
            code: axiosError.code ?? 'NO_RESPONSE',
            statusCode: null,
            errorMessage: "Failed to receive a response from the server.",
        };
    } else {
        return {
            code: axiosError.code ?? 'UNKNOWN_ERROR',
            statusCode: null,
            errorMessage: "An unexpected error occurred.",
        };
    }
}
