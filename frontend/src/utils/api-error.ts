import { isAxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
}

export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = 'Ha ocurrido un error',
): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return defaultMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};
