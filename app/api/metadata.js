"use server";

import useSWR from "swr"
import * as api from '@/app/api/network/zooprocess-api' 


export async function useMetadata() {
    const { data={}, error=false, isLoading=true } = useSWR(`/metadata`, api.getMetadata ,
    {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    return {
        metadata: data,
        isLoading,
        isError: error
    }
}

