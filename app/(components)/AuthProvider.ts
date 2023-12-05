"use client";

import { SessionProvider } from "next-auth/react";

// import  SessionProvider  from "next-auth/react";

const AuthProvider = ({ children : React.ReactElement }) => {
    return <SessionProvider>{children}</SessionProvider>
}
