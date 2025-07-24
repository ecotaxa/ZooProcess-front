import axiosInstance from '@/network/axiosInstance';
import * as I from './interfaces';
import { time } from 'console';

// on se fiche de userId : il est passé avec le bearer token
// export async function addBackground(instrumentId:string, image: {url:string, userId:string}) {
/**
 * add a background scan to the DB
 * @param image
 * @param type // by default MEDIUM_BACKGROUND will be set by the API
 * @returns Background object
 */
export async function addBackground(image: I.IScan, type?: String): Promise<I.Background> {
  console.log('addBackground:', image);

  const api = await axiosInstance({
    params: {
      timeout: 20000,
    },
  });

  let data: any = {
    url: image.url,
    projectId: image.projectId,
  };

  if (type) {
    data.type = type;
  }

  const url = `/background/${image.instrumentId}/url?projectId=${image.projectId}`;
  console.log('addBackground url:', url);
  console.log('addBackground data:', data);

  return await api
    .post(url, data)
    .then(function (response) {
      console.log('addBackground response: ', response);
      return response.data; // here return Scan object
    })
    .catch(error => {
      console.log('addBackground Error: ', error.toJSON());
      if (error.response) {
        if (error.response.status == '409') {
          console.log('Duplicate value');
          // const msg = {
          // //error:{
          //     message: error.response.data || "Duplicate value"
          // //}
          // }
          // // throw(msg)
          // return Promise.reject(new Error(msg.message))
          // throw {
          //     message: error.response.data || "Duplicate value",
          //     status: 409
          // };
          return {
            error: {
              message: error.response.data || 'Duplicate value',
              status: 409,
            },
          };
        }

        // Manage error about drive access issues
        if (error.response.data && error.response.data.error) {
          console.log('addBackground data.error: ', error.response.data.error);
          const errorData = error.response.data.error;
          // const serializedError = {
          //     type: 'DriveAccessError',
          //     message: errorData.message || "Drive access error",
          //     name: errorData.name || "DriveAccessError",
          //     url: errorData.url || "",
          //     status: error.response.status
          // }

          // console.debug("err:",serializedError)
          // // throw (err)
          // // need to serialize the error else Next.js to it itself but i lose all the data:
          // // it remove it for security reason
          // // throw Error(JSON.stringify(serializedError));
          // const stringified = JSON.stringify(serializedError)
          // // throw stringified
          // throw { message:stringified }

          return {
            error: {
              type: 'DriveAccessError',
              message: errorData.message || 'Drive access error',
              name: errorData.name || 'Error',
              url: errorData.url || '',
              status: error.response.status,
            },
          };
        }

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('error.response.data', error.response.data);
        console.log('error.response.status:', error.response.status);
        console.log('error.response.headers', error.response.headers);
        // return Promise.reject(error.response)
        // throw {
        //     message: error.response.data?.message || "API error",
        //     status: error.response.status
        // };
        return {
          error: {
            message: error.response.data?.message || 'API error',
            status: error.response.status,
          },
        };
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('error.request:', error.request);
        // throw {
        //     message: "No response received from server",
        //     status: 0
        // };
        return {
          error: {
            message: 'No response received from server',
            status: 0,
          },
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        // }
        // console.log(error.config);
        // throw(error);
        // return Promise.reject(new Error(error.message))
        // throw {
        //     message: error.message || "Failed to add background",
        //     status: 500
        // };
        return {
          error: {
            message: error.message || 'Failed to add background',
            status: 500,
          },
        };
      }
    }); // catch
}

export async function getBackgrounds(url: string) {
  console.log('getBackgrounds');
  const api = await axiosInstance({});

  const response = await api.get<Array<I.Background>>(url);
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
  console.debug('getBackgroundTaskStatus()');
  try {
    const api = await axiosInstance({});
    const response = await api.get<string>(`/background/task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error - getBackgroundTaskStatus()', error);
    throw error;
  }
}
