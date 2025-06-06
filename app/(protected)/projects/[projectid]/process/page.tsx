// "use server";
"use client";

import { Project } from "@/app/api/network/interfaces";
import { addBackgroundTask } from "@/app/api/tasks";
import { MyImage } from "@/components/myImage";
import { Button, Card, CardBody, CardFooter, Image, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
// import { add } from "date-fns";

    export function Process (params:{
        background1:string
        background2:string
        project: Project

        onCancel:()=>void,
        onValid:()=>void
    }) {
        const { onCancel, onValid } = params

    const [ taskId, setTaskId ] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    async function addTask(project: Project, background:Array<string>) {
        const data = { 
            params : {
                project: project.id,
                // sample: sample.id,
                // subsample: subsample.id,
                background
            },
        }
        
        const taskId = await addBackgroundTask(data);
        if (!taskId) {
            throw new Error("No task ID returned");
        }
        setTaskId(taskId);
        return taskId;
    }

    useEffect(() => {
        addTask(params.project, [params.background1, params.background2])
            .then(result => setTaskId(result))
            .catch(error => console.error('Task error:', error))
    }, []) // Empty dependency array means this runs once on mount


    return (
        <>
        <Card className="inline-block size-full"
            data-testid="ScanCard" 
            >
            <CardBody className="p-6">
                <div  className="bg-100 p-6">
                    <h1 className="text-center">Your backgrounds.</h1>
                    <br/><br/>
                    <div >
                        <ul className={"list-disc list-outside leading-loose"}>
                            <li>{params.background1}</li>
                            <li>{params.background1}</li>
                        </ul>
                    </div>
                    <div>
                        <MyImage src={params.background1}/>
                        <MyImage src={params.background2}/>
                    </div>
                    {/* <div>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            // Render task result
                            <div>Task ID : {taskId}</div>
                        )}
                    </div> */}
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

                <Button 
                    color="primary"
                    variant="solid"
                    data-testid="newProjectBtn"
                    onPress={() =>{ onValid() }}
                >Check Task {taskId}</Button>
            </CardFooter>
        </Card>
        </>
    )
}
