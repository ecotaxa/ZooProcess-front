"use client";

// import { parseJSON } from 'date-fns'
// import useSWR, { Fetcher } from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 
import useSWR from 'swr'

export async function useUserByEmail(email) {

    // const res = await fetch()

    const { data=[], error=false, isLoading=true } = useSWR(`/user?email=${email}`, api.getUserByEmail ,
      {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
      }
    )

    // if ( isLoading==false && error==false ){
    //   console.log("useProjects()")
    //   console.log("  data      -> ", data )
    //   console.log("  isLoading -> ", isLoading )
    //   console.log("  error     -> ", error )
    // }

    return {
      user: data,
      isLoading,
      isError: error
    }
}


export async function useUserById(userId) {

  console.log("useUserById() | userId :", userId)
    // const user = await api.getUserById(`/users/${userId}`)
    // return user

    // const res = await fetch()

    const { data=[], error=false, isLoading=true } = useSWR(`/users/${userId}`, api.getUserById,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    })

    return {
      user: data,
      isLoading,
      isError: error
    }
}


export function useUserMe() {

  console.log("useUserMe()" )

    // const { data={}, error=false, isLoading=true } = useSWR(`/users/me`, api.getUserMe,
    const { data=[], error=false, isLoading=true } = useSWR(`/users/me` ,api.getUserMe,
      {
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false
      }
    )

    if ( isLoading==false && error==false ){
      console.log("useUserMe()")
      console.log("  data      -> ", data )
    }

    return {
      user: data,
      isLoading,
      isError: error
    }

}
