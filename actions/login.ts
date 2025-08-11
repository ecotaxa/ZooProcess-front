import * as z from 'zod';

import { LoginSchema } from '@/schemas/index.ts';
import { login as API_login } from '@/app/api/network/zooprocess-api.ts';

export const login = async (values: z.infer<typeof LoginSchema>) => {

  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  
  const { email, password } = validatedFields.data;

  try {
    await API_login({
      email,
      password,
    });
  } catch (error) {
    console.error('Login Error', 'Something went wrong!', error);
    throw error;
  }
};
