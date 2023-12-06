import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 

export function useSamples(projectId) {

    // const { data=[], error=false, isLoading=true } = useSWR(`${projectid}`, api.getSamples ,
    const { data=[], error=false, isLoading=true } = useSWR(`/projects/${projectId}/samples`, api.getSamples ,
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
      samples: data,
      isLoading,
      isError: error
    }
  }



export function addSample(projectId, data){

  console.log("adding Sample...");

  // TODO added info box

  api.addSample(projectId, data).then(() => {
    console.log("Sample added OK");
  })
  .catch ((error) =>  {
    console.error("Sample added NOK: ", error);
  })

}

// module.exports = 'useProjects'




  