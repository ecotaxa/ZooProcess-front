import { ITask } from "../network/interfaces";
import { TaskType } from "../network/zooprocess-api";
import * as api from '@/app/api/network/zooprocess-api' 

export async function getTask(taskid:string): Promise<ITask> {

  if (taskid === undefined) {
    throw new Error("taskid is undefined --------------------------");
  }

    console.debug("getTask taskid: ", taskid);
    try {
      // const project = await api.getProject(projectid);
      const task = await api.getTask(`/task/${taskid}`)
      return task;
    } catch (error) {
      console.error("Error - getTask()", error);
      throw error;
    }
  }
