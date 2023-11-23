import { createResponseInterceptor } from '@/utils/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

// export const errorByRequest = createRequestInterceptor({
//   reject: (error) => {
//     const { config, message } = error;

//     console.groupCollapsed(
//       `%c${config.method?.toUpperCase()} %c${config.url} -->`,
//       'color: #ff0000',
//       'color: inherit',
//     );

//     console.log('%cmessage', 'color: #ff0000', message);

//     console.groupEnd();

//     return Promise.reject(error);
//   },
// });

export const errorByResponse = createResponseInterceptor({
  reject: (error: AxiosError<ErrorResponse>) => {
    const { data, statusText } = error.response || {};
    const message = data?.message || statusText || 'Erro desconhecido';

    toast.error(message);
  },
});
