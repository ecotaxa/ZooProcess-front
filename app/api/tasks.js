import useSWR from 'swr';

import * as api from '@/app/api/network/zooprocess-api';
import { run } from 'node:test';
// import { ca, ta } from "date-fns/locale"

export async function addSeparateTask(params) {
  const data = {
    exec: api.TaskType.separate,
    params: params.params,
    // log: params.log
  };

  console.log('addSeparateTask() | data :', data);

  return api
    .addTask(data)
    .then(async response => {
      console.log('api.addTask(data) -> response :', response);
      // if ( response.status == 200 ){
      // console.log("api.addTask(data) -> taskId :", response.data.id)
      console.log('api.addTask(data) -> taskId   :', response.id);
      // return

      // return new Promise( (resolve,reject) => {
      //     console.log("resend: ", response.data.id)
      //     resolve( response.data.id ) });

      // return    Promise().resolve(response.data.id)

      // } else {
      //     console.log("api.addTask(data) -> Error: ", response)
      //     throw Error(response)
      // }
      // })
      // .then((taskId) => {
      // console.log("then(taskId) :", taskId)
      // return api.runTask(taskId)

      return await api.runTask(response.id);
    })
    .catch(error => {
      throw Error(`Cannot run task separate`); // (id:${taskId})`)
    });
}

export async function addProcessTask(params) {
  const data = {
    exec: api.TaskType.process,
    params: params.params,
  };

  try {
    const response = await api.addTask(data);
    console.log('api.addTask(data) -> response :', response);

    // try {
    //     await api.runTask(response.id);
    return response.id; // Return the task ID even if runTask fails
    // } catch (error) {
    //     console.log("RunTask error details:", error.response?.data);
    //     return response.id;  // Still return the task ID
    // }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create task');
  }
}

/**
 * Add & launch a background task
 * @param {*} params
 * @returns
 */
export async function addBackgroundTask(params) {
  console.log('**************addBackgroundTask()**************');
  console.log('addBackgroundTask() | params :', params);
  console.trace('-=-=-=-=-=-=-=-=-=-=-');

  const data = {
    exec: api.TaskType.background,
    params: params.params,
  };

  try {
    const task = await api.addTask(data);
    console.log('api.addTask(data) -> response :', task);

    // try {
    //     await api.runTask(task.id);
    return task.id;

    // } catch(error) {
    //     console.log("RunTask error details:", error.response?.data);
    //     return task.id;  // Still return the task ID
    // }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create task');
  }
}

export async function runTask(taskId) {
  console.log('runTask(taskId) -> taskId :', taskId);
  try {
    const response = await api.runTask(taskId);
    console.log('api.runTask(taskId) -> response :', response);
    return response;
  } catch (error) {
    console.log('runTask error:', error);
    // throw error;
    throw new Error(`Failed to run task with ID ${taskId}`);
  }
}
