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


export async function addSubSample({projectId, sampleId, data}){
  
    console.log("adding SubSample...projectId: ", projectId, ", sampleId: ", sampleId);
    // console.log("adding Sample...projectId: ", params.projectId);
    // console.log("params: ", params);
    console.log("adding SubSample...data: ", data);
  
    // TODO added info box
  
    return api.addSubSample(projectId, sampleId, data)
    .then((response) => {
      console.log("SubSample added OK");
      return Promise.resolve( { data:response, message:"SubSample have been added"})
    })
    .catch ((error) =>  {
      console.error("SubSample added NOK: ", error);
      console.log("projectid: ", projectId);
      console.log("sampleid: ", sampleId);
      console.log("data:", data);
      // throw ({
      //   message:"Cannot add sample",
      //   error,
      //   data,
      //   projectId,
      // })
      throw (error.message)
    })
  
  }


