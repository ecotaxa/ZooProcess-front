import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
 
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "@/routes"

// export default NextAuth(authConfig).auth;
 
// import { auth } from '@/auth'
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  // req.auth
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  console.log("ROUTE: ", req.nextUrl.pathname)
  console.log("IS LOGGEDIN: ", isLoggedIn )

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {

    return Response.redirect(new URL('/auth/login' , nextUrl))

    // let callbackUrl = nextUrl.pathname;
    // if (nextUrl.search) {
    //   callbackUrl += nextUrl.search;
    // }

    // const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // return Response.redirect(new URL(
    //   `/auth/login?callbackUrl=${encodedCallbackUrl}`,
    //   nextUrl
    // ));
  }

  return null;
})


// path that match will call the middleware function "auth" above
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'], // here not call on this path  warning the bang !
  // better to define which route we want to better secure 
  // matcher:(["/auth/login","auth/register"])
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
