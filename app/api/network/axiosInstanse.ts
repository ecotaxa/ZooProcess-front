"use server"


import { auth } from '@/auth';
import axios, { AxiosHeaderValue, AxiosInstance, CreateAxiosDefaults } from 'axios';
import { setupCache } from 'axios-cache-interceptor';


const axiosInstancev = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_SERVER,
    timeout: 5000,
});

import { headers } from 'next/headers';





const axiosInstanceSimple = async ({useAuth = true, token = undefined, params = {}}:{useAuth?:boolean,token?:string|undefined, params?:any}): Promise<AxiosInstance> => {
    let _params : CreateAxiosDefaults<any> = {
        baseURL: process.env.NEXT_PUBLIC_API_SERVER,
        timeout: 5000,
    }

    return auth()
    .then((session) => {
        let token = undefined
        if (session) {
            token = session.user.token
        }

        if (token) {

            const header : AxiosHeaderValue = "bearer " + token;
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
        else {
            throw(new Error("No token"))
        }
    })
    .catch((error) => {
        console.error("axiosInstance - error: ", error)
        throw(error)
    })
}




const axiosInstance = async ({useAuth = true, token = undefined, params = {}}:{useAuth?:boolean,token?:string|undefined, params?:any}): Promise<AxiosInstance> => {

    console.log("axiosInstance()" )

   


    let _params : CreateAxiosDefaults<any> = {
        baseURL: process.env.NEXT_PUBLIC_API_SERVER,
        timeout: 30000, 
    }

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


    const paramsUpdated = await auth()
    .then((session) => {


        if ( ! session?.expires ) {
                throw ("Bad Session")
        }


        const expirationDate = new Date(session.expires)
        const now = new Date()

    
        if ( expirationDate.getTime() < now.getTime() )
        {
            throw("Session Expired")
        }

        let token = undefined
        if (session) {
            token = session.user.token
        } else {
            const headersList = headers()
            token = headersList.get('authorization')
        }

            if (!token){
                token = globalThis.token
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



        return _params
    })
    .catch((error) => {
        console.error("axiosInstance - error: ", error)

        token = globalThis.token

        if (token) {

            const header : AxiosHeaderValue = "bearer " + token;
            _params = {
                ..._params,
                headers: {
                    Authorization: header
                }
            }
        } else {
        return _params
        }

    })


    
    let instance = axios.create(paramsUpdated);

    const axiosInst = setupCache(instance)

    return axiosInst
}




export default axiosInstance;
