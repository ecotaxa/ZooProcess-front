"use server";

import useSWR from 'swr'

import * as api from '@/app/api/network/zooprocess-api' 








export async function addSubSample({projectId, sampleId, data}){
  
    console.log("adding SubSample...projectId: ", projectId, ", sampleId: ", sampleId);
    // console.log("adding Sample...projectId: ", params.projectId);
    // console.log("params: ", params);
    console.log("adding SubSample...data: ", data);
  
    // TODO added info box
  
    return api.addSubSample(projectId, sampleId, data)
    .then((response) => {
      console.log("SubSample added OK");
      return Promise.resolve( { data:response, message:"SubSample have been added"})
    })
    .catch ((error) =>  {
      console.error("SubSample added NOK: ", error);
      console.log("projectid: ", projectId);
      console.log("sampleid: ", sampleId);
      console.log("data:", data);
      // throw ({
      //   message:"Cannot add sample",
      //   error,
      //   data,
      //   projectId,
      // })
      throw (error.message)
    })
  
  }

  export async function updateSubSample({projectId, sampleId, subSampleId, data}){
  
    console.log("update SubSample...projectId: ", projectId, ", sampleId: ", sampleId);
 
    console.log("update SubSample...data: ", data);
  
  

    return api.updateSubSample(projectId, sampleId, subSampleId, data)
    .then((response) => {
      console.log("SubSample added OK");
      return Promise.resolve( { data:response, message:"SubSample have been updated"})
    })
    .catch ((error) =>  {
      console.error("SubSample added NOK: ", error);
      console.log("projectid: ", projectId);
      console.log("sampleid: ", sampleId);
      console.log("data:", data);
 
      throw (error.message)
    })
  
  }

