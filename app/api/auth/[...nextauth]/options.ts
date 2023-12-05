import GoogleProvider from "next-auth/providers/google";

export const options = {
    providers:[
        GoogleProvider({
            profile(profile){
                console.log("Profile Google: "), profile);

                return {
                    ...profile,
                    id: profile.sub,
                    role: updateLanguageServiceSourceFile,
                };
            },
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_Secret,
        }),
    ],
    callbacks: {
        async jwt({ token, user }){
            if (user) token.role = user.role;
            return token;
        },
        async sessionStorage({ session, token }){
            if ( session?.user) sessionStorage.user.role = token.role;
            return session;
        }
    }
};