import { string } from 'prop-types';
import api from './axiosInstanse';
import Samples from '@/app/projects/[projectid]/@samples/page';


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
    ecotaxa?: Ecotaxa
}


export interface Metadata {
    key: string
    value: string
    type: string
}

export interface SubSample {
  id: string
  metadata: Array<Metadata>
  scan: Array<Scan>
}

export interface Scan {
  id: string
  url: string
  metadata: Array<Metadata>
}
export interface Sample {
    id: string,
    name: string,
    metadata: Array<Metadata>
    subSamples: Array<SubSample>
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

// export async function getProject(id:string){

//     const response = await api.get<Project>(`/projects/${id}`);

//     console.log("getProject response: ", response);

//     return response.data; 
// }


// export async function getProjects(page: number){
export async function getProjects(){

    // const pageSize = 12;
    // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
    const response = await api.get<Projects>(`/projects`);

    console.log("getProjects response: ", response);

    return response.data; 
}


export async function getProject(url:string){

  const response = await api.get<Project>(url);

  console.log("getProject response: ", response);

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
    const response = await api.get<Array<Drive>>(`/drives`);
    
    // console.log("getDrives response: ", response);

    return response.data; 
}

export async function addSample(projectId:string, data:Sample){

    console.log("api addSmaple projectId:", projectId);
    console.log("api addSmaple data:", data);

    return await api.post(`/projects/${projectId}/samples`, data)
      .then(function (response) {
        console.log("addSample response: ", response);
        return response.data;
      })
      .catch((error) => {
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

  // export async function getSamples(projectId:string){
  export async function getSamples(url:string){

    // console.log("getSamples(",projectId,")")
    console.log("getSamples(",url,")")

    // throw (projectId)

    // const pageSize = 12;
    // const response = await api.get<Projects>(`/projects?limit=${pageSize}&offset=${pageSize * (page - 1)}`);
    // const response = await api.get<Samples>(`/projects/${projectId}/samples`);
    const response = await api.get<Samples>(url);

    console.log("getSamples response: ", response);

    return response.data; 
}


export async function getSample(url:string){

  console.log("getSample(",url,")")

  const response = await api.get<Sample>(url);

  console.log("getSample response: ", response);

  return response.data; 
}


export async function updateSample(projectId:string, sampleId:string, data:Samples){

  console.log("api addSmaple projectId:", projectId);
  console.log("api addSmaple sampleId:", sampleId);
  console.log("api addSmaple data:", data);

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