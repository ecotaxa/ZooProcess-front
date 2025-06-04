"use server";


import { Sample, Samples } from '../network/interfaces';

import * as api from '@/app/api/network/zooprocess-api'


export async function getSamples(projectid:string): Promise<Samples> {
  try {
    // const project = await api.getProject(projectid);
    // const samples = await api.getSamples(`/projects/${projectid}/samples`)
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER
    const fullUrl = `${baseURL}/projects/${projectid}/samples`
    const samples = await api.getSamples(fullUrl)
    return samples;
  } catch (error) {
    console.error("Error - getSamples()", error);
    throw error;
  }
}

export async function getSample(projectid:string, sampleid:string) : Promise<Sample>{

  try {
    // const sample = await api.getSample(`/projects/${projectid}/samples/${sampleid}`)
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER
    const fullUrl = `${baseURL}/projects/${projectid}/samples/${sampleid}`
    const sample = await api.getSample(fullUrl)

    return sample;
  } catch (error) {
    console.error("Error - getSample()", error);
    throw error;
  }
}

