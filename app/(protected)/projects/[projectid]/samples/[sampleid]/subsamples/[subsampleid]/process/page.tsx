"use server";

import { getProject } from "@/app/api/data/projects";
// import { eState } from "../../new/[subsampleid]/state"
import { getSample } from "@/app/api/data/samples";
import { getSubSample } from "@/app/api/data/subsamples";
import { FC } from "react";
import Process from "./Process";
import { IProcessMultiple, ITask, Scan, SubSample } from "@/app/api/network/interfaces";
import { addProcessTask } from "@/app/api/tasks";
// import { arch } from "os";
// import { de, ta, th } from "date-fns/locale";
import { getTask } from "@/app/api/data/task";
// import { TaskType } from "@/app/api/network/zooprocess-api";
import * as api from '@/app/api/network/zooprocess-api' 

type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}

const ProcessNewScanPage : FC<pageProps> = async ({params}) => {

    const {projectid, sampleid, subsampleid} = params;

    

    const project = await getProject(projectid);
    const sample = await getSample(projectid, sampleid);
    const subsample = await getSubSample(projectid, sampleid, subsampleid);

    console.debug("ProcessNewScanPage subsample: ", subsample.id )

    if ( subsample.scan.length == 0 ) {
        throw Error("No scan found")
    }

    console.debug("ProcessNewScanPage subsample.scan.length: ", subsample.scan.length )

    console.debug("ProcessNewScanPage subsample.scan.type: ", subsample.scan[0].type )
    console.debug("typeof(subsample.scan id): ", typeof(subsample.scan[0].id) )
    console.debug("typeof(subsample.scan.type): ", typeof(subsample.scan[0]).type )

    const scan =  subsample.scan.find( (s:Scan) => s.type == "SCAN" &&  s.deleted == false ) // s.archived == false &&
    if ( !scan ) {
        throw Error("No SCAN found")
    }

    const scanId = scan.id;

 
    // const scan = subsample.scan[subsample.scan.length-1]
    // console.debug("Scan:",scan);
    // const scanId = scan.id;
    console.debug("ProcessNewScanPage scanId: ", scanId );

    // async function addTask(){
    //     console.debug("add Task")
    //     const data = { 
    //         params : {
    //             project:project.id,
    //             sample:sample.id,
    //             subsample:subsample.id,
    //             scanId
    //         },
    //     }
        
    //     // return addProcessTask(data)
    //     //     .then((response) => {
    //     //         console.log("addProcessTask() response: ", response)
    //     //         if ( response?.status == 200 ){
    //     //             const taskId = response.data.taskId 
    //     //             console.log('Go To the "check" page with taskId: ', taskId)
    //     //             return Promise.resolve(taskId)
    //     //         }
    
    //     //     })

    //         try {
    //             const response = await addProcessTask(data);
    //             console.log("addProcessTask() response: ", response)
    //             if ( response?.status == 200 ){
    //                 const taskId = response.data.taskId 
    //                 console.debug('Go To the "check" page with taskId: ', taskId)
    //                 return Promise.resolve(taskId)
    //             }
    //         } catch (error:any) {

    //             const errorMessage = error.response?.data?.error || "Task creation failed";
    //             console.error("addProcessTask() error: ", errorMessage)

    //             return (                    
    //                 <div className="error-container">
    //                     <h2>Processing Error</h2>
    //                     <p>{error.message}</p>
    //                     {/* <p>{errorMessage}</p> */}
    //                 </div>
    //             );
    //             //throw error;
    //             // return Promise.resolve(-1)
    //         }


    // }


    async function addTask() {
        const data = { 
            params : {
                project: project.id,
                sample: sample.id,
                subsample: subsample.id,
                scanId
            },
        }
        
        const taskId = await addProcessTask(data);
        if (!taskId) {
            throw new Error("No task ID returned");
        }

        try {
            await api.runTask(taskId);
        return taskId;  // Return the task ID even if runTask fails
        } catch (error:any) {
            console.log("ProcessNewScanPage::addProcessTask() RunTask error details:", error.response?.data);
            // return taskId;  // Still return the task ID
            throw new Error("Cannot run task");
        }


        return taskId;
    }

    
    try {
        console.log("ProcessNewScanPage addTask()")
        const taskId : string = await addTask()
        console.log("ProcessNewScanPage taskId: ", taskId)
        console.debug("- -taskId: ", taskId)

        // const process : IProcessMultiple = {
        //     state:"",
        //     vignettes: [],
        //     mask: "/uploads/01-10-2024/20230228_1219_back_large_raw_2-1727764546231-800724713.jpg",
        //     out: "/uploads/01-10-2024/20230228_1219_back_large_raw_2-1727764546231-800724713.jpg",
        //     vis: "/uploads/01-10-2024/20230228_1219_back_large_raw_2-1727764546231-800724713.jpg",
        //     log: "blabla about job done"
        // }
    
        const subsample = await getSubSample(projectid, sampleid, subsampleid)

        const extractImageProcessed = async (subsample:SubSample) => {
            const mask = subsample.scan.find( (s:Scan) => s.type == "MASK" &&  s.deleted == false && s.archived == false )
            const vis = subsample.scan.find( (s:Scan) => s.type == "VIS" &&  s.deleted == false && s.archived == false )
            const out = subsample.scan.find( (s:Scan) => s.type == "OUT" &&  s.deleted == false && s.archived == false )
            const task:ITask = await getTask(taskId)

            const ret : IProcessMultiple = {
                status: task.status,
                vignettes: [],
                mask: mask?.url,
                out: out?.url,
                vis: vis?.url,
                log: task.log
            }

            
            return Promise.resolve(ret)
            }
            const scanId = scan.id;
            // const process : IProcessMultiple = {
            //     state:"",
            //     vignettes: [],
            //     mask: "/uploads/01-10-2024/20230228_1219_back_large_raw_2-1727764546231-800724713.jpg",
            //     out: "/uploads/01-10-2024/20230228_1219_back_large_raw_2-1727764546231-800724713.jpg",
            //     vis: "/uploads/01-10-2024/20230228_
            // }

        const process = await extractImageProcessed(subsample)
        // const task:ITask = await getTask(taskId)


        const param = {
            // current : eState.process,
            // nextState: eState.check, 
            scan: "",
            background: "",
            scanId : scan.id, // "42", ///TODO put the good value here
            project,
            sample,
            subsample,
            process,
            taskId
        }

        console.debug("ProcessNewScanPage param: ", param)
        // return ( <></>)
        return ( <Process {...param} /> )
    // }
    // catch(error) {
    //     console.log("ProcessNewScanPage error: ", error)
    //     throw "Error adding task" + error 
    // }
    } catch (error: any) {
        return (
            <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-red-800 text-lg font-semibold">Processing Error</h2>
                    <p className="text-red-600">{error.response?.data?.error || error.message}</p>
                </div>
            </div>
        );
    }
}


export default ProcessNewScanPage;
