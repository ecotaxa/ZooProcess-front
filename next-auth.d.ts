// import { UserRole } from "@prisma/client";

// d'apres la doc de auth.js mais ne fonctionne pas
// declare module "@auth/core" {
//     interface Session {
//       user: {
//         role: string //"USER" | "ADMIN"
//       } & DefaultSession["user"]
//     }
//   }

export type UserRole = 'USER' | 'ADMIN';

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  token: string;
  //   isTwoFactorEnabled: boolean;
  //   isOAuth: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
