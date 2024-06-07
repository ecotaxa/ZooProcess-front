// import { parseJSON } from 'date-fns'
// import useSWR, { Fetcher } from 'swr'
import useSWR from 'swr'
import { useProjects } from '@/app/api/projects';

import * as api from '@/app/api/network/zooprocess-api' 
import { useEffect } from 'react';

export function useBackgrounds(projectId) {

    if ( projectId == undefined ){
        return {
            backgrounds: [],
            isLoading : false,
            isError: { message: "Cannot determine the project" }
        }    
    }

    // const { project } = useProjects(projectdId)

    // useEffect( () => { 
    //     console.log("project has changed", project);
        
    //     if (project == undefined) {
    //         return {
    //             backgrounds: [],
    //             isLoading : true,
    //             isError: false
    //         }
    //     }


    //     if ( project.instrumentsId == undefined ){
    //         return {
    //             backgrounds: [],
    //             isLoading : false,
    //             isError: { message: "No instrument associated to the project" }
    //         }
    //     }

    //     instrumentsId = project.instrumentsId

    
    //     const { data=[], error=false, isLoading=true } = useSWR('/backgrounds/${instrumentsId}', api.getBackgrounds, {
    //         revalidateIfStale: false,
    //         revalidateOnFocus: false,
    //         revalidateOnReconnect: false
    //     })
    
    //     return {
    //       backgrounds: data,
    //       isLoading,
    //       isError: error
    //     }

    // } , [project])

   
        const { data=[], error=false, isLoading=true } = useSWR(`/projects/${projectId}/backgrounds`, api.getBackgrounds, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    // return {
    //     backgrounds: [],
    //     isLoading: true,
    //     isError: false
    //   }

      return {
              backgrounds: data,
              isLoading,
              isError: error
            }
}




export function useSampleScans(projectId) {

    if ( projectId == undefined ){
        return {
            scans: [],
            isLoading : false,
            isError: { message: "Cannot determine the project" }
        }    
    }
   
    const { data=[], error=false, isLoading=true } = useSWR( 
                `/projects/${projectId}/scans`, 
                api.getBackgrounds, 
                {
                    revalidateIfStale: false,
                    revalidateOnFocus: false,
                    revalidateOnReconnect: false
                }
    )

    return {
            scans: data,
            isLoading,
            isError: error
    }
}

