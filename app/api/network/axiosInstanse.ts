// "use server"

// import { auth } from '@/auth';
import axios, { AxiosHeaderValue, AxiosInstance, CreateAxiosDefaults } from 'axios';
// import { serverHooks } from 'next/dist/server/app-render/entry-base';
// import { getToken } from './token';
// import { useSession } from 'next-auth/react';
// import { cookies } from 'next/headers';

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




const axiosInstance = async (token : string|undefined = undefined): Promise<AxiosInstance> => {

    // "use server"

    let params : CreateAxiosDefaults<any> = {
        baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
        timeout: 5000,
        // headers: {
        //     Authorization: ""
        // }
    }

    // const { data : session } = useSession()

    // const token2 = cookies().get("currentUser")

    // const token =  getToken()

    // console.log("axiosInstance token", globalThis.token)
    // const session = auth()

//     // arg ne fonctionne pas, se mord encore la queue
    if (token) {
        // const token = await auth()
        // const token = ""
        if (token) {
            const header : AxiosHeaderValue = "bearer " + token;
            params = {
                ...params,
                headers: {
                    Authorization: header
                }
            }
        }
    }

    let api = axios.create(params);
    return api

    // return axiosInstancev
}




export default axiosInstance;
