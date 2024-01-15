import { createResponseInterceptor } from '@/utils/axios';
import { AxiosError, isCancel } from 'axios';
import { toast } from 'react-hot-toast';

interface ErrorResponse {
  msg: string;
}

// eslint-disable-next-line import/prefer-default-export
export const errorByResponse = createResponseInterceptor({
  reject: (error: AxiosError<ErrorResponse>) => {
    const { data, statusText } = error.response || {};
    const message = data?.msg || statusText || 'Erro desconhecido';

    console.debug('[Request Error]:', error, 'message:', message);

    if (isCancel(error)) {
      return Promise.reject(error);
    }

    toast.error(message);

    return Promise.reject(error);
  },
});
