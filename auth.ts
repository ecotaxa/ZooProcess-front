// import { authConfig } from '@/auth.config.ts';
// // import { getUserByiD } from '@/data/user';
//
// // import { z } from 'zod';
// // import { sql } from '@vercel/postgres';
// // import type { User } from '@/app/lib/definitions';
// // import bcrypt from 'bcrypt';
//
// // async function getUser(email: string): Promise<User | undefined> {
// //   try {
// //     const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
// //     return user.rows[0];
// //   } catch (error) {
// //     console.error('Failed to fetch user:', error);
// //     throw new Error('Failed to fetch user.');
// //   }
// // }
//
// // export const { auth, signIn, signOut } = NextAuth({
// //   ...authConfig,
// //   providers: [
// //     Credentials({
// //       async authorize(credentials) {
// //         const parsedCredentials = z
// //           .object({ email: z.string().email(), password: z.string().min(6) })
// //           .safeParse(credentials);
//
// //         if (parsedCredentials.success) {
// //           const { email, password } = parsedCredentials.data;
// //         //   const user = await getUser(email);
// //         //   if (!user) return null;
// //         // const passwordsMatch = await bcrypt.compare(password, user.password);
// //         // if (passwordsMatch) return user;
// //             return new Promise((resolve)=>{ name:"test" });
// //         }
//
// //         return null;
// //       },
// //     }),
// //   ],
// // });
//
// import * as api from '@/app/api/network/zooprocess-api.ts';
//
// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   callbacks: {
//     async session({ token, session }) {
//       // console.log("Auth() session:",{
//       // token,
//       // session
//       // })
//       // const t : Session
//       if (token.sub && session.user) {
//         session.user.id = token.sub;
//       }
//
//       if (token.role && session.user) {
//         session.user.role = token.role as UserRole;
//       }
//
//       if (token.token && session.user) {
//         session.user.token = token.token as string;
//       }
//
//       if (!token.token && globalThis.token) {
//         session.user.token = globalThis.token as string;
//         token.token = globalThis.token as string;
//       }
//
//       // console.log("session: ", session)
//
//       return session;
//     },
//     // async jwt({ token , user }) {
//     //   // console.log("jwt: ", { token, user })
//     //   if (!token.sub) {
//     //     // console.log("token.sub is undefined")
//
//     //     const currentTimestamp = Math.floor(Date.now() / 1000);
//     //     if (token.exp && typeof token.exp === 'number' && token.exp < currentTimestamp) {
//     //       token.isExpired = true;
//     //       // console.log("Token has expired");
//     //     } else {
//     //       token.isExpired = false;
//     //       // console.log("Token is still valid");
//     //     }
//
//     //     return token;
//     //   }
//
//     //   // console.log(" ++++++++++++++++ : ", user)
//
//     //   //  token.token = user.token
//
//     //   if ( globalThis.token ) {
//     //     // console.log("globalThis.token: ", globalThis.token)
//     //     token.token = globalThis.token
//
//     //     // const existingUser = await getUserByiD(token.sub, globalThis.token);
//
//     //     // const existingUser = await api.getUserById(`/users/${token.sub}`, globalThis.token )
//     //     const existingUser = await api.getUserById(`/users/me`, globalThis.token )
//
//     //     if (!existingUser) return token;
//     //     token.role = existingUser.role
//     //   }
//
//     //   // console.log("existingUser: ", existingUser)
//
//     //   // token.existingUser = existingUser
//
//     //   // if (!existingUser) return token;
//
//     //   // token.role = existingUser.user. .role;
//
//     //   return token
//     // }
//
//     async jwt({ token, user }) {
//       // console.log("jwt: ", { token, user })
//       // if (!token.sub) {
//       //   // console.log("token.sub is undefined")
//
//       const currentTimestamp = Math.floor(Date.now() / 1000);
//       if (token.exp && typeof token.exp === 'number' && token.exp < currentTimestamp) {
//         token.isExpired = true;
//         // console.log("Token has expired");
//       } else {
//         token.isExpired = false;
//         // console.log("Token is still valid");
//         return token;
//       }
//
//       // }
//
//       // console.log(" ++++++++++++++++ : ", user)
//
//       // token.token = user.token
//
//       if (globalThis.token) {
//         // console.log("globalThis.token: ", globalThis.token)
//         token.token = globalThis.token;
//
//         // const existingUser = await getUserByiD(token.sub, globalThis.token);
//
//         // const existingUser = await api.getUserById(`/users/${token.sub}`, globalThis.token )
//         const existingUser = await api.getUserById(`/users/me`, globalThis.token);
//
//         if (!existingUser) return token;
//         token.role = existingUser.role;
//       }
//
//       // console.log("existingUser: ", existingUser)
//
//       // token.existingUser = existingUser
//
//       // if (!existingUser) return token;
//
//       // token.role = existingUser.user. .role;
//
//       return token;
//     },
//   },
//   session: { strategy: 'jwt' },
//   ...authConfig,
// });
