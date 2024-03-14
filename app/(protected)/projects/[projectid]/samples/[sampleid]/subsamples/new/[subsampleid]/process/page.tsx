"use client";

import { Debug } from "@/Components/Debug"
import { Timeline_scan } from "@/components/timeline-scan";
import { Button, Card, CardBody, CardFooter, Spinner } from "@nextui-org/react";
import { FC, useState } from "react"
// import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
// import { useProject } from "@/app/api/projects";
// import { MySpinner } from "@/components/mySpinner";
// import { ErrorComponent } from "@/components/ErrorComponent";


import { addSeparateTask } from "@/api/tasks"


interface SearchParams {
    [key: string]: string | string[] | undefined
  }

type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    },
    searchParams: SearchParams
}

const ProcessPage : FC<pageProps> = ({params, searchParams}) => {

    console.log("ProcessPage")
    console.log("params: ",params)
    console.log("searchParams: ",searchParams)

    const router = useRouter();
    const { projectid, sampleid, subsampleid } = params
    const [ showErrorMsg, setShowErrorMsg ] = useState<boolean>(false)

    const image = searchParams.image

    console.log("image: ", image)

    function onPress() {
        // router.push("../scan");
        // const taskId = "65e5c903930f50fae433df9b"
        const data = { 
            params : {
                projectid,
                sampleid,
                subsampleid,
                // folder:{
                //     src:"",
                //     dst:""
                // }
            },
            // log: {
            //     launch:Date.now()
            //     // user:
            // }
        }
        
        // const taskId = 
        addSeparateTask(data)
        // .then((taskId)=>{
        //     // if ( taskId?.status == 200 ){
        //     //     console.log('Go To the "check" page with taskId: ', taskId.data.id)
        //     //     const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${taskId.data.id}`
        //     //     // router.push(path)    
        //     // }   
        //     if ( taskId ){
        //         console.log('Go To the "check" page with taskId: ', taskId)
        //         const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${taskId}`
        //         // router.push(path)    
        //     }    
        // })
        .then((response) => {
            console.log("addSeparateTask() response: ", response)
            if ( response?.status == 200 ){
                const taskId = response.data.id 
                console.log('Go To the "check" page with taskId: ', taskId)
                const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${taskId}`
                router.push(path) 
            }
        })
        .catch((error) => {
            console.log("error: ", error)
            setShowErrorMsg(true)
        })
    }

    function ErrorMsg() {

        if ( showErrorMsg ) {
        return (
            <div>
                <Card>
                    <CardBody>
                        <h1>Error</h1>
                        <h3>There is an error with your scan</h3>
                    </CardBody>
                    <CardFooter>
                        <Button color="primary" onClick={onPress}>Retry</Button>
                    </CardFooter>
                </Card>
            </div>
        )
        } else {
            return <></>
        }
    }

    return (
        <>

        <Timeline_scan current={3} />

        <div className="text-start w-">
            <h1>Processing your scan</h1>
            <h3>{image}</h3>
            <Spinner/>
        </div>
        <ErrorMsg />  
        <div>
            <Button onPress={onPress} color="primary">Check</Button>
        </div>

        </>
    )

}


export default ProcessPage;
