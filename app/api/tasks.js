import useSWR from "swr"

import * as api from '@/app/api/network/zooprocess-api' 
import { ta } from "date-fns/locale"



export async function addSeparateTask(params) {
    
    const data = {
        exec: api.TaskType.separate,
        params: params.params,
        // log: params.log
    }

    console.log("addSeparateTask() | data :", data)

    // // const taskId = 
    // return await api.addTask(data)
    // .then((response) => {
    //     if ( response.status == 200 ){
    //         console.log("addTask() -> response :", response)
    //         const taskId = response.data.id
    //         console.log("addTask() -> taskId :", taskId)
        
    //         // Running the task, don't wait
    //         api.runTask(taskId)
    //         .then((response) => {
    //             if ( response.status == 200 ){
    //                 console.log("runTask() -> taskId :", response)
    //                 //TODO changer le status de la task en running fait dans l'API
    //                 return Promise().resolve(response.data.id)
    //             }
    //         })
    //         .catch(( error) => {
    //             //TODO changer le status de la task en error 
    //             console.log("Error addSeparateTask() addTask runTask: ", error)
    //             throw Error("Cannot run task separate")
    //             // return undefined
    //         })

    //         return taskId
    //     }
    //     throw Error(response.status)
    //     // return undefined
    // })
    // .catch ((error) => {
    //     console.log("addSeparateTask() addTask Error: ", error)
    //     throw Error("Cannot add task")
    //     // return undefined
    // })
    // //return undefined
    // // console.log("addSeparateTask() -> taskId :", taskId)
    // // return taskId

    return await api.addTask(data)
    .then((response) => { 
        console.log("api.addTask(data) -> response :", response)
        // if ( response.status == 200 ){
            // console.log("api.addTask(data) -> taskId :", response.data.id)
            console.log("api.addTask(data) -> taskId   :", response.id)
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

        return api.runTask(response.id)
    })
    .catch((error) => {
        throw Error(`Cannot run task separate`);// (id:${taskId})`)
    })

}



export async function addProcessTask(params) {
    
    const data = {
        exec: api.TaskType.process,
        params: params.params,
        // log: params.log
    }

    console.log("addProcessTask() | data :", data)

    return await api.addTask(data)
    .then((response) => { 
        console.log("api.addTask(data) -> response :", response)
        console.log("api.addTask(data) -> taskId   :", response.id)

        return api.runTask(response.id)
    })
    .catch((error) => {
        throw Error(`Cannot run task process`);
    })

}

