"use server";


import { Project } from '../network/interfaces'

import * as api from '@/app/api/network/zooprocess-api' 


export async function getProject(projectid:string): Promise<Project> {
    try {
      // const project = await api.getProject(projectid);
      // const project = await api.getProject(`/projects/${projectid}`)
      const project = await api.getProject(projectid)
      return project;
    } catch (error) {
      console.error("Error - getProject()", error);
      throw error;
    }
  }


  export async function deleteProject(projectid:string): Promise<void> {
    return api.deleteProject(`/projects/${projectid}`);
  }
  

