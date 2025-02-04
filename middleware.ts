// "use server";

import NextAuth from 'next-auth';
// import { authConfig } from '@/auth.config';
 
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "@/routes"
import { auth } from './auth';
import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt'

// export default NextAuth(authConfig).auth;
 
// import { auth } from '@/auth'
// const { auth } = NextAuth(authConfig)



export default auth((req) => {
  // req.auth
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  // console.log("ROUTE: ", req.nextUrl.pathname)
  // console.log("IS LOGGEDIN: ", isLoggedIn)

  // console.log("req.auth: ", req.auth)

  if ( !req.auth){
    // console.log("req.auth is NULL")
    // console.log("req: ", req)
  }

  const { auth } = req
  let token = auth?.user?.token
  // console.log("auth?.user?.token: ", auth?.user?.token)
  // console.log("token: ", token)
  // if (!token) {
  //   token = = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  // }

  if (token) {
    // Add the token to the request headers
    req.headers.set('Authorization', `Bearer ${token}`)
    
    if (! globalThis.token) {
      // console.log("globalThis.token is NULL and fix it")
      globalThis.token = token
    }

  } else {
    // console.log("token is NULL")
  }
  if (globalThis.token) {
    // console.log("token is NOT NULL")
    token = globalThis.token
  // } else {
    // console.log("globalThis.token is NULL")
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    // return null;

    // console.log("isApiAuthRoute: ", isApiAuthRoute)

    const requestHeaders = new Headers(req.headers)
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`)
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  if (isAuthRoute) {

    // console.log("isAuthRoute: ", isAuthRoute)

    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {

    // console.log("NO LOGIN THEN GO TO LOGIN PAGE")
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
