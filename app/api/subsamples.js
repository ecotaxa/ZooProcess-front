import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 

export function useSubSamples(projectId,sampleId) {

  if ( projectId == undefined ){
    throw "projectId == undefined"
  }

  const { data=[], error=false, isLoading=true } = useSWR(
    `/projects/${projectId}/samples/${sampleId}/subsamples`, 
    api.getSubSamples ,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
  })

  return {
    subsamples: data,
    isLoading,
    isError: error
  }
}
