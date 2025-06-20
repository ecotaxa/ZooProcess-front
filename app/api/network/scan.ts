"use server"

import axiosInstanse from '@/network/axiosInstanse';
import * as I from './interfaces'
// import { time } from 'console';


// export async function addScan(image: {url:string, instrumentId:string, projectid:string, subsampleid:string}) {
// export async function addScan(image: {url:string, instrumentId:string, projectId:string, subsampleId:string}) {

// console.debug("addScan:", image);
// const api = await axiosInstanse({});
// console.debug("addScan: api OK" );
// // const data = {
// //     url: image.url,
// //     // subSampleId:image.subsampleId
// // }
// const data = image
// // return await api.post(`/scan/${image.instrumentId}/url`, data )
// // const url = `/scan/${image.instrumentId}/url` // ?projectId=${image.projectId}`
// const url = `/scan/${image.subsampleId}/url` // ?projectId=${image.projectId}`
// console.log("addBackground url:", url);
// console.log("addBackground data:", data);

// return await api.post(url, data )
//     .then(function (response) {
//         console.log("addScan response: ", response);
//         return response.data;
//     })
//     .catch((error) => {
//         console.log("addScan Error: ", error.toJSON());
//         if (error.response) {

//         if (error.response.status == "409"){
//             const msg = {
//             //error:{
//                 message: error.response.data || "Duplicate value"
//             //}
//             }
//             // throw(msg)
//             // return Promise.reject(new Error(msg.message))
//             return Promise.reject(msg.message)

//         }

//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//         } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         console.log(error.request);
//         } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log('Error', error.message);
//         }
//         console.log(error.config);
//         // throw(error);
//         // return Promise.reject(new Error(error.message))
//         return Promise.reject(error.message)
//     });

//     console.debug("addScan out");
// }
    
export async function addScan(image: {url:string, instrumentId:string, projectId:string, sampleId:string, subsampleId:string}) {
    console.debug("addScan:", image);
    
    try {
      const api = await axiosInstanse({
        params: {
            timeout: 60000, // 60s
        }
      });
      console.debug("addScan: api OK");
      
      const data = { url: image.url, instrumentId: image.instrumentId };
      const url = `/projects/${image.projectId}/samples/${image.sampleId}/subsamples/${image.subsampleId}/scan_url`;
      console.log("addScan url:", url);
      console.log("addScan data:", data);
      
      const response = await api.post(url, data);
      console.log("addScan response: ", response);
      return response.data;
    } catch (error: any) {
      console.log("addScan Error: ", error.toJSON ? error.toJSON() : error);
      
      // Extraire les informations d'erreur pertinentes
      let errorMessage = "Failed to add scan";
      let errorDetails = null;
      let errorCode = null;
      let errorPath = null;
      
      // Si l'erreur a une réponse avec des données
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        
        // Cas spécifique pour l'erreur 409 (conflit)
        if (error.response.status === 409) {
          errorMessage = error.response.data || "Duplicate value";
          return Promise.reject(errorMessage);
        }
        
        // Extraire les détails d'erreur si disponibles
        if (error.response.data && error.response.data.error) {
          const errorData = error.response.data.error;
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData.details || null;
          errorCode = errorData.code || null;
          errorPath = errorData.path || null;
        } else if (error.response.data) {
          errorMessage = error.response.data.message || error.response.data || errorMessage;
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.log(error.request);
        errorMessage = "No response received from server";
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.log('Error', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      console.log(error.config);
      
      // Créer un objet d'erreur simple qui peut être sérialisé
      const serializedError = {
        message: errorMessage,
        details: errorDetails,
        code: errorCode || error.code,
        path: errorPath,
        status: error.response?.status
      };
      
      // Pour les erreurs de permission, ajouter un message plus explicite
      if (
        (errorCode === 'EACCES' || (errorMessage && errorMessage.includes('Permission denied'))) && 
        errorPath
      ) {
        serializedError.message = `Permission denied: Cannot create directory for scan storage`;
        serializedError.details = `The server does not have permission to create or access the directory: ${errorPath}. Please contact your system administrator.`;
      }
      
      // Pour les erreurs de timeout
      if (error.code === 'ECONNABORTED') {
        serializedError.message = "Request timed out";
        serializedError.details = "The server took too long to respond. This might be due to a large file size or server load.";
      }
      
      // Retourner une promesse rejetée avec l'erreur sérialisée
      return Promise.reject(JSON.stringify(serializedError));
    }
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
      
