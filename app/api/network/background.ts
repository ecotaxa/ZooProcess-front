"use server"

import axiosInstanse from '@/network/axiosInstanse';
import * as I from './interfaces'



// on se fiche de userId : il est passé avec le bearer token
// export async function addBackground(instrumentId:string, image: {url:string, userId:string}) {
export async function addBackground(image: I.IScan ) : Promise<I.Background> {

    console.log("addBackground:", image)
    const api = await axiosInstanse({})

    const data = {
        url: image.url,
        projectId:image.projectId
    }

    const url = `/background/${image.instrumentId}/url?projectId=${image.projectId}`
    console.log("addBackground url:", url)
    console.log("addBackground data:", data)

    return await api.post(url, data )
        .then(function (response) {
            console.log("addBackground response: ", response);
            return response.data; // here return Scan object
        })
        .catch((error) => {
            console.log("addBackground Error: ", error.toJSON());
            if (error.response) {

            if (error.response.status == "409"){
                console.log("Duplicate value")
                const msg = {
                //error:{
                    message: error.response.data || "Duplicate value"
                //}
                }
                // throw(msg)
                return Promise.reject(new Error(msg.message))
            }

            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            return Promise.reject(error.response)
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
            console.log(error.config);
            // throw(error);
            return Promise.reject(new Error(error.message))
        });


}



export async function getBackgrounds(url:string){
    console.log("getBackgrounds");
    const api = await axiosInstanse({})

    const response = await api.get<Array<I.Background>>(url)
    // .then(function (response) {
        // console.log("getBackgrounds response: ", response);
        return response.data;
    // })
    // .catch((error) => {
    //   console.log("getBackgrounds Error: ", error.toJSON());
    //   // if (error.response) {
        // if
}


export async function getBackgroundTaskStatus(taskId: string): Promise<string> {
    console.debug("getBackgroundTaskStatus()");
    try {
      const api = await axiosInstanse({})
      const response = await api.get<string>(`/background/task/${taskId}`)
      return response.data;
    } catch (error) {
      console.error("Error - getBackgroundTaskStatus()", error);
      throw error;
    }
  }

