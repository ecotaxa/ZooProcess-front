import useSWR from "swr"



import * as api from '@/app/api/network/zooprocess-api' 



export function useVignettes(taskId) {

    // console.log("globalThis.token :", globalThis.token)


    const { data, error=false, isLoading=true } = useSWR(`/separator/${taskId}`, api.getVignettes ,
      {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: true
      })

    // if ( isLoading==false && error==false ){
    //   console.log("useProjects()")
    //   console.log("  data      -> ", data )
    //   console.log("  isLoading -> ", isLoading )
    //   console.log("  error     -> ", error )
    // }
      console.debug("useVignettes got", data, error, isLoading)
      if ( error ) {
        console.error(error)  
      }

    return {
      separatorTask: data?.data,
      isLoading,
      isError: error
    }
  }