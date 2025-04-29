"use server"

// import { auth } from '@/auth';
// import { auth } from '@/auth';
import { auth } from '@/auth';
import axios, { AxiosHeaderValue, AxiosInstance, CreateAxiosDefaults } from 'axios';
import { setupCache } from 'axios-cache-interceptor';
// import { getSession } from 'next-auth/react';

// import { serverHooks } from 'next/dist/server/app-render/entry-base';
// import { getToken } from './token';
// import { useSession } from 'next-auth/react';
// import { cookies } from 'next/headers';


// import {getSession} from 'next-auth/react'
import getServerSession from "next-auth";
// import { useSession } from 'next-auth/react';
// import { options } from "@/api/_auth/[...nextauth]/options";

const axiosInstancev = axios.create({
    baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
    timeout: 5000,
});

import { headers } from 'next/headers';


// arg ne fonctionne pas 
// car auth() n'est pas encore initialisé
// ça se mort la queue  avec l'initialisation de Auth.ts
// faut passer le tout dans une fonction
// axiosInstance.interceptors.request.use(
//     async config => {
//         // Do something before request is sent
  
//         console.log("Config interceptor");

//         const token = await auth()
//         if (token){
//             console.log("Added token to header, ", token);
//             config.headers["Authorization"] = "bearer " + token;
//         }

//       return config;
//     },
//     error => {
//       Promise.reject(error);
//     }
//   );




const axiosInstanceSimple = async ({useAuth = true, token = undefined, params = {}}:{useAuth?:boolean,token?:string|undefined, params?:any}): Promise<AxiosInstance> => {
    let _params : CreateAxiosDefaults<any> = {
        baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
        timeout: 5000,
    }

    return auth()
    .then((session) => {
        // console.log("axiosInstance - auth session: ", session) 
        let token = undefined   
        if (session) {
            token = session.user.token
            // console.log("axiosInstance - session.user.token: ", token)
        }

        if (token) {
            // console.log("axiosInstance - token: ", token)

            const header : AxiosHeaderValue = "bearer " + token;
            const paramsUpdated = {
                ..._params,
                headers: {
                    Authorization: header
                }
            }

            // console.log("axiosInstance - paramsUpdated: ", paramsUpdated)
            let instance = axios.create(paramsUpdated);
    
            const axiosInst = setupCache(instance)
        
            return axiosInst
        }
        else {
            // console.log("axiosInstance - No token")
            throw(new Error("No token"))
        }
    })
    .catch((error) => {
        console.error("axiosInstance - error: ", error)
        throw(error)
    })
}




const axiosInstance = async ({useAuth = true, token = undefined, params = {}}:{useAuth?:boolean,token?:string|undefined, params?:any}): Promise<AxiosInstance> => {

    // "use server"

    console.log("axiosInstance()" )

    // const session = useSession().data
    // console.log("axiosInstance - session: ", session)
    // const auth = getServerSession().auth()   
    


    let _params : CreateAxiosDefaults<any> = {
        baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
        timeout: 30000, //5000,
    }

    // if ( useAuth == false ) {
    //     // return axios.create(_params);
    //     let instance = axios.create(_params);

    //     const axiosInst = setupCache(instance)
    
    //     return axiosInst
    // }

     // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGRkN2VhMjRiYzEwYTRiZjFlMzdlMiIsImlhdCI6MTczNDAxODExNiwiZXhwIjoxNzM2NjEwMTE2fQ.grXcAgaUutf6Nya7aSWy2eR9N2IqXec428D6rMG25Pg"
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGRkN2VhMjRiYzEwYTRiZjFlMzdlMiIsImlhdCI6MTc0MDQwNTM1NSwiZXhwIjoxNzQyOTk3MzU1fQ.AVhyQODLUEhr5Oh6BuWfz4a0rVh3qRT9EtHag2TjbnQ"
    if (token && useAuth) {
        console.log("axiosInstance - token: ", token)

        const header : AxiosHeaderValue = "bearer " + token;
        const paramsUpdated = {
            ..._params,
            headers: {
                Authorization: header
            }
        }             
        console.log("axiosInstance - paramsUpdated: ", paramsUpdated)
        let instance = axios.create(paramsUpdated);
        const axiosInst = setupCache(instance)
        console.log("axiosInstance - return: ", axiosInst)
        return axiosInst
    }

    if ( globalThis.token ) {
        console.log("axiosInstance - globalThis.token: ", globalThis.token)
        const header : AxiosHeaderValue = "bearer " + globalThis.token;
        const paramsUpdated = {
            ..._params,
            headers: {
                Authorization: header
            }
        }
        let instance = axios.create(paramsUpdated);
        const axiosInst = setupCache(instance)
        return axiosInst

    }


    // let session =
    const paramsUpdated = await auth()
    .then((session) => {

        // console.log("axiosInstance - auth session: ", session)

        if ( ! session?.expires ) { 
            // console.log("BAD session  *****************************************")
                throw ("Bad Session")
        }


        const expirationDate = new Date(session.expires)
        const now = new Date()

        // console.debug("axiosInstance - expirationDate: ", expirationDate.toString())
        // console.debug("axiosInstance - now: ", now.toString())
        // console.debug("axiosInstance - expirationDate < now: ", expirationDate < now)
        // console.debug("axiosInstance - expirationDate.getMilliseconds < now: " , expirationDate.getMilliseconds() , " < " , now.getMilliseconds() , expirationDate.getMilliseconds() < now.getMilliseconds())
        // console.debug("axiosInstance - expirationDate.getTime < now: " , expirationDate.getTime() , " < " , now.getTime() , expirationDate.getTime() < now.getTime())

        if ( expirationDate.getTime() < now.getTime() ) 
        {
            // console.log("Session expired -------------------------------------- ************** ")
            throw("Session Expired")
        }

        // console.log("axiosInstance - auth session: ", session) 
        let token = undefined   
        if (session) {
            token = session.user.token
            // console.log("axiosInstance - session.user.token: ", token)
        } else {
            // console.log("axiosInstance - no session: ")
            const headersList = headers()
            token = headersList.get('authorization')
        }

            if (!token){
                token = globalThis.token
                // console.log("axiosInstance - globalThis.token: ", token)
            }

            if (token) {
                console.log("axiosInstance - token: ", token)

                const header : AxiosHeaderValue = "bearer " + token;
                _params = {
                    ..._params,
                    headers: {
                        Authorization: header
                    }
                }
            } else {
                console.log("axiosInstance - No token")
            }
        

        // console.info("axiosInstance params", _params)
        // let instance = axios.create(_params);
    
        // const axiosInst = setupCache(instance)
    
        // return axiosInst

        return _params
    })
    .catch((error) => {
        console.error("axiosInstance - error: ", error)

        token = globalThis.token
        // console.log("axiosInstance - globalThis.token: ", token)

        if (token) {
        //    console.log("axiosInstance - token: ", token)

            const header : AxiosHeaderValue = "bearer " + token;
            _params = {
                ..._params,
                headers: {
                    Authorization: header
                }
            }
        } else {
        // console.log("axiosInstance - No token")
        return _params
        }

        //throw(error)
    })


    // if (!session) {
    //     if (useAuth) {
    //         const session = await getServerSession(options)

    //         console.log("axiosInstance - getServerSession - session: ", session)

    //         token = session?.user?.token    
    //     }    
    // }

    // if (session) {
    //     console.log("axiosInstance - session: ", session)
    // }

    // // const session = await auth()
    
    // if (session) {
    //     const token = session.user.token

    //     if (token) {
    //         console.log("axiosInstance - token: ", token)

    //         const header : AxiosHeaderValue = "bearer " + token;
    //         _params = {
    //             ..._params,
    //             headers: {
    //                 Authorization: header
    //             }
    //         }
    //     } else {
    //         console.log("axiosInstance - No token")
    //     }
    // }

    // console.info("axiosInstance params", _params)
    // let instance = axios.create(_params);
    let instance = axios.create(paramsUpdated);

    const axiosInst = setupCache(instance)

    return axiosInst
}




export default axiosInstance;
