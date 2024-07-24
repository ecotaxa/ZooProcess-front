// "use server"

import { string } from 'prop-types';
import axiosInstanse from '@/network/axiosInstanse';
// import Samples from '@/app/projects/[projectid]/@samples/page';
import { AuthError } from 'next-auth';
import { subSeconds } from 'date-fns';


export interface Drive {
    id:string,
    name:string,
    url:string
}

export interface Ecotaxa {
    id:string
}

export interface Project {
    id:string,
    name:string,
    drive:Drive,
    acronym: string,
    description: string,
    updatedAt: Date,
    createdAt: Date,
    driveId: string,
    ecotaxaId: string,
    ecotaxa?: Ecotaxa,
    instrumentId?: string,
    samples?: Array<Sample>,
    qc?: string
}

export interface User {
  id: string,
  name?: string,
  email?: string,
  image?: string,
  token?: string,
  role?: string
}

export interface MetadataTemplate {
  id: string
  name: string
  description: string
  // countSample: number
  // countSubSample: number 
}

export interface IMetadata {
    name: string
    value: string
    type: string
}

export interface SubSample {
  id: string
  name: string
  metadata: Array<IMetadata>
  // scan: Array<Scan>
  scan: Array<Scan>
}

export interface Scan {
  id: string
  url: string
  metadata: Array<IMetadata>
}


export interface Background {
  id: string
  name: string
  url: string
  user: User
  instrument: Instrument
  createdAt: string // Date
}

export interface Instrument {
  id: string
  model: string
  name: string
  sn: string
  calibration: {
    id: string
    xOffset: number
    yOffset: number
    xSize: number
    ySize: number
  } | undefined
}

export interface Sample {
    id: string
    name: string
    metadata: Array<IMetadata>
    subsample: Array<SubSample>
}

export interface Vignette {
  id: string
  url: string
  type: string
}

export interface Separator {
  id: string
  scanId?: string
  vignette: Array<Vignette>
}


// [
//     {
//       "id": "655d3062983b92b6e29b3369",
//       "name": "monproject",
//       "acronym": null,
//       "description": null,
//       "ecotaxaId": null,
//       "updatedAt": null,
//       "createdAt": "2023-11-21T22:34:10.972Z",
//       "driveId": "655c5b54457834999b769d06",
//       "drive": {
//         "id": "655c5b54457834999b769d06",
//         "name": "Zooscan",
//         "url": "file://drives/zooscan"
//       },
//       "ecotaxa": null
//     }
//   ]


export interface Projects {
    data:Array<Project>
}

export interface Samples {
    data:Array<Sample>
}

export interface SubSamples {
  data:Array<SubSample>
}

export interface IProcess {
  state:string,
  vignettes:Array<Vignette>,
}

// export async function getProject(id:string){

//     const response = await api.get<Project>(`/projects/${id}`);

//     console.log("getProject response: ", response);

//     return response.data; 
// }

// on se fiche de userId : il est passé avec le bearer token
// export async function addBackground(instrumentId:string, image: {url:string, userId:string}) {
export async function addBackground(image: {url:string, instrumentId:string, projectId:string}) {
  
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
        return response.data;
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


// export async function addScan(image: {url:string, instrumentId:string, projectid:string, subsampleid:string}) {
export async function addScan(image: {url:string, instrumentId:string, projectId:string, subsampleId:string}) {
  
  console.log("addScan:", image)
  const api = await axiosInstanse({})

  const data = {
    url: image.url,
    // subSampleId:image.subsampleId
  }

  // return await api.post(`/scan/${image.instrumentId}/url`, data )
  // const url = `/scan/${image.instrumentId}/url` // ?projectId=${image.projectId}`
  const url = `/scan/${image.subsampleId}/url` // ?projectId=${image.projectId}`
  console.log("addBackground url:", url)
  console.log("addBackground data:", data)
  
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


}

export async function addScanOld(image: {url:string, instrumentId:string, subsampleid:string}) {
  
  console.log("addScan:", image)
  const api = await axiosInstanse({})

  const data = {
    url: image.url
  }

  return await api.post(`/scan/${image.instrumentId}/url`, data )
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
            throw(msg)
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
        throw(error);
      });


}

export async function getScan(url:string) {
  console.log("getScan");
  const api = await axiosInstanse({})

  const response = await api.get<Background>(url)
    return response.data;
}

export async function getBackgrounds(url:string){
  console.log("getBackgrounds");
  const api = await axiosInstanse({})

  const response = await api.get<Array<Background>>(url)
  // .then(function (response) {
    // console.log("getBackgrounds response: ", response);
    return response.data;
  // })
  // .catch((error) => {
  //   console.log("getBackgrounds Error: ", error.toJSON());
  //   // if (error.response) {
      // if
}

// export async function getBackgrounds(url:string){
//   console.log("getBackgrounds");
//   const api = await axiosInstanse({})

//   const response = await api.get<Array<Background>>(url)
//   // .then(function (response) {
//     // console.log("getBackgrounds response: ", response);
//     return response.data;
//   // })
//   // .catch((error) => {
//   //   console.log("getBackgrounds Error: ", error.toJSON());
//   //   // if (error.response) {
//       // if
// }

// export async function getProjects(page: number){
export async function getProjects(){

    console.log("getProjects");

    const api = await axiosInstanse({})
    // const pageSize = 12;
    // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
    const response = await  api.get<Projects>(`/projects`);

    console.log("getProjects response: ", response);

    return response.data; 
}

export async function getProcess(url:string){
  const api = await axiosInstanse({})
  const response = await api.get<IProcess>(url);
  console.log("getProcess response: ", response);
  return response.data;
}

export async function getProject(url:string){
  const api = await axiosInstanse({})

  const response = await api.get<Project>(url);

  console.log("getProject response: ", response);

  return response.data; 
}


export async function getUserMe(url:string){
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
  
    const response = await api.get<User>(url);
  
    console.log("getUserMe response: ", response);
  
    return response.data; 
  }

  
export async function getUserByEmail(url:string){
  const api = await axiosInstanse({})

  const response = await api.get<User>(url);

  console.log("getUserByEmail response: ", response);

  return response.data; 
}

// import axios from 'axios';
// import { auth } from '@/auth';
// import { da } from 'date-fns/locale';

export async function getUserById(url:string, token:string){
// export async function getUserById(url:string){

//   const token = await auth();
  console.log("getUserById token: ", token);

//   const api = axios.create({
//     baseURL: "http://zooprocess.imev-mer.fr:8081/v1",
//     timeout: 5000,
//     headers:{
//       Authorization: 'Bearer ' + token
//     }
// });
  // const token = await auth()
  const api = await axiosInstanse({useAuth:false, token})

  const response = await api.get<User>(url);

  console.log("getUserByEmail response: ", response);

  return response.data; 
}


export interface Login {
  email:string,
  password:string
}

var token = ""

export async function login(data:Login){
  // const useAuth = false
  const api = await axiosInstanse({useAuth:false})
  return await api.post('/login', data)
      .then(function (response) {
        console.log("login response: ", response);
        token = response.data
        return response.data;
      })
      .catch(function (error) {
        console.log(`Login by ${data.email} with error: ${error}`)
        throw new AuthError({errorOptions:{type:"CredentialsSignin"}})
      })
}

export async function getMetadata(url:string){
  const api = await axiosInstanse({})

  const response = await api.get<MetadataTemplate>(url);

  console.log("getMetadata response: ", response);

  return response.data; 
}



// export async function getProjectMetadata(url:string){

//   const response = await api.get<Project>(url);

//   console.log("getProject response: ", response);

//   return response.data; 
// }

export async function addProject(data:Project){

    console.log("POST /projects")
    console.log(data)

    const api = await axiosInstanse({})
    return await api.post('/projects', data)
      .then(function (response) {
        console.log("addProject response: ",response);
        return response.data;
      })
      .catch(function (error) {
        console.log("addProject Error: ", error.toJSON());
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

  
  export async function updateProject(data:Project){

    if (data.id == undefined) throw("Cannot update, project has no id defined");

    const api = await axiosInstanse({})
    return await api.put(`/projects/${data.id}`, data)
      .then(function (response) {
        console.log("updateProject response:", response);
        return response.data;
      })
      .catch(function (error) {
        console.log("updateProject error:", error.toJSON());
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

  export async function getDrives(){
    const api = await axiosInstanse({})
    const response = await api.get<Array<Drive>>(`/drives`);
    
    // console.log("getDrives response: ", response);

    return response.data; 
  }



export async function getInstruments(){
  const api = await axiosInstanse({})
  const response = await api.get<Array<Instrument>>(`/instruments`);
  
  console.debug("getInstruments response: ", response);

  return response.data; 
}

export async function getInstrument(url:string){
  const api = await axiosInstanse({})
  const response = await api.get<Instrument>(url);
  
  console.debug("getInstrument response: ", response);

  return response.data; 
}

export async function addSample(projectId:string, data:Sample){

    console.log("api addSmaple projectId:", projectId);
    console.log("api addSmaple data:", data);

    const api = await axiosInstanse({})
    return await api.post(`/projects/${projectId}/samples`, data)
      .then(function (response) {
        console.log("addSample response: ", response);
        return response.data;
      })
      .catch((error) => {
        console.log("addSample Error: ", error.toJSON());
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


  export async function updateSubSample(projectId:string, sampleId:string, subSampleId:string, data:Samples){

    console.log("api updateSubSample projectId:", projectId);
    console.log("api updateSubSample sampleId:", sampleId);
    console.log("api updateSubSample subSampleId:", subSampleId);
    console.log("api updateSubSample data:", data);
  
    const api = await axiosInstanse({})
    return await api.patch(`/projects/${projectId}/samples/${sampleId}/subsamples/${subSampleId}`, data)
        .then(function (response) {
          console.log("updateSample response:", response);
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

  export async function addSubSample(projectId:string, sampleId: string, data:Sample){

    console.log("api addSubSmaple projectId:", projectId);
    console.log("api addSubSmaple sampleId:", sampleId);
    console.log("api addSubSample data:", data);

    const api = await axiosInstanse({})
    return await api.post(`/projects/${projectId}/samples/${sampleId}/subsamples`, data)
      .then(function (response) {
        console.log("addSubSample response: ", response);
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

  // export async function getSamples(projectId:string){
  export async function getSamples(url:string){

    // console.log("getSamples(",projectId,")")
    console.log("getSamples(",url,")")

    // throw (projectId)

    // const pageSize = 12;
    // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
    // const response = await api.get<Samples>(`/projects/${projectId}/samples`);
    const api = await axiosInstanse({})
    const response = await api.get<Samples>(url);

    console.log("getSamples response: ", response);

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
  const response = await api.get<SubSamples>(url);

  console.log("getSubSamples response: ", response);

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
  const response = await api.get<SubSample>(url);

  console.log("getSubSample response: ", response);

  return response.data; 
}

export async function getSample(url:string, options?: any){

  console.log("getSample(",url,",",options,")")

  const api = await axiosInstanse({})
  const response = await api.get<Sample>(url, options);

  console.log("getSample response: ", response);

  return response.data; 
}


export async function updateSample(projectId:string, sampleId:string, data:Samples){

  console.log("api updateSample projectId:", projectId);
  console.log("api updateSample sampleId:", sampleId);
  console.log("api updateSample data:", data);

  const api = await axiosInstanse({})
  return await api.put(`/projects/${projectId}/samples/${sampleId}`, data)
      .then(function (response) {
        console.log("updateSample response:", response);
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

  const response = await api.get<Separator>(url)
  console.debug("getVignettes return ", response)
  return response//.data;

}


export enum TaskType {
  separate = "separate",
  background = "background",
  vignette = "vignette",
  process = "process",
}

// export async function addTask(subsampleid:string, task:TaskType ){
export async function addTask(data:any){

  console.log("api - addTask(data:", data);
  const api = await axiosInstanse({})
  // const data = {
  //   "subsample_id": subsampleid,
  //   "type": task
  // }
  // const taskId = await api.post(`/separate`, data)
  // const taskId = 
  return await api.post(`/task`, data)
  .then((response) => {
    console.log("addTask response: ", response);
    return response.data;
  })
  .catch((error) => {
    console.log("addTask Error: ", error.toJSON());
    // return undefined
    throw(error);
  })
  // return taskId  
}

export async function runTask(taskId:string){

  console.log("runTask(",taskId,")")
  const api = await axiosInstanse({})
  // api.post(`/separate/${taskId}/run`, {})
  const data = { taskId }

  // l'api lance la tache ou pas
  // et l'indique en retour

  return await api.post(`/task/${taskId}/run`, data )

  // return Promise.resolve(`task ${taskId} is running`)
}

