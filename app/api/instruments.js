
import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 

export function useInstruments() {
    const { data=[], error=false, isLoading=true } = useSWR('/instruments/', api.getInstruments ,
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



export function useInstrument(instrumentId) {
    const { data=[], error=false, isLoading=true } = useSWR(`/instruments/${instrumentId}`, api.getInstrument ,
    {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    return {
        instrument: data,
        isLoading,
        isError: error
    }
}