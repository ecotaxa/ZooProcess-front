// import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// import { cookies } from 'next/headers'

import { LoginSchema } from '@/schemas';
// import { getUserByEmail } from '@/data/user';
import { login } from '@/data/user';
// import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';



// declare 
declare global {
  var token: string|undefined
}



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

          // const user = await login(email, password)
          const token = await login(email, password)
          // token = user.token
          // console.log("-------------- user: ", user)
          // console.log("-------------- token: ", user.token)
  
          // { 
          //   "user server";
          //   console.log("user: ", user)
          // }

          // if ( token.token){
          //   cookies().set("currentUser", token.token)
          // }

          return token
          // return user;          
        }

        return null;
      }    
    })
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;