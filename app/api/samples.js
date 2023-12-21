import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 

export function useSamples(projectId) {

    if ( projectId == undefined ){
      throw "projectId == undefined"
    }

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



  export function addSample({projectId, data}){
  // export function addSample({params, data}){

    console.log("adding Sample...projectId: ", projectId);
    // console.log("adding Sample...projectId: ", params.projectId);
    // console.log("params: ", params);
    console.log("adding Sample...data: ", data);

    // TODO added info box

    return api.addSample(projectId, data).then(() => {
      console.log("Sample added OK");
      return new Promise( () => { return ("Sample have been added") })
    })
    .catch ((error) =>  {
      console.error("Sample added NOK: ", error);
      console.log("projectid: ", projectId);
      console.log("data:", data);
      throw ({
        message:"Cannot add sample",
        error,
        data,
        projectId,
      })
    })

  }

// module.exports = 'useProjects'




  