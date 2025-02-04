"use server";

// import { parseJSON } from 'date-fns'
// import useSWR, { Fetcher } from 'swr'
import useSWR from 'swr'
// import { useProjects } from '@/app/api/projects';

import * as api from '@/app/api/network/zooprocess-api' 
import { getScan } from './network/scan';
// import { useEffect } from 'react';

/**
 * Fetches background data for a given project using its ID.
 * Utilizes SWR for data fetching and caching.
 * 
 * @param {string} projectId - The ID of the project to fetch backgrounds for.
 * @returns {Object} An object containing:
 *   - backgrounds: An array of background data.
 *   - isLoading: A boolean indicating if the data is still loading.
 *   - isError: An error object if an error occurred, otherwise false.
 * 
 * If the projectId is undefined, returns an error message indicating
 * the inability to determine the project.
 */
export async function useBackgrounds(projectId) {

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

export async function useGetScan(scanId) {

    console.log("useGetScan: scanId", scanId)

    if ( scanId == undefined ){
        return {
            scan: [],
            isLoading : false,
            isError: { message: "Cannot determine the scan" }
        }    
    }

    const { data=undefined, error=false, isLoading=true } = useSWR(
        `/scan/${scanId}`,
        // api.getScan, 
        getScan,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }    
    )

    return {
        scan: data,
        isLoading,
        isError: error
    }  
}

export async function useShowScan(scanId) {

    console.log("useGetScan: scanId", scanId)

    if ( scanId == undefined ){
        return {
            scan: [],
            isLoading : false,
            isError: { message: "Cannot determine the scan" }
        }    
    }

    const { data=undefined, error=false, isLoading=true } = useSWR(
        `/scan/${scanId}?show`,
        // `/scan/${scanId}`,
        // api.getScan, 
        getScan,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }    
    )
 
    // let locapPath = await converttiff2jpg(path)
    // .then(async (response/*: Response*/) => {
    //     console.log("converttiff2jpg response: ", response)
    //     response.text()
    //     .then(async (imageUrl) => {
    //         // show the converted image
    //         // setImageUrl(imageUrl);
    //         console.log("imageUrl: ", imageUrl)
    //         // if ( imageUrl[0] == '"' ) {
    //         //     console.error("arrrggggggggg !!!!!")
    //         //     imageUrl=imageUrl.substring(1)
    //         // }
    //         // console.debug("imageUrl[-1]: ", imageUrl[-1])
    //         // if ( imageUrl[-1] == '"'){
    //         //     console.error("arrrggggggggg !!!!!")
    //         //     imageUrl=imageUrl.substring(0,imageUrl.length-1)
    //         // }
    //         // const
    //         const locapPath = pathToSessionStorage(imageUrl)
    //         console.log("localPath: ", locapPath)
    //         // setBackground(localPath)
    //         return locapPath
    //     })
    //     .catch((error) => {
    //         console.error("addBackground catch error: ", error)
    //         // return Promise.reject(error)
    //         // return <div>Error: {error}</div>
    //         return undefined
    //     })
    // })
    // .catch(error => {
    //     return undefined                    
    // })


    return {
        scan: data,
        isLoading,
        isError: error
    } 

}
export async function useSampleScans(projectId) {

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

