"use server";

import { Drive } from '../network/interfaces';
import * as api from '@/app/api/network/zooprocess-api' 


export async function getDrives(): Promise<Array<Drive>> {
    try {
      // const project = await api.getProject(projectid);
      const drives = await api.getDrives() //'/drives/')
      return drives;
    } catch (error) {
      console.error("Error - getDrives()", error);
      throw error;
    }
  }
  

