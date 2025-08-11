import { RegisterSchema } from '@/schemas';
import * as z from 'zod';
import * as bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/data/user';
import { createUser } from '@/app/api/user';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // console.log(values)

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // const existingUser = await getUserByEmail(email)

  // if ( existingUser ) {
  //     return { error: "Email already in use!"}
  // }

  try {
    await getUserByEmail(email);
    return { error: 'Email already in use!' };
  } catch (error) {
    console.log('OK no user with this email');
  }

  // Remove DevBundlerService.user.create as it's not a valid method
  // You might want to replace this with your actual user creation logic
  // For example, if you're using Prisma, it might look like:
  // await prisma.user.create({
  //     data: {
  //         name,
  //         email,
  //         password: hashedPassword
  //     }
  // })

  await createUser(name, email, password)
    .then(res => {
      //TODO: Send verification token email
      //TODO: Implement user creation logic

      return { success: 'User created!' };
    })
    .catch(error => {
      console.log('OK no user with this email');
    });
};
