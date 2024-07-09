// "use server"

// import { auth } from '@/auth';
import axios, { AxiosHeaderValue, AxiosInstance, CreateAxiosDefaults } from 'axios';
import { setupCache } from 'axios-cache-interceptor';

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






const axiosInstance = async ({useAuth = true, token = undefined, params = {}}:{useAuth?:boolean,token?:string|undefined, params?:any}): Promise<AxiosInstance> => {

    // "use server"

    let _params : CreateAxiosDefaults<any> = {
        baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
        timeout: 5000,
    }

    if (useAuth ) {
        const session = await getSession()
        token = session?.user?.token    
    }

    if (token) {
        // console.info("token: ", token)

        const header : AxiosHeaderValue = "bearer " + token;
        _params = {
            ..._params,
            headers: {
                Authorization: header
            }
        }
    }    
    // console.info("axiosInstance params", _params)
    
    let instance = axios.create(_params);

    const axiosInst = setupCache(instance)

    return axiosInst
}




export default axiosInstance;
