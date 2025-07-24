import axios, { AxiosError } from 'axios';
import isPlainObject from 'lodash/isPlainObject';

axios.interceptors.response.use(
  r => r,
  (err: AxiosError) => {
    // Normalise toujours la charge utile (elle peut déjà être un objet)
    const payload = isPlainObject(err.response?.data)
      ? err.response!.data
      : safeParse(err.response?.data);

    // On range tout dans une sous-classe pour la reconnaître partout
    return Promise.reject(new ApiValidationError(payload, err));
  }
);

class ApiValidationError extends Error {
  constructor(
    public payload: unknown,
    axiosError: AxiosError
  ) {
    super('API validation failed');
    this.name = 'ApiValidationError';
    // utile pour le logging
    this.stack = axiosError.stack;
  }
}

const safeParse = (maybeString?: unknown) => {
  if (typeof maybeString !== 'string') return maybeString;
  try {
    return JSON.parse(maybeString);
  } catch {
    return maybeString;
  }
};
