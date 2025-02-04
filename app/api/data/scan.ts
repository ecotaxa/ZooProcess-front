"use server";


import { Background } from '../network/interfaces';
import { getBackgrounds } from '../network/background';

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
  

