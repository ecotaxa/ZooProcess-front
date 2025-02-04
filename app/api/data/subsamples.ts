"use server";


import {  SubSample, SubSamples } from '../network/interfaces';

import * as api from '@/app/api/network/zooprocess-api' 


export async function getSubSamples(projectid:string, sampleid:string): Promise<SubSamples> {
  try {
    const subSamples = await api.getSubSamples(`/projects/${projectid}/samples/${sampleid}/subsamples`)
    return subSamples;
  } catch (error) {
    console.error("Error - getSubSamples()", error);
    throw error;
  }
}


export async function getSubSample(projectid:string, sampleid:string, subsampleid:string): Promise<SubSample> {
    try {
      const url = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}`
      console.debug("getSubSample url:", url)
      const subSample = await api.getSubSample(url)
      console.debug("getSubSample:", subSample.id)
      return subSample;
    } catch (error) {
      console.error("Error - getSubSample()", error);
      throw error;
    }
  }



export async function addSubSample(projectid:string, sampleid:string, data:any): Promise<SubSamples> {
 
    // const [data, setData] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState(null);
    
    // useEffect(() => {
    //   fetchData();
    // }, []);
    
    // const fetchData = async () => {
    //   setIsLoading(true);
    //   try {
    //     const result = await api.getSubSample(`/projects/${projectId}/samples/${sampleId}/subsamples/${sampleId}`);
    //     setData(result);
    //   } catch (err) {
    //     setError(err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    
    // const updateData = () => {
    //   fetchData();
    // };
    
 
    try {
    // const subSamples = await api.addSubSample(`/projects/${projectid}/samples/${sampleid}/subsamples`, data)
    const subSamples = await api.addSubSample(projectid, sampleid,data)
    return subSamples;
  } catch (error) {
    console.error("Error - addSubSample()", error);
    throw error;
  }
}