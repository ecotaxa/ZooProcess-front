// "use server";

// import { authConfig } from '@/auth.config';

import { locales } from './i18n';

import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';
import { auth } from './auth';

// Create the intl middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that you want to support.
  locales: locales,
  // Used when no locale matches
  defaultLocale: locales[0],
  localePrefix: 'always', // This ensures locale is always in the URL
});

// export default NextAuth(authConfig).auth;

// import { auth } from '@/auth'
// const { auth } = NextAuth(authConfig)

// export default auth((req) => {
//   // req.auth
//   const { nextUrl } = req
//   const isLoggedIn = !!req.auth
//   // console.log("ROUTE: ", req.nextUrl.pathname)
//   // console.log("IS LOGGEDIN: ", isLoggedIn)

//  // Extract locale from pathname
//   const pathname = req.nextUrl.pathname;
//   const pathnameIsMissingLocale = ['en', 'fr'].every(
//     (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
//   );

//   // Skip middleware for API routes, static files, etc.
//   if (
//     pathname.startsWith('/api') ||
//     pathname.startsWith('/_next') ||
//     pathname.includes('.')
//   ) {
//     return NextResponse.next();
//   }

//   // Handle internationalization first
//   if (pathnameIsMissingLocale) {
//     const locale = 'en'; // or detect from headers/cookies
//     return NextResponse.redirect(
//       new URL(`/${locale}${pathname}`, req.url)
//     );
//   }

//   // Get the pathname without locale for route checking
//   const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

//   // console.log("req.auth: ", req.auth)

//   if ( !req.auth){
//     // console.log("req.auth is NULL")
//     // console.log("req: ", req)
//   }

//   const { auth } = req
//   let token = auth?.user?.token
//   // console.log("auth?.user?.token: ", auth?.user?.token)
//   // console.log("token: ", token)
//   // if (!token) {
//   //   token = = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
//   // }

//   if (token) {
//     // Add the token to the request headers
//     req.headers.set('Authorization', `Bearer ${token}`)

//     if (! globalThis.token) {
//       // console.log("globalThis.token is NULL and fix it")
//       globalThis.token = token
//     }

//   } else {
//     // console.log("token is NULL")
//   // } BUG ? moved after token globalThis.check
//   if (globalThis.token) {
//     // console.log("token is NOT NULL")
//     token = globalThis.token
//   // } else {
//     // console.log("globalThis.token is NULL")
//   }
//   }

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//   if (isApiAuthRoute) {
//     // return null;

//     // console.log("isApiAuthRoute: ", isApiAuthRoute)

//     const requestHeaders = new Headers(req.headers)
//     if (token) {
//       requestHeaders.set('Authorization', `Bearer ${token}`)
//     }
//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     })
//   }

//   if (isAuthRoute) {

//     // console.log("isAuthRoute: ", isAuthRoute)

//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
//     }
//     return null;
//   }

//   if (!isLoggedIn && !isPublicRoute) {

//     // console.log("NO LOGIN THEN GO TO LOGIN PAGE")
//     return Response.redirect(new URL('/auth/login' , nextUrl))

//     // let callbackUrl = nextUrl.pathname;
//     // if (nextUrl.search) {
//     //   callbackUrl += nextUrl.search;
//     // }

//     // const encodedCallbackUrl = encodeURIComponent(callbackUrl);

//     // return Response.redirect(new URL(
//     //   `/auth/login?callbackUrl=${encodedCallbackUrl}`,
//     //   nextUrl
//     // ));
//   }

//   // return null;
//   return intlMiddleware(req);
// })

// // path that match will call the middleware function "auth" above
// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'], // here not call on this path  warning the bang !
//   // better to define which route we want to better secure
//   // matcher:(["/auth/login","auth/register"])
//   // matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
//     matcher: [
//     // Skip all internal paths (_next)
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//     // Always run for root
//     '/'
//   ],
// };

export default auth(req => {
  const { nextUrl } = req;
  const pathname = req.nextUrl.pathname;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    console.log('Middleware - Skipping for:', pathname);
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;

  // Handle auth token
  const { auth } = req;
  let token = auth?.user?.token;

  if (token) {
    req.headers.set('Authorization', `Bearer ${token}`);
    if (!globalThis.token) {
      globalThis.token = token;
    }
  } else if (globalThis.token) {
    token = globalThis.token;
  }

  // Extract locale and path
  const segments = pathname.split('/');
  const locale = segments[1];
  const isValidLocale = ['en', 'fr'].includes(locale);

  // Get path without locale for route checking
  const pathWithoutLocale = isValidLocale ? '/' + segments.slice(2).join('/') : pathname;

  const isApiAuthRoute = pathWithoutLocale.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathWithoutLocale) || pathWithoutLocale === '/';
  const isAuthRoute = authRoutes.includes(pathWithoutLocale);

  if (isAuthRoute) {
    if (isLoggedIn) {
      const redirectLocale = isValidLocale ? locale : 'en';
      return Response.redirect(new URL(`/${redirectLocale}${DEFAULT_LOGIN_REDIRECT}`, nextUrl));
    }
    return intlMiddleware(req);
  }

  if (!isLoggedIn && !isPublicRoute) {
    const redirectLocale = isValidLocale ? locale : 'en';
    return Response.redirect(new URL(`/${redirectLocale}/auth/login`, nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // '/((?!api|_next|_vercel|.*\\..*).*)'
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    // '/((?!api|_next|.*\\..*).*)', // Exclut les routes API, les fichiers statiques, etc.
    // '/', '/(en|fr)/:path*'
  ],
};
