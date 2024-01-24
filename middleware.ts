// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
 
// export default NextAuth(authConfig).auth;
 
import { auth } from '@/auth'

export default auth((req) => {
  // req.auth
  const isLoggedIn = !!req.auth
  console.log("ROUTE: ", req.nextUrl.pathname)
  console.log("IS LOGGEDIN: ", isLoggedIn )
})


// path that match will call the middleware function "auth" above
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'], // here not call on this path  warning the bang !
  // better to define which route we want to better secure 
  // matcher:(["/auth/login","auth/register"])
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
