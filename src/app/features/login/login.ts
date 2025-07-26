import * as z from 'zod';

import { LoginSchema } from './schema.ts';
import { login as API_login } from 'api/zooprocess-api.ts';
import type { output } from 'zod';

export const login: (values: output<typeof LoginSchema>) => Promise<string> = async (
  values: z.infer<typeof LoginSchema>
) => {
  const validatedFields = LoginSchema.safeParse(values);

  // Return a rejected promise for validation errors
  if (!validatedFields.success) {
    return Promise.reject(new Error(validatedFields.error.message));
  }

  const { email, password } = validatedFields.data;

  // Call the API login function
  return await API_login({
    email,
    password,
  })
    .then(token => {
      return Promise.resolve('Login successful');
    })
    .catch(function (error: Error) {
      return Promise.reject(error);
    });
};
