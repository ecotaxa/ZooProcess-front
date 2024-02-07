import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
// import { getUserByiD } from '@/data/user';


// import Credentials from 'next-auth/providers/credentials';
// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import type { User } from '@/app/lib/definitions';
// import bcrypt from 'bcrypt';
 
// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0];
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }
 

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(credentials);
 
//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;
//         //   const user = await getUser(email);
//         //   if (!user) return null;
//         // const passwordsMatch = await bcrypt.compare(password, user.password);
//         // if (passwordsMatch) return user;
//             return new Promise((resolve)=>{ name:"test" });
//         }
 
//         return null;
//       },
//     }),
//   ],
// });

import * as api from '@/app/api/network/zooprocess-api' 
import { UserRole } from '@/next-auth';
// import { string } from 'zod';



export const {
  handlers: { GET, POST },
  auth,
  signIn, 
  signOut
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      console.log({
        token,
        session
      })
      // const t : Session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if ( token.role && session.user ) {
        session.user.role = token.role as UserRole
      }

      if ( token.token && session.user ) {
        session.user.token = token.token as string
      }

      return session
    },
    async jwt({ token , user }) {
      console.log({
        token,
        user
      })
      if (!token.sub) return token;

      // console.log(" ++++++++++++++++ : ", user)

      // token.token = user.token

      if ( globalThis.token ) {
        console.log("globalThis.token: ", globalThis.token)
        token.token = globalThis.token
  
        // const existingUser = await getUserByiD(token.sub, globalThis.token);
        const existingUser = await api.getUserById(`/users/${token.sub}`, globalThis.token )
        // const existingUser = await api.getUserById(`/users/me`, globalThis.token )
        if (!existingUser) return token;
        token.role = existingUser.role
      }

      // console.log("existingUser: ", existingUser)

      // token.existingUser = existingUser

      // if (!existingUser) return token;

      // token.role = existingUser.user. .role;

      return token
    }
  },
  session: { strategy: "jwt" },
  ...authConfig,
});