

import {useUserByEmail} from '@/api/user'

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

}

// export const getUserByiD = async (id: string) => {
//     try {
//         const user = await db.user.findUnique({
//             where: {
//                 id,
//             }
//         })
//         return user
//     }
//     catch {
//         return null
//     }
// }

import * as api from '@/app/api/network/zooprocess-api' 

// import { decode } from '@auth/core/jwt';
import * as jose from 'jose'

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

                const secret = process.env.AUTH_SECRET || ""
                // const t:JWTDecodeParams = {}
                // const decoded = await decode({
                //     salt:"",
                //     token,
                //     secret,
                //   });

                const decoded = jose.decodeJwt(token)
                console.log("token decoded: ", decoded)

                const user = await api.getUserById(`/users/${decoded.id}`, token )
                console.log(`user "${user.name || email}" logged`)
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

