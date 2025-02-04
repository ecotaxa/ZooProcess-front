"use server";


import { Background } from '../network/interfaces';

// import * as api from '@/app/api/network/zooprocess-api' 
import { getBackgrounds } from '../network/background';


export async function getProjectBackgrounds(projectid:string): Promise<Array<Background>> {
    try {
      // const project = await api.getProject(projectid);
      // const backgrounds = await api.getBackgrounds(`/projects/${projectid}/backgrounds`)
      const backgrounds = await getBackgrounds(`/projects/${projectid}/backgrounds`)
      return backgrounds;
    } catch (error) {
      console.error("Error - getProjectBackgrounds()", error);
      throw error;
    }
  }
  


  export async function getBackgroundTaskStatus(taskId: string): Promise<string> {
    try {
      const status = await getBackgroundTaskStatus(taskId);
      return status;
    } catch (error) {
      console.error("Error - getBackgroundTaskStatus()", error);
      throw error;
    }
  }