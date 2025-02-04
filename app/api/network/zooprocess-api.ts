// "use server"
'use strict';



import { string } from 'prop-types';
import axiosInstanse from '@/network/axiosInstanse';
// import Samples from '@/app/projects/[projectid]/@samples/page';
import { AuthError } from 'next-auth';

// import { headers } from 'next/headers';
// import { subSeconds } from 'date-fns';
import * as I from './interfaces'
// import { ca } from 'date-fns/locale';



  





export async function getProjects() : Promise<I.Projects> {

    console.debug("getProjects");

    const api = await axiosInstanse({})
    // const pageSize = 12;
    // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
    const response = await  api.get<I.Projects>(`/projects`);

    console.debug("getProjects response: ", response.status);

    return response.data; 
}


export async function getProject_old(url: string): Promise<I.Project> {
  // const headersList = headers()
  // const token = headersList.get('authorization')

  // const params = token ? { token } : {}
  const params = {}
  const api = await axiosInstanse(params)

  const response = await api.get<I.Project>(url)
  
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Failed to fetch project: ${response.statusText}`)
  }
}


// export async getProject(projectId: string) {
//   try {
//       const response = await axios.get(`${this.baseUrl}/project/${projectId}`);
//       return response.data;
//   } catch (error) {
//       console.error('Project fetch error:', {
//           projectId,
//           error: error.response?.data || error.message,
//           status: error.response?.status
//       });
//       throw error;
//   }
// }


export async function getProject(projectId: string) {  
  console.log('Requesting project:', projectId)
  console.log('Full URL:', `/projects/${projectId}`)
  try {
      const params = {}
      const axios = await axiosInstanse(params)
      const baseURL = "http://zooprocess.imev-mer.fr:8081/v1"

      // const response = await axios.get(`${baseURL}/project/${projectId}`);
        const fullUrl = `${baseURL}/projects/${projectId}`
        
        console.log('Making request to:', fullUrl)
        const response = await axios.get(fullUrl)
        console.log('Response received:', response.status)

      return response.data;
  } catch (error: any) {
      console.error('Project fetch error:', {
          projectId,
          error: error.response?.data || error.message,
          status: error.response?.status
      });
      throw error;
  }
}



export async function deleteProject(url: string): Promise<void> {
  const params = {}
  const api = await axiosInstanse(params)
  const response = await api.delete(url)

  if (response.status === 200) {
    console.debug("deleteProject response: ", response.status)
    return response.data
  } else {
    throw new Error(`Failed to delete project : ${response.statusText}`)
  }
}

export async function getProcess(url:string) : Promise<I.IProcess> {
  const api = await axiosInstanse({})
  const response = await api.get<I.IProcess>(url);
  console.debug("getProcess response: ", response);
  return response.data;
}

export async function getUserMe(url:string=`/users/me`){
  // export async function getUserById(url:string){
  
  //   const token = await auth();
    console.log("getUserMe token: ");
  
  //   const api = axios.create({
  //     baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
  //     timeout: 5000,
  //     headers:{
  //       Authorization: 'Bearer ' + token
  //     }
  // });
    // const token = await auth()
    const api = await axiosInstanse({})
  
    const response = await api.get<I.User>(url);
  
    console.log("getUserMe response: ", response.status);
  
    return response.data; 
  }

  
export async function getUserByEmail(url:string){
  const api = await axiosInstanse({})

  const response = await api.get<I.User>(url);

  console.debug("getUserByEmail response: ", response.status);

  return response.data; 
}

// import axios from 'axios';
// import { auth } from '@/auth';
// import { da } from 'date-fns/locale';
















export async function getUserByIdOld(url: string, token: string): Promise<I.User> {
  // console.debug("getUserById url: ", url);
  // console.debug("getUserById token: ", token);

  // const api = await axiosInstanse({useAuth:false, token})
  const api = await axiosInstanse({useAuth:true, token})

  // console.debug("getUserById api: ", api);

  const response = await api.get<I.User>(url).then(
    (response) => {
      // console.debug("getUserById response: ", response.status);
      return response.data;
    },
    (error) => {
      // console.error("getUserById error: ", error.toJSON());
      if (error.response) {
        console.debug(error.response.data);
        console.debug(error.response.status);
        console.debug(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error('Error', error.message);
      }
      console.log(error.config);
      throw(error);
    }
  );

  return response;
}

export async function getUserById(url: string, token: string) {

  // console.log("getUserById url: ", url);
  // console.log("getUserById token: ", token);

  // const api = await axiosInstanse({useAuth:false, token})
  const api = await axiosInstanse({useAuth:true, token})

  // console.log("getUserById api: ", api);
  const response = await api.get<I.User>(url)
  // console.log("getUserById response.status: ", response.status);
  // console.log("getUserById response.data: ", response.data);
  return response.data;



}












export async function getUserByIdWithAuth(url:string, token:string){
  // export async function getUserById(url:string){
  
  //   const token = await auth();
    // console.log("getUserByIdWithAuth token: ", token);
  
  //   const api = axios.create({
  //     baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
  //     timeout: 5000,
  //     headers:{
  //       Authorization: 'Bearer ' + token
  //     }
  // });
    // const token = await auth()
    // const api = await axiosInstanse({useAuth:false, token})
    const api = await axiosInstanse({})
  
    const response = await api.get<I.User>(url);
  
    // console.log("getUserByEmail response: ", response);
  
    return response.data; 
  }


















export async function getUsers(){
  console.log("getUsers");

  const api = await axiosInstanse({})

  const response = await api.get<I.User>(`/users`);

  console.log("getUsers response: ", response);

  return response.data; 
}



export async function updateUser(userId:string, data:I.Samples){

  console.log("api updateSample userId:", userId);
  console.log("api updateSample data:", data);

  const api = await axiosInstanse({})
  return await api.patch(`/users/${userId}`, data)
      .then(function (response) {
        console.log("updateUser response:", response.status);
        return response.data;
      })
      .catch(function (error) {
        console.error("updateUser error:", error.toJSON());
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
        console.error(error.config);
        throw(error);
      });

}

export async function createUser(data:any){


  const api = await axiosInstanse({})

  return await api.post('/users', data)
  .then(function (response) {
    console.log("createUser response:", response.status);
    return response.data;
  })
  .catch(function (error) {
    console.error("createUser error:", error.toJSON());
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    console.error(error.config);
    throw(error);
  });

}




export interface Login {
  email:string,
  password:string
}

var token = ""

export async function login(data:Login){
  // const useAuth = false
  console.log("api.login()")
  const api = await axiosInstanse({useAuth:false})
  return await api.post('/login', data)
      .then(function (response) {
        console.info(data.email,"is logged in")
        console.log("api/login response: ", response.status);
        token = response.data
        console.log("api.login() token: ", token)
        return Promise.resolve( response.data);
      })
      .catch(function (error) {
        console.log(`Login by ${data.email} with error: ${error}`)
        throw new AuthError({errorOptions:{type:"CredentialsSignin"}})
      })
}









export async function getMetadata(url:string){
  const api = await axiosInstanse({})

  const response = await api.get<I.MetadataTemplate>(url);

  console.log("getMetadata response: ", response.status);

  return response.data; 
}



// export async function getProjectMetadata(url:string){

//   const response = await api.get<Project>(url);

//   console.log("getProject response: ", response);

//   return response.data; 
// }

export async function addProject(data:I.Project){

    console.log("POST /projects")
    console.log(data)

    const api = await axiosInstanse({})
    return await api.post('/projects', data)
      .then(function (response) {
        console.log("addProject response: ",response.status);
        return response.data;
      })
      .catch(function (error) {
        console.error("addProject Error: ", error.toJSON());
        if (error.response) {

          if (error.response.status == "409"){
            const msg = {
              //error:{
                message: error.response.data || "Duplicate value"
              //}
            }
            throw(msg)
          }

          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
        console.error(error.config);
        throw(error);
      });

  }

  
  export async function updateProject(data:any){

    if (data.id == undefined) throw("Cannot update, project has no id defined");

    const api = await axiosInstanse({})
    return await api.put(`/projects/${data.id}`, data)
      .then(function (response) {
        console.log("updateProject response:", response.status);
        return response.data;
      })
      .catch(function (error) {
        console.error("updateProject error:", error.toJSON());
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
        console.error(error.config);
        throw(error);
      });

  }

  export async function getDrives(){
    const api = await axiosInstanse({})
    const response = await api.get<Array<I.Drive>>(`/drives`);
    
    // console.log("getDrives response: ", response);

    return response.data; 
  }



export async function getInstruments(){
  const api = await axiosInstanse({})
  const response = await api.get<Array<I.Instrument>>(`/instruments`);
  
  console.log("getInstruments response: ", response.status);

  return response.data; 
}

export async function getInstrument(url:string){
  const api = await axiosInstanse({})
  const response = await api.get<I.Instrument>(url);
  
  console.log("getInstrument response: ", response.status);

  return response.data; 
}


export async function addCalibration(data:any){

  console.log("api addCalibration instrumentId:", data.instrumentId);
  console.log("api addCalibration data:", data);

  const api = await axiosInstanse({})
  return await api.post(`/instruments/${data.instrumentId}/calibration`, data)
    .then(function (response) {
      console.log("addCalibration response: ", response.status);
      return response.data;
    })
    .catch((error) => {
      console.log("addCalibration Error: ", error.toJSON());
      if (error.response) {

        if (error.response.status == "409"){
          const msg = {
            //error:{
              message: error.response.data || "Duplicate value"
            //}
          }
          throw(msg)
        }

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
      console.error(error.config);
      throw(error);
    });

}

export async function updateInstrument(data:any) : Promise<I.Instrument> {
  console.log("api updateInstrument instrumentId:", data.instrumentId);
  console.log("api updateInstrument data:", data);

  console.error("updateInstrument Not implemented")
  // throw("Not implemented");
  // return (data)

  return Promise.reject("Not implemented");
}

export async function updateCalibration(data:any){
  console.log("api updateCalibration instrumentId:", data.instrumentId);
  console.log("api updateCalibration data:", data);

  const api = await axiosInstanse({})
  return await api.put(`/instruments/${data.instrumentId}/calibration/${data.id}`, data)
  .then(function (response) {
      console.log("updateCalibration response: ", response.status);
      return response.data;
    })
    .catch((error) => {
      console.error("updateCalibration Error: ", error.toJSON());
    }
  );
}

export async function addSample(projectId:string, data:I.Sample){

    console.log("api addSmaple projectId:", projectId);
    console.log("api addSmaple data:", data);

    const api = await axiosInstanse({})
    return await api.post(`/projects/${projectId}/samples`, data)
      .then(function (response) {
        console.log("addSample response: ", response.status);
        return response.data;
      })
      .catch((error) => {
        console.error("addSample Error: ", error.toJSON());
        if (error.response) {

          if (error.response.status == "409"){
            const msg = {
              //error:{
                message: error.response.data || "Duplicate value"
              //}
            }
            console.log("addSample Error msg: ", msg);
            throw(msg)
          }

          throw error.message || "Unknown error";
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
        console.error(error.config);
        throw(error);
      });

  //   try {
  //     const response = await api.post(`/projects/${projectId}/samples`, data);
  //     return response.data;
  // } catch (error:any) {
  //     console.log("API Error Details:", {
  //         status: error.response?.status,
  //         message: error.response?.data?.message,
  //         raw: error
  //     });
  //     // throw error.response?.data?.message || error.message;
  //     // const errorMessage = error.response?.data || error.message;
  //     // throw errorMessage;
  //             // Create a plain string error
  //         //     const message = typeof error.response?.data === 'string' ? 
  //         //     error.response.data : 
  //         //     'Failed to add sample';
  //         // throw new Error(message);

  //         // throw error.response.data;
  //         return Promise.reject(error.response.data);
  // }

  }



  export async function updateSubSample(projectId:string, sampleId:string, subSampleId:string, data:I.Samples){

    console.log("api updateSubSample projectId:", projectId);
    console.log("api updateSubSample sampleId:", sampleId);
    console.log("api updateSubSample subSampleId:", subSampleId);
    console.log("api updateSubSample data:", data);
  
    const api = await axiosInstanse({})
    return await api.patch(`/projects/${projectId}/samples/${sampleId}/subsamples/${subSampleId}`, data)
        .then(function (response) {

          console.log("updateSample response:", response.status);
          return response.data;
        })
        .catch(function (error) {
          console.log("updateSample error:", error.toJSON());
          if (error.response) {
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
          throw(error);
        });
  
  }


  export async function addSubSample(projectId:string, sampleId: string, data:I.Sample){

    console.log("api addSubSmaple projectId:", projectId);
    console.log("api addSubSmaple sampleId:", sampleId);
    console.log("api addSubSample data:", data);

    const api = await axiosInstanse({})
    return await api.post(`/projects/${projectId}/samples/${sampleId}/subsamples`, data)
      .then(function (response) {
        console.log("addSubSample response: ", response.status);
        return response.data;
      })
      .catch((error) => {
        console.log("addSubSample Error: ", error.toJSON());
        if (error.response) {

          if (error.response.status == "409"){
            const msg = {
              //error:{
                message: error.response.data || "Duplicate value"
              //}
            }
            throw(msg)
          }

          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
        console.error(error.config);
        throw(error);
      });

  }

  // export async function getSamples(projectId:string){
  export async function getSamples(url:string) : Promise<I.Samples> {

    // console.log("getSamples(",projectId,")")
    console.log("getSamples(",url,")")

    // throw (projectId)

    // const pageSize = 12;
    // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
    // const response = await api.get<Samples>(`/projects/${projectId}/samples`);
    const api = await axiosInstanse({})
    const response = await api.get<I.Samples>(url);

    console.log("getSamples response: ", response.status);

    return response.data; 
}

export async function getSubSamples(url:string){

  // console.log("getSamples(",projectId,")")
  console.log("getSubSamples(",url,")")

  // throw (projectId)

  // const pageSize = 12;
  // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
  // const response = await api.get<Samples>(`/projects/${projectId}/samples`);
  const api = await axiosInstanse({})
  const response = await api.get<I.SubSamples>(url);

  console.log("getSubSamples response: ", response.status);

  return response.data; 
}

export async function getSubSample(url:string){

  // console.log("getSamples(",projectId,")")
  console.log("getSubSample(",url,")")

  // throw (projectId)

  // const pageSize = 12;
  // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
  // const response = await api.get<Samples>(`/projects/${projectId}/samples`);
  const api = await axiosInstanse({})
  const response = await api.get<I.SubSample>(url);

  console.log("getSubSample response: ", response.status);

  return response.data; 
}

// export async function getSubSample(url:string){

//   // console.log("getSamples(",projectId,")")
//   console.log("getSubSample(",url,")")

//   // throw (projectId)

//   // const pageSize = 12;
//   // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
//   // const response = await api.get<Samples>(`/projects/${projectId}/samples`);
//   const api = await axiosInstanse({})
//   const response = await api.get<SubSample>(url);

//   console.log("getSubSample response: ", response);

//   return response.data; 
// }

export async function getSample(url:string, options?: any){

  console.log("getSample(",url,",",options,")")

  const api = await axiosInstanse({})
  const response = await api.get<I.Sample>(url, options);

  console.log("getSample response: ", response.status);

  return response.data; 
}


export async function updateSample(projectId:string, sampleId:string, data:I.Samples){

  console.log("api updateSample projectId:", projectId);
  console.log("api updateSample sampleId:", sampleId);
  console.log("api updateSample data:", data);

  const api = await axiosInstanse({})
  return api.put(`/projects/${projectId}/samples/${sampleId}`, data)
      .then(function (response) {
        console.log("updateSample response:", response.status);
        return response.data;
      })
      .catch(function (error) {
        console.error("updateSample error:", error.toJSON());
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
        console.error(error.config);
        throw(error);
      });

}



export async function getVignettes(url:string){
  console.log("getVignettes(", url, ")")
  const api = await axiosInstanse({})
  // const response = await api.get<Separator>(url);
  // console.log("getVignettes response: ", response);
  // return response.data;

  // return await api.get<Separator>(url)
  // .then(function (response) {
  //   console.log("getVignettes response: ", response);
  //   return response.data;
  // })
  // .catch(function (error) {
  //   console.log("getVignettes error:", error.toJSON());
  //   return error
  //   // throw(error);
  // })

  const response = await api.get<I.Separator>(url)
  console.log("getVignettes return ", response.status)
  return response//.data;

}


export enum TaskType {
  separate = "separate",
  background = "background",
  vignette = "vignette",
  process = "process",
}

// export async function addTask(subsampleid:string, task:TaskType ){

export async function getTaskFromParams(type:TaskType, params:any){
  console.log("getTaskFromParams(params:", params);
  const api = await axiosInstanse({})
  // const stringifiedparams = JSON.stringify(params)
  return api.post(`/task/exists/`, {type, params})
  .then((response) => {
    console.log("getTaskFromParams response: ", response.status, response.statusText);
    return response.data;
  })
  .catch((error) => {
    console.log("getTaskFromParams Error: ", error.toJSON());
    // return undefined
    throw(Error("Some error to retrieved if task exists"));
  })
}

export async function addTask(data:any){

  console.log("api - addTask(data:", data);
  const api = await axiosInstanse({})
  // const data = {
  //   "subsample_id": subsampleid,
  //   "type": task
  // }
  // const taskId = await api.post(`/separate`, data)
  // const taskId = 
  return api.post(`/task`, data)
  .then((response) => {
    console.log("addTask response: ", response.status);
    console.debug("addTask response.data: ", response.data);
    return response.data;
  })
  .catch((error) => {
    console.log("addTask Error: ", error.toJSON());
    // return undefined
    throw(error);
  })
  // return taskId  
}


export async function runTask(taskId: string) {
  console.log("putain runTask(", taskId, ")");

  const api = await axiosInstanse({});
  console.log("runTask() api:", api);
  const data = { taskId };

  console.log("runTask() data:", data);
  try {
    const response = await api.post(`/task/${taskId}/run`, data);

    console.log("runTask() response: ", response.status); // 6744393666cc7d7710944c4b

    // Vérifiez si la tâche est bien lancée (en fonction de ce que retourne votre serveur)
    if (response.status == 200){ // && response.data?.success) {
      console.log("runTask(): Task run successfully:", JSON.stringify(response.data));
      return response.data; // Renvoie les données de succès
    } else {
      throw new Error(
        `Task failed to start. Server response: ${JSON.stringify(response.data)}`
      );
    }
  } catch (error: any) {
    console.error("runTask() Error: ", error.toJSON?.() || error.message);

    // Lever une erreur pour signaler un échec au frontend
    throw new Error(
      error.response?.data?.error?.message || "Failed to start task"
    );
  }
  console.log("je me casse de runTask()")
}


export  async function getTask(url:string){
  console.log("getTask(", url,")")
  const api = await axiosInstanse({})
  const response = await  api.get<I.ITask>(url)

    console.debug("getTask response: ", response.status);

    return response.data;
}

