import useSWR from "swr"



import * as api from '@/app/api/network/zooprocess-api' 



export function useVignettes(taskId) {

    // console.log("globalThis.token :", globalThis.token)


    const { data, error=false, isLoading=true } = useSWR(`/separator/${taskId}`, api.getVignettes ,
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
      separatorTask: data,
      isLoading,
      isError: error
    }
  }