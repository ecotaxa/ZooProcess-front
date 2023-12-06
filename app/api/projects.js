// import { parseJSON } from 'date-fns'
// import useSWR, { Fetcher } from 'swr'
import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 

export function useProjects() {
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
    const { data=[], error=false, isLoading=true } = useSWR(`/projects/${projectId}`, api.getProject ,
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

export function addProject(data){

  console.log("adding Project...");

  // TODO added info box

  api.addProject(data).then(() => {
    console.log("Project added OK");
  })
  .catch ((error) =>  {
    console.error("Project added NOK: ", error);
  })

}

  // module.exports = 'useProjects'


  