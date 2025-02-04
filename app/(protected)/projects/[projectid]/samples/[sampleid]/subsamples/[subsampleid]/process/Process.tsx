"use client"

import { Button, Card, CardBody, CardFooter, Textarea } from "@nextui-org/react";

import { useEffect, useRef, useState } from "react";

// import { addProcessTask } from "@/app/api/tasks";
import { IProcess, IProcessMultiple, Project, Sample, Scan, SubSample } from "@/app/api/network/interfaces";
import { useRouter } from "next/navigation";
import { MyImage } from "@/components/myImage";


const Process = (params:{
    scan?: string, 
    background: string, 
    scanId: string, 
    project: Project, 
    sample: Sample, 
    subsample: SubSample, 
    process: IProcessMultiple,
    taskId: string,
}) => {

    const [error, setError] = useState<string | null>(null);
    // const [ showErrorMsg, setShowErrorMsg ] = useState<boolean>(false)

    let {scan, background, scanId,  project, sample, subsample, process, taskId} = params

    const [currentProcess, setCurrentProcess] = useState<any>(process);

    // const fetchTask = async (taskId: string) => {
    //     const response = await fetch(`/api/tasks/${taskId}`);
    //     return response.json();
    // }
    const fetchTask = async (taskId: string) => {
        const response = await fetch(`/api/tasks/${taskId}`);
        const data = await response.json();
        return data.data;
    }

    // const fetchSubSample = async (projectId:string,sampleId:string,subSampleId: string) => {
    //     const response = await fetch(`/api/subsample/${projectId}/${sampleId}/${subSampleId}`);
    //     const data = await response.json();
    //     return data.data;
    // }
    // const fetchSubSample = async () => {
    const fetchSubSample = async (projectId:string,sampleId:string,subSampleId: string) => {
        try {
            const response = await fetch(`/api/subsample/${project.id}/${sample.id}/${subsample.id}`);
            const data = await response.json();
            if (!response.ok) {
                // throw new Error(`HTTP error! status: ${response.status}`);
                // const errorData = await response.json();
                // throw new Error(errorData.error || `HTTP error! status: ${response.status}`);

                console.error("Error fetching subsample response.statusText:", response.statusText);
                console.error("Error fetching subsample data.error:", data.error);
                console.error("Error fetching subsample error:", error);
                console.error("Error fetching subsample data:", data);

                setError(data.error || `HTTP error! status: ${response.status}`);
                return;
            }
            setError(null);
            return data;
        } catch (error: any) {
            // const errorMessage = error.message || 'Failed to fetch subsample';
            // setError(errorMessage);
            setError(error.message || 'Failed to fetch subsample');
            throw error;
        }
    };
    
    // const [isPolling, setIsPolling] = useState(true);
    // const intervalRef = useRef<NodeJS.Timeout>();

    // useEffect(() => {
    //     if (!isPolling) return;
    
    //     intervalRef.current = setInterval(async () => {
    //         const task = await fetchTask(taskId);
    //         if (task.status === "finished" || task.status === "failed") {
    //             setIsPolling(false);
    //             if (intervalRef.current) {
    //                 clearInterval(intervalRef.current);
    //             }
    //         }
    //         if (task.status === currentProcess.state) return;
    //         const updatedProcess = {
    //             ...currentProcess,
    //             state: task.status,
    //             log: task.log,
    //             mask: task.mask,
    //             out: task.out,
    //             vis: task.vis
    //         };
    //         setCurrentProcess(updatedProcess);
    //     }, 5000);

    //     return () => {
    //         if (intervalRef.current) {
    //             clearInterval(intervalRef.current);
    //         }
    //     };
    // }, [taskId, isPolling]);

    useEffect(() => {
        let interval = setInterval(async () => {
            try {
                const task = await fetchTask(taskId);
                const sub = await fetchSubSample(project.id,sample.id,subsample.id)
                const mask = sub.scan.find( (s:Scan) => s.type == "MASK" &&  s.deleted == false && s.archived == false )
                const vis = sub.scan.find( (s:Scan) => s.type == "VIS" &&  s.deleted == false && s.archived == false )
                const out = sub.scan.find( (s:Scan) => s.type == "OUT" &&  s.deleted == false && s.archived == false )
                // setCurrentProcess(task);

                const s = { mask,vis,out , taskId, status: task.status }
                console.debug("*************", s)

                setCurrentProcess(s);
                
                if (task.status == "FINISHED" || task.status == "FAILED") {
                    console.log("Stopping interval, task status:", task.status);
                    clearInterval(interval);
                }
            } catch (error) {
                console.log("Error fetching task:", error);
                clearInterval(interval);
            }
        }, 5000);
    
        return () => clearInterval(interval);
    }, [taskId]);



    const router = useRouter()
    const onCancel = () => {
        console.debug("cancel")
        router.push(`/projects/${project.id}/samples/${sample.id}/subsamples/${subsample.id}`)
    }

    const onChange = () => {
        console.debug("onChange")
        router.push(`/projects/${project.id}/samples/${sample.id}/subsamples/${subsample.id}/check`)
    }

    const onReScan = () => {
        console.debug("onReScan")
        router.push(`/projects/${project.id}/samples/${sample.id}/subsamples/new/${subsample.id}?state=preview`)
    }


    const onChangeFraction = () => {
        // delete fraction of ${subsample.id} > 1 and/or with QC = TODO

        console.debug("onChangeFraction")
        router.push(`/projects/${project.id}/samples/${sample.id}/subsamples/new/${subsample.id}?state=metadata`)
    }

    const showState = (data:IProcess|any) => {

        return (
            <>
                <br/>
                showState:<br/>
                <pre>
                {JSON.stringify(data,null,3)}
                </pre>
                <br/>
            </>
        )
    }


    const showStates = (data:IProcessMultiple|any) => {
        // if (isLoading) return <MySpinner />
        // if (isError) return <ErrorComponent error={isError}/>
    
        return (
            <>
                {/* {data.state} */}
                Status: {data.status}
                {/* <Slider
                //   label="State" 
                    color="foreground"
                    size="sm"
                    step={10} 
                    showSteps={true} 

                    marks={[
                        {
                        value: 20,
                        label: "Background",
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

            <div className="grid grid-cols-3 gap-4">

                {/* {data.mask && <img src={data.mask.url} alt="mask" style={{width: "50%"}} />}
                {data.out && <img src={data.out.url} alt="out" style={{width: "50%"}} />}
                {data.vis && <img src={data.vis.url} alt="vis" style={{width: "50%"}} />}
                 */}
                {data.mask && <MyImage src={String(data.mask.url)} legend="Mask" alt="mask" style={{width: "50%"}} />}
                {data.out && <MyImage src={String(data.out.url)} legend="Out" alt="out" style={{width: "50%"}} />}
                {data.vis && <MyImage src={String(data.vis.url)} legend="Vis" alt="vis" style={{width: "50%"}} />}
 
            </div>
                {data.log && <Textarea className="max-w-md" value={data.log} readOnly={true} />}

                {showState(data)}
                {taskId != "" && <div>taskId: {taskId}</div>}
            </> 
        )
    }

    function ErrorMsg() {

        // if ( showErrorMsg ) {
        if ( error ) {
                // return (
            //     <div>
            //         <Card>
            //             <CardBody>
            //                 <h1>Error</h1>
            //                 <h3>There is an error with your scan</h3>
            //             </CardBody>
            //             <CardFooter>
            //                 {/* <Button color="primary" onClick={onPress}>Retry</Button> */}
            //             </CardFooter>
            //         </Card>
            //     </div>
            // )
            return (
                <div>
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
                            <h3 className="text-red-800">Error</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                </div>
            )
        } else {
            return <></>
        }
    }


    return (
        <>
            {ErrorMsg()}
            {/* <div>
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
                            <h3 className="text-red-800">Error</h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                </div> */}

        <Card className="inline-block size-full"
            data-testid="ProcessCard" 
            >
            <CardBody className="p-6">

                <div  className="bg-100 p-6">
                    <h1 className="text-center">Processing.</h1>
                    <br/><br/>
                    <div className="flex flex-col items-center justify-center h-screen">
                    <h1>project id: {project.id}</h1>
                    <h1>sample id: {sample.id}</h1>
                    <h1>subsample id: {subsample.id}</h1>
                        <h1>bg: {background}</h1>
                        <h1>sc: {scan}</h1>
                        <h1>scanId: {scanId}</h1>
                        <h1>taskId: {taskId}</h1>
                    </div>

                    <div>
                        {showStates(currentProcess)}
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

                <Button 
                    // disabled={ isError || isLoading  }
                    color="primary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="processNextBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    onPress={() =>{   
                        // setCurrent(nextState)
                        onChange()
                     }}
                    // onPress={onClick}
                >Continue</Button>

                <Button 
                    // disabled={ isError || isLoading  }
                    color="secondary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="processCanceltBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={() =>{ router.back() }} // push('/projects'); }}
                    onPress={() => onReScan()}
                    // onPress={onClick}
                >Cancel - Re Scan</Button>
                <Button 
                    // disabled={ isError || isLoading  }
                    color="danger"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="processCanceltBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={() =>{ router.back() }} // push('/projects'); }}
                    onPress={() => onChangeFraction()}
                    // onPress={onClick}
                >Cancel - Change Fraction</Button>
            </CardFooter>
        </Card>               
        </>
    )

}


export default Process;
