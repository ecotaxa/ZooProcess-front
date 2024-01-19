import useSWR from 'swr'

import * as api from '@/network/zooprocess-api' 

export function useSamples(projectId) {

  if ( projectId == undefined ){
    throw "projectId == undefined"
  }

  const { data=[], error=false, isLoading=true } = useSWR(
    `/projects/${projectId}/samples`, 
    api.getSamples ,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
  })

  return {
    samples: data,
    isLoading,
    isError: error
  }
}

export function useSample(projectId, sampleId) {
  // const { data=[], error=false, isLoading=true } = useSWR(`${projectid}`, api.getSamples ,

  console.log("useSample ", projectId, sampleId )

  const { data=[], error=false, isLoading=true } = useSWR(
    `/projects/${projectId}/samples/${sampleId}`, 
    api.getSample ,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
  })

  return {
    sample: data,
    isLoading,
    isError: error
  }
}

export async function addSample({projectId, data}){
// export function addSample({params, data}){

  console.log("adding Sample...projectId: ", projectId);
  // console.log("adding Sample...projectId: ", params.projectId);
  // console.log("params: ", params);
  console.log("adding Sample...data: ", data);

  // TODO added info box

  return api.addSample(projectId, data)
  .then((response) => {
    console.log("Sample added OK");
    return Promise.resolve( { data:response, message:"Sample have been added"})
  })
  .catch ((error) =>  {
    console.error("Sample added NOK: ", error);
    console.log("projectid: ", projectId);
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


export async function updateSample({projectId, sampleId, data}){

  console.log("umpdate Sample...projectId: ", projectId, " - ", sampleId);

  return api.updateSample(projectId,sampleId,data)
  .then( (response) => {
    console.log("Sample added OK");
    return Promise.resolve( { data:response, message:"Sample update"} )
  })
  .catch( (error) => {
    throw ({
      message:"Cannot add sample",
      error,
      data,
      projectId,
      sampleId
    })
  })

}

// module.exports = 'useProjects'




  