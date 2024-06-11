
import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 

export function useInstruments() {
    const { data=[], error=false, isLoading=true } = useSWR('/drives/', api.getInstruments ,
    {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    return {
        instruments: data,
        isLoading,
        isError: error
    }
}

