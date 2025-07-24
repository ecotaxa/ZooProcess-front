import { Project } from '../network/interfaces.ts';

import * as api from '@/app/api/network/zooprocess-api.ts';

export async function getProject(projectid: string): Promise<Project> {
  try {
    // const project = await api.getProject(projectid);
    // const project = await api.getProject(`/projects/${projectid}`)
    const project = await api.getProject(projectid);
    return project;
  } catch (error: any) {
    console.error('Error - getProject()', error.response);
    throw error; // Error has been updated by Axios, so now my information is in error.data

    // return (
    //   <div className="flex flex-col items-center justify-center p-4">
    //       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    //           <h2 className="text-red-800 text-lg font-semibold">Processing Error</h2>
    //           {/* <p className="text-red-600">{error.response?.data?.error || error.message}</p> */}
    //           <p className="text-red-600">{error.message || "Failed to load project"}</p>
    //           <p className="text-red-600">{error.name}</p>
    //           <p className="text-red-600">{JSON.stringify(error.stack,null,2)}</p>

    //           <p className="text-red-600">{JSON.stringify(error,null,2)}</p>

    //       </div>
    //   </div>

    // const formatedError = {
    //   message: error.message
    // }
  }
}

export async function deleteProject(projectid: string): Promise<void> {
  return api.deleteProject(`/projects/${projectid}`);
}
