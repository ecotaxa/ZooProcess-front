// "use server"

// import { auth } from '@/auth';
import axios, { AxiosHeaderValue, AxiosInstance, CreateAxiosDefaults } from 'axios';

// import { serverHooks } from 'next/dist/server/app-render/entry-base';
// import { getToken } from './token';
// import { useSession } from 'next-auth/react';
// import { cookies } from 'next/headers';


import {getSession} from 'next-auth/react'

const axiosInstancev = axios.create({
    baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
    timeout: 5000,
});



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






const axiosInstance = async ({useAuth = true, token = undefined}:{useAuth?:boolean,token?:string|undefined}): Promise<AxiosInstance> => {

    // "use server"

    let params : CreateAxiosDefaults<any> = {
        baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
        timeout: 5000,
        // headers: {
        //     Authorization: ""
        // }
    }


    // const token2 = cookies().get("currentUser")

    // const token =  getToken()

    // console.log("axiosInstance token", globalThis.token)

    let token2 = undefined
    if (useAuth ) {
        console.log("++ useAuth")
        const session = await getSession()
        console.log("-- session: ", session)
        token2 = session?.user?.token    
        console.log("token2: ", token2)
    }

    console.log("mes couilles")

    // let tokenToUse = token || token2
    let tokenToUse = undefined
    if ( token) tokenToUse = token
    console.log("mes couilles")
    if ( token2 ) tokenToUse = token2
    // console.log("token: ", tokenToUse)
    if (tokenToUse) {
        console.log("token: ", tokenToUse)

        const header : AxiosHeaderValue = "bearer " + tokenToUse;
        params = {
            ...params,
            headers: {
                Authorization: header
            }
        }
    }    
    console.log("axiosInstance params", params)
    
    let api = axios.create(params);
    return api

    // return axiosInstancev
}




export default axiosInstance;
