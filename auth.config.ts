import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';



import { LoginSchema } from '@/schemas';
// import { getUserByEmail } from '@/data/user';
import { login } from '@/data/user';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

export const authConfig = {
  // pages: {
  //   signIn: '/login',
  // },
  // callbacks: {
  //   authorized({ auth, request: { nextUrl } }) {
  //     const isLoggedIn = !!auth?.user;
  //     const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  //     if (isOnDashboard) {
  //       if (isLoggedIn) return true;
  //       return false; // Redirect unauthenticated users to login page
  //     } else if (isLoggedIn) {
  //       return Response.redirect(new URL('/dashboard', nextUrl));
  //     }
  //     return true;
  //   },
  // },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          // const user = await getUserByEmail(email);
          // if (!user || !user.password) return null;

          // const passwordsMatch = await bcrypt.compare(
          //   password,
          //   user.password,
          // );
          // if (passwordsMatch) return user;

          const user = await login(email, password)

          console.log("user: ", user)
  
          return user;          
        }

        return null;
      }    
    })
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;