"use server";


import { Background } from '../network/interfaces';
import { getBackgrounds } from '../network/background';
import { apiAuthPrefix } from '@/routes';

// import * as zooapi from '@/app/api/network/zooprocess-api' 

// A scan is a background ;) with organisms in it
export async function getScans(projectid:string): Promise<Array<Background>> {
    try {
      // const project = await api.getProject(projectid);
      const backgrounds = await getBackgrounds(`/projects/${projectid}/scans`)
      return backgrounds;
    } catch (error) {
      console.error("Error - getScans()", error);
      throw error;
    }
  }


import axiosInstanse from '@/network/axiosInstanse';
  
// export async function linkScanToSubsample(scanId: string, subsampleId: string): Promise<void> {
//   const api = await axiosInstanse({});
//   const url = '/link'
//   const body = {
//     scanId: scanId,
//     subsampleId: subsampleId
//   }
//   console.debug("url: ", url);
//   console.debug("body: ", body);
//   return api.post(url , body)
//   .then(function (response) {
//     console.log("linkScanToSubsample response: ", response);
//     return response.data;
//   })
//   .catch((error:any) => {
//     console.log("linkScanToSubsample Error: ", error.toJSON());
//     if (error.response) {
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       console.log(error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.log('Error', error.message);
//     }
//     console.log(error.config);
//     return Promise.reject(error.message)
//   });

//   }

export async function linkScanToSubsample(projectId: string, sampleId: string, subsampleId: string, scanId: string): Promise<void> {
  const api = await axiosInstanse({});
  const url = `/projects/${projectId}/samples/${sampleId}/subsamples/${subsampleId}/link`;
  const body = {
    scanId: scanId,
  };

  console.debug("url: ", url);
  console.debug("body: ", body);

  try {
    const response = await api.post(url, body);
    console.log("linkScanToSubsample response: ", response);
    return response.data;
  } catch (error: any) {
    console.error("linkScanToSubsample Error: ", error);

    // Si l'erreur vient de l'API avec un message structuré
    if (error.response && error.response.data) {
      const errorData = error.response.data;

      // Remonter l'erreur avec les détails
      throw {
        message: errorData.message || "Server error",
        details: errorData.details || null,
        code: errorData.code || error.response.status,
        path: errorData.path || null
      };
    }

    // Erreur de timeout ou de réseau
    if (error.code === 'ECONNABORTED') {
      throw {
        message: "Request timed out",
        details: "The server took too long to respond. This might be due to a large file size or server load.",
        code: "TIMEOUT"
      };
    }

    // Autres erreurs
    throw {
      message: error.message || "An unknown error occurred",
      code: error.code || "UNKNOWN"
    };
  }
}
