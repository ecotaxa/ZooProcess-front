// import { parseJSON } from 'date-fns'
// import useSWR, { Fetcher } from 'swr'
import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 
// import { auth } from '@/auth'
// import { da } from 'date-fns/locale'

// const getProjectsFetcher = (url) => { api.getProjects(url,globalThis.token) }

export function useProjects() {

    // console.log("globalThis.token :", globalThis.token)


    const { data=[], error=false, isLoading=true } = useSWR('/projects/', api.getProjects ,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      })

    // if ( isLoading==false && error==false ){
    //   console.log("useProjects()")
    //   console.log("  data      -> ", data )
    //   console.log("  isLoading -> ", isLoading )
    //   console.log("  error     -> ", error )
    // }

    return {
      projects: data,
      isLoading,
      isError: error
    }
  }


  
  export function useProject(projectId) {
    const { data={}, error=false, isLoading=true } = useSWR(`/projects/${projectId}`, api.getProject ,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      })

    // if ( isLoading==false && error==false ){
    //   console.log("useProjects()")
    //   console.log("  data      -> ", data )
    //   console.log("  isLoading -> ", isLoading )
    //   console.log("  error     -> ", error )
    // }

    return {
      project: data,
      isLoading,
      isError: error
    }
  }

  // export function useProjectMetadata(projectId) {

  //   const { data=[], error=false, isLoading=true } = useSWR(`/projects/${projectId}/metadata`, api.getProjectMetadata ,
  //     {
  //       revalidateIfStale: false,
  //       revalidateOnFocus: false,
  //       revalidateOnReconnect: false
  //     })

  //   // if ( isLoading==false && error==false ){
  //   //   console.log("useProjects()")
  //   //   console.log("  data      -> ", data )
  //   //   console.log("  isLoading -> ", isLoading )
  //   //   console.log("  error     -> ", error )
  //   // }

  //   return {
  //     project: data,
  //     isLoading,
  //     isError: error
  //   }
  // }



export function addProject(data){

  console.log("adding Project...");
  console.info(data);

  // TODO added info box
  if (data.scanningOptions == null) 
  {
    throw("scanningOptions is null")
  }

  return api.addProject(data)
  .then((response) => {
    console.log("Project added OK");
    return Promise.resolve({data:response, message:"Project added"}) 
  })
  .catch ((error) =>  {
    console.error("Project added NOK: ", error);
    throw(error.message)
  })

}



const convertData2api = (data) => {

  const date = new Date();

  let dataConverted = {
    id:data.id,
    name:data.name,
    acronym:data.acronym,
    driveId:data.driveId,
    description:data.description,

    // only manager options
    scanningOptions:data.scanningOptions.currentKey,
    updateAt:date.toISOString(), 
  }

  return dataConverted
}



export function updateProject(data){

  console.log("updating Project... with: ", data);

  // TODO added info box


  const dataConverted = convertData2api(data);


  return api.updateProject(dataConverted)
  .then((response) => {
    console.log("Project updated OK", response);
    return Promise.resolve({data:response, message:"Project updated"} )
  })
  .catch ((error) =>  {
    console.error("Project updated NOK: ", error);
    throw(error.message)
  })

}


  // module.exports = 'useProjects'


  