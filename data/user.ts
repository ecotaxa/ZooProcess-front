

import {useUserByEmail, useUserById} from '@/api/user'

export const getUserByEmail = async (email: string) => {
    // try {
    //     const user = await db.user.findUnique({
    //         where: {
    //             email,
    //         }
    //     })
    //     return user
    // }
    // catch {
    //     return null
    // }

    const user = await useUserByEmail(email)
    return user
}

// export const getUserByiD = async (id: string) => {
//     // try {
//     //     const user = await db.user.findUnique({
//     //         where: {
//     //             id,
//     //         }
//     //     })
//     //     return user
//     // }
//     // catch {
//     //     return null
//     // }
//     const user = await useUserById(id)
//     return user
// }

import * as api from '@/app/api/network/zooprocess-api' 

// import { decode } from '@auth/core/jwt';
import * as jose from 'jose'
// import { cookies } from 'next/headers'

export async function login(email:string, password : string) {
  
    // const id = await api.login({email,password})
    // if ( id ){
    //     const user = await api.getUserById(`/users/${id}`)
    //     return user    
    // }

    return api.login({email,password})
        .then(async (token)=> {
            try {

                console.log("token: ", token)

                // return token

                const secret = process.env.AUTH_SECRET || ""
                // const t:JWTDecodeParams = {}
                // const decoded = await decode({
                //     salt:"",
                //     token,
                //     secret,
                //   });

                const decoded = jose.decodeJwt(token)
                console.log("token decoded: ", decoded)

                globalThis.token = token

                const user = await api.getUserById(`/users/${decoded.id}`, token )
                // const user = await api.getUserById(`/users/${decoded.id}` )
                console.log(`user "${user.name || email}" logged`)
                user.token = token

                // if ( token.token){
                //     cookies().set("currentUser", token.token , token.expires_in)
                // }

                return user

            } catch (e) {
                throw (`Server Error: ${e}`)
            }
        })        
        .catch((e)=>{
            console.log(`User "${email}" is trying to log. Error ${e}`)
            throw("Invalid Credential")
        })

    // return null
}

