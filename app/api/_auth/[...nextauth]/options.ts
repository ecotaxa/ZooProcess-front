import GoogleProvider from "next-auth/providers/google";
import { GOOGLE_ID, GOOGLE_SECRET } from '@/constants';

export const options = {
    providers:[
        GoogleProvider({
            profile(profile){
                console.log("Profile Google: ", profile);

                return {
                    ...profile,
                    id: profile.sub,
                    role: updateLanguageServiceSourceFile,
                };
            },
            clientID: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET,
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
