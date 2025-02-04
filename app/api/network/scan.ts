"use server"

import axiosInstanse from '@/network/axiosInstanse';
import * as I from './interfaces'


// export async function addScan(image: {url:string, instrumentId:string, projectid:string, subsampleid:string}) {
export async function addScan(image: {url:string, instrumentId:string, projectId:string, subsampleId:string}) {

console.debug("addScan:", image);
const api = await axiosInstanse({});
console.debug("addScan: api OK" );
const data = {
    url: image.url,
    // subSampleId:image.subsampleId
}

// return await api.post(`/scan/${image.instrumentId}/url`, data )
// const url = `/scan/${image.instrumentId}/url` // ?projectId=${image.projectId}`
const url = `/scan/${image.subsampleId}/url` // ?projectId=${image.projectId}`
console.log("addBackground url:", url);
console.log("addBackground data:", data);

return await api.post(url, data )
    .then(function (response) {
        console.log("addScan response: ", response);
        return response.data;
    })
    .catch((error) => {
        console.log("addScan Error: ", error.toJSON());
        if (error.response) {

        if (error.response.status == "409"){
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

    console.debug("addScan out");
}
      
      // export async function addScanOld(image: {url:string, instrumentId:string, subsampleid:string}) {
        
      //   console.log("addScan:", image)
      //   const api = await axiosInstanse({})
      
      //   const data = {
      //     url: image.url
      //   }
      
      //   return await api.post(`/scan/${image.instrumentId}/url`, data )
      //       .then(function (response) {
      //         console.log("addScan response: ", response);
      //         return response.data;
      //       })
      //       .catch((error) => {
      //         console.log("addScan Error: ", error.toJSON());
      //         if (error.response) {
      
      //           if (error.response.status == "409"){
      //             const msg = {
      //               //error:{
      //                 message: error.response.data || "Duplicate value"
      //               //}
      //             }
      //             throw(msg)
      //           }
      
      //           // The request was made and the server responded with a status code
      //           // that falls out of the range of 2xx
      //           console.log(error.response.data);
      //           console.log(error.response.status);
      //           console.log(error.response.headers);
      //         } else if (error.request) {
      //           // The request was made but no response was received
      //           // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //           // http.ClientRequest in node.js
      //           console.log(error.request);
      //         } else {
      //           // Something happened in setting up the request that triggered an Error
      //           console.log('Error', error.message);
      //         }
      //         console.log(error.config);
      //         throw(error);
      //       });
      
      
      // }

export async function getScan(url:string) {
    console.log("getScan");
    const api = await axiosInstanse({})

    const response = await api.get<I.Background>(url)
    return response.data;
}
      