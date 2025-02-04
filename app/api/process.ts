
"use server";

import useSWR from 'swr'
import * as api from '@/app/api/network/zooprocess-api' 

export function useProcess( projectid: string, sampleid: string, subsampleid: string){


    const url = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/process`

    const { data={}, error=false, isLoading=true } = useSWR( url, api.getProcess ,
        {

          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          refreshInterval: 10
        })
  
    return {
        data: data,
        isLoading,
        isError: error
    }
}


