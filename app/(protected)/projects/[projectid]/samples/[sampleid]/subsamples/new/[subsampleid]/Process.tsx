

import { Button, Card, CardBody, CardFooter, Slider } from "@nextui-org/react";

import { MySpinner } from "@/components/mySpinner"
import { ErrorComponent } from "@/components/ErrorComponent"

import { IProcess } from "@/app/api/network/zooprocess-api"

import {eState, timelist} from "./state"
import { useProcess } from "@/app/api/process"
import { useEffect, useState } from "react";

// import io from 'socket.io-client';
import { addProcessTask } from "@/app/api/tasks";
import { add } from "date-fns";


// export const Process = (params:{current:eState, nextState: eState, scan: string, background: string, image: string, projectid: string, sampleid: string, subsampleid: string, setCurrentFn:(state:eState)=>void}) => {
export function Process (params:{current:eState, nextState: eState, scan?: string, background: string, scanId: string, projectid: string, sampleid: string, subsampleid: string, setCurrentFn:(state:eState)=>void, onCancel:()=>void}) {

    let {current, nextState, scan, background, scanId,  projectid, sampleid, subsampleid, setCurrentFn, onCancel } = params

    if ( current != eState.process )  {
        return <></>
    }

    const [ taskId, setTaskId ] = useState<string>("")
    const [ showErrorMsg, setShowErrorMsg ] = useState<boolean>(false)



    async function addTask(){
        const data = { 
            params : {
                projectid,
                sampleid,
                subsampleid,
                scanId
            },
        }
        
        return addProcessTask(data)
            .then((response) => {
                console.log("addSeparateTask() response: ", response)
                if ( response?.status == 200 ){
                    const taskId = response.data.taskId 
                    // console.log('Go To the "check" page with taskId: ', taskId)
                    // const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${taskId}`
                    // const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${scanId}`
                    // router.push(path) 
                    // setCurrentFn(nextState)
                    // setTaskId(taskId)
                    return Promise.resolve(taskId)
                }
            })
            // .catch((error) => {
            //     console.log("error: ", error)
            //     setShowErrorMsg(true)
            //     return Promise.reject(error)
            // })
    }

    
    addTask()
        .then(taskId=>{
            console.log("taskId: ", taskId)
            setTaskId(taskId)
        })
        .catch((error) => {
            console.log("error: ", error)
            setShowErrorMsg(true)
        })


    const { data, isLoading, isError } = useProcess(projectid, sampleid, subsampleid)

//     const [socket, setSocket] = useState(null);
//     const [message, setMessage] = useState('');
  
//   useEffect(() => {
//     const newSocket = io("/api/socket");
//     setSocket(newSocket);

//     newSocket.on("message", (data) => {
//       console.log("Received message:", data);
//       setMessage(data);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);


    const showState = (data:IProcess|any) => {
        if (isLoading) return <MySpinner />
        if (isError) return <ErrorComponent error={isError}/>

        return (
            <>
                {JSON.stringify(data)}
                
            </>
        )
    }

    // const { data, isLoading, isError } = useProcess(projectid, sampleid, subsampleid)

    const showStates = (data:IProcess|any) => {
        if (isLoading) return <MySpinner />
        if (isError) return <ErrorComponent error={isError}/>
    
        return (
            <>
                {data.state}
                {/* <Slider
                //   label="State" 
                    color="foreground"
                    size="sm"
                    step={10} 
                    showSteps={true} 

                    marks={[
                        {
                        value: 20,
                        label: "Backgroud",
                        },
                        {
                        value: 50,
                        label: "Segmetting",
                        },
                        {
                        value: 80,
                        label: "Classification",
                        },
                    ]}
                    defaultValue={20}
                    className="max-w-md"
                /> */}
                {showState(data)}
                {taskId != "" && <div>taskId: {taskId}</div>}
            </> 
        )
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
                            {/* <Button color="primary" onClick={onPress}>Retry</Button> */}
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
            <ErrorMsg />  
        <Card className="inline-block size-full"
            data-testid="ScannerSettingsCard" 
            >
            <CardBody className="p-6">

                <div  className="bg-100 p-6">
                    <h1 className="text-center">Processing.</h1>
                    <br/><br/>
                    <div >
                        <h1>id: {subsampleid}</h1>
                        <h1>bg: {background}</h1>
                        <h1>sc: {scan}</h1>
                    </div>
                    <div>
                        {showStates(data)}
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

                <Button 
                    disabled={ isError || isLoading  }
                    color="primary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    onPress={() =>{   setCurrentFn(nextState) }}
                    // onPress={onClick}
                >Continue</Button>

                <Button 
                    disabled={ isError || isLoading  }
                    color="secondary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={() =>{ router.back() }} // push('/projects'); }}
                    onPress={() => onCancel()}
                    // onPress={onClick}
                >Cancel</Button>
            </CardFooter>
        </Card>               
        </>
    )

}
