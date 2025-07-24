// import useSWR from 'swr'

import * as api from '@/network/zooprocess-api';

// declare maxRetry = 1

// export async function useSamples(projectId) {

//   if ( projectId == undefined ){
//     throw "projectId == undefined"
//   }

//   const { data=[], error=false, isLoading=true } = useSWR(
//     `/projects/${projectId}/samples`,
//     api.getSamples ,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false
//   })

//   return {
//     samples: data,
//     isLoading,
//     isError: error
//   }
// }

// export async function useSample(projectId, sampleId, retry=1) {
//   // const { data=[], error=false, isLoading=true } = useSWR(`${projectid}`, api.getSamples ,

//   console.log("useSample ", projectId, sampleId, retry )

//   const url = `/projects/${projectId}/samples/${sampleId}`

//   // if (retry == globalThis.maxRetry){
//   //   params = {}
//   // } else {
//   //   params = {
//   //     revalidateIfStale: false,
//   //     revalidateOnFocus: false,
//   //     revalidateOnReconnect: false
//   //   }
//   // }

//   let headers = {}
//   if (retry == 0) {
//     headers = { headers: {
//       "Cache-Control" : "no-cache, no-store, max-age=0, must-revalidate"
//       // 'Cache-Control' : 'no-cache'
//       }
//     };
//   }

//   const { data=[], error=false, isLoading=true } = useSWR(
//     url,
//     url => api.getSample(url, headers) ,
//   //   {
//   //     revalidateIfStale: false,
//   //     revalidateOnFocus: false,
//   //     revalidateOnReconnect: false
//   // }
//   )

//   if (retry > 0) {
//     console.log("retry > 0")
//     if ( error==false && isLoading==false ){
//       console.log("no errror, no wait")
//       if (data==undefined || data==[]){
//         console.log("useSample() retrying... ", projectId, sampleId )
//         // mutate(url)
//         revalidate(url)
//         useSample(projectId, sampleId, retry-1)
//       }
//     }
//   }

//   return {
//     sample: data,
//     isLoading,
//     isError: error
//   }
// }

export async function addSample({ projectId, data }) {
  // export function addSample({params, data}){

  console.log('adding Sample...projectId: ', projectId);
  // console.log("adding Sample...projectId: ", params.projectId);
  // console.log("params: ", params);
  console.log('adding Sample...data: ', data);

  // TODO added info box

  return api
    .addSample(projectId, data)
    .then(response => {
      console.log('Sample added OK', response);
      return Promise.resolve({ data: response, message: 'Sample have been added' });
    })
    .catch(error => {
      console.error('Sample added NOK: ', error);
      console.error('projectid: ', projectId);
      console.error('data:', data);
      // throw ({
      //   message:"Cannot add sample",
      //   error,
      //   data,
      //   projectId,
      // })
      // throw (error.message)
      // throw error
      // throw(error)
      // throw new Error(error.message || error);
      // throw (error.message || error)
      // console.error("error.message: ", error.message)
      // return Promise.reject(error.message)
      // return Promise.reject({
      //   status: 'error',
      //   message: error.message || 'Failed to add sample'

      // Create error object that will persist through serialization
      //   const errorObj = {
      //     status: 'error',
      //     message: error.response?.data?.message || error.message || 'Failed to add sample'
      // };
      // throw errorObj;  // Use throw instead of Promise.reject

      return Promise.reject(error);
      // throw (error)
    });
}

export async function updateSample({ projectId, sampleId, data }) {
  console.log('update Sample...projectId: ', projectId, ' - ', sampleId);

  return api
    .updateSample(projectId, sampleId, data)
    .then(response => {
      console.log('Sample added OK');
      return Promise.resolve({ data: response, message: 'Sample updated' });
      //   // Create a serializable error object
      //   const errorObj = {
      //     status: 'error',
      //     message: typeof error === 'string' ? error : error.message || 'Failed to add sample'
      // };
      // return Promise.reject(errorObj);
    })
    .catch(error => {
      throw {
        message: 'Cannot update sample',
        error,
        data,
        projectId,
        sampleId,
      };
    });
}

// module.exports = 'useProjects'
