"use client";


import { Background, Instrument, IScan, Project } from "@/app/api/network/interfaces"
import { useRouter, useSearchParams } from "next/navigation"
import { Dispatch, useCallback, useEffect, useMemo, useState } from "react"
import { eState, timelist } from "./eStateBackground"
import { ScannerSettings } from "./ScannerSettings";
import { Prepare } from "./Prepare";
import { Preview } from "./Preview";
import { Scan } from "./Scan";
import { pathToRealStorage, pathToSessionStorage } from "@/lib/gateway";
// import { converttiff2jpg } from "@/app/api/convert";
import { addBackground } from "@/app/api/network/background";
import { ThirtySeconds } from "./ThirtySeconds";
import { Process } from "./Process";
import { Timeline_scan } from "@/components/timeline-scan";
import { ErrorComponent } from "@/components/ErrorComponent";
import { Debug } from "@/components/Debug";
// import { space } from "postcss/lib/list";
// import scan from "../samples/[sampleid]/subsamples/new/_[...scan]/page";
import { Check } from "./Check";
// import { ta } from "date-fns/locale";
import { addBackgroundTask, runTask } from "@/app/api/tasks";
// import * as api from '@/app/api/network/zooprocess-api' 
// import { handleValidAction } from "@/app/actions/background-action";


const imagePlaceholder : string = "/images/placeholder-image.jpg";


export function BackgroundTimeline( param: {
    project: Project
    instrument: Instrument

    initialState?: eState,  // For testing
    initialScanData?: any   // For testing
}) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const state = searchParams.get('state') 

    const definePage = (state: string|null) => {
        switch (state) {
            case "preview":
                return eState.preview
            case "scanner":
                return eState.scannerSettings
            case "prepare":
                return eState.info
            case "scan":
            case "scan1":
                return eState.scan1
            case "scan2":
                return eState.scan2
            case "check":
                return eState.check
            case "process":
                 return eState.process
            case "check":
                return eState.check
            default:
                return eState.scannerSettings
        }
    }
    let [current, setCurrent ] = useState<eState>( param.initialState || definePage(state))


//  
    const [error, setError] = useState<Array<any>>([]);
    

    interface IBackgroundScans {
        image: string|boolean,
        scan: string,
        background1: string | undefined,
        background2: string | undefined,
        backgroundId1: string | undefined,
        backgroundId2: string | undefined,
        jpgbackground1: string | undefined,
        jpgbackground2: string | undefined,
        merge: string | undefined,
        fileUrl: any|undefined,
        taskId: string | undefined,
        textButton: string
    }

    const [scanData, setScanData]/*:[IBackgroundScans,Dispatch<IBackgroundScans>]*/ = useState( param.initialScanData || {
        image: false as string|boolean,
        scan: imagePlaceholder,
        background1: undefined as string | undefined,
        background2: undefined as string | undefined,
        backgroundId1: undefined as string | undefined,
        backgroundId2: undefined as string | undefined,
        jpgbackground1: undefined as string | undefined,
        jpgbackground2: undefined as string | undefined,
        merge: undefined as string | undefined,
        fileUrl: undefined as any|undefined,
        taskId: undefined as string | undefined,
      });

    // const noError : Array<any>= []
    // const [error, setError] = useState(noError);
    
    //   const [scanData, setScanData] = useState({
    //     image: false as string|boolean,
    //     background1: imagePlaceholder,
    //     background2: imagePlaceholder,
    //     fileUrl: undefined as any|undefined
    //   });



    const nextStep = useCallback(() => {

        // if (current == eState.scan2 && !scanData.background2) {
        //     console.debug("scanData:", scanData);
        //     console.error("Cannot proceed to the next step: background2 is missing.");
        //     console.trace()
        //     return;
        // }

        if ( current == eState.thirtys1) {
            console.debug("nextStep",current)
            console.trace()
            setCurrent(eState.scan2);
            return;
        }

        console.debug("nextStep",current)
        console.trace()
        setCurrent(prev => prev + 1);
        //return current + 1;
    }, [current]);



    const { project, instrument } = param




     // let initState = definePage(state)
    // let [current, setCurrent ] = useState<eState>(initState)


    if ( project.instrument == undefined ) {
        throw new Error("No intrument defined")
        // return <ErrorComponent error={"No intrument defined"} />
    }


    // const [scanData, setScanData] = useState({
    //     image: false as string|boolean,
    //     background1: imagePlaceholder,
    //     background2: imagePlaceholder,
    //     fileUrl: undefined as any|undefined
    //   });

    
      const isTiff = (fileUrl: string) : boolean => {
        console.log("fileUrl: ", fileUrl)
        return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")
    }


    const onCancel = () => {
        // router.back()
        router.push(`/projects/${project.id}/`)
    }

    // const renderStep = (expectedStep: eState, component: JSX.Element) => {
    //     return current === expectedStep ? component : <></>;
    // };
    // const renderStep = (expectedStep: eState, Component: () => JSX.Element) => {
    //     return <Component />;
    // };
    const renderStep = (
        expectedStep: eState,
        Component: React.FC<any> | null // Autoriser des props dynamiques
    ) => {
        if (current !== expectedStep || !Component) return null;
        return <Component />;
    };
    

    const step = (current:eState) => {

    // // const nextStep = ()=>{
    // //     setCurrent(current + 1)
    // //     console.log("nextStep" , current+1)
    // //     return current + 1}


    // // ***************************

    // // const [scanData, setScanData] = useState({
    // //     image: false as string|boolean,
    // //     scan: imagePlaceholder,
    // //     background1: undefined as string | undefined,
    // //     background2: undefined as string | undefined,
    // //     jpgbackground1: undefined as string | undefined,
    // //     jpgbackground2: undefined as string | undefined,
    // //     merge: undefined as string | undefined,
    // //     fileUrl: undefined as any|undefined
    // //   });


    // }

    // const [backgroundTaskId, setBackgroundTaskId] = useState<string>("")
    // 
    // Create task when reaching process state
    // useEffect(() => {
    //     if (current === eState.process && !scanData.taskId) {
    //         addBackgroundTask({
    //             params: {
    //                 project: project.id,
    //                 background: [scanData.background1, scanData.background2]
    //             }
    //         })
    //         .then(taskId => {
    //             console.log("Task created:", taskId);
    //             // setBackgroundTaskId(taskId)
    //             setScanData((prevState:IBackgroundScans) => ({ ...prevState, taskId }));

    //             // run the task
    //             // try {
    //                 api.runTask(taskId)
    //                 .then(taskStatus => {
    //                     // return response.id;  // Return the task ID even if runTask fails
    //                     console.log("Task run successfully");    
    //                 })
    //                 .catch(error => {
    //                     console.log("RunTask error details:", error.response?.data);
    //                     // return response.id;  // Still return the task ID
    //                     setError(prevErrors => [...prevErrors, "Error cannot run the task"]);
    //                 });
    //                 console.log("(no wait")
    //             // } catch (error:any) {
    //             //     console.log("RunTask error details:", error.response?.data);
    //             //     // return response.id;  // Still return the task ID
    //             //     setError(prevErrors => [...prevErrors, "Error cannot run the task"]);
    //             // }

    //         })
    //         .catch(error => {
    //             console.error("Error creating task:", error);
    //             setError(prevErrors => [...prevErrors, "Error creating task"]);
    //         });
    //     }
    // }, [current, scanData.background1, scanData.background2]);

    useEffect(() => {
        console.debug("Call UseEffect([current, scanData.background1, scanData.background2])")
        const createAndRunTask = async () => {
            console.debug("BackgroundTimeline::UseEffect::createAndRunTask()")
            
            if (current === eState.process && !scanData.taskId) {
                try {
                    // Créer la tâche
                    if (project.instrument == undefined) {
                        throw new Error("No instrument defined");
                    }

                    const taskId = await addBackgroundTask({
                        params: {
                            project: project.id,
                            instrumentId: project.instrument.id, 
                            background: [scanData.background1, scanData.background2]
                        }
                    });
                    console.log("Task created:", taskId);
    
                    // Mettre à jour l'état avec l'ID de la tâche
                    setScanData((prevState: IBackgroundScans) => ({...prevState, taskId }));
    
                    // Lancer la tâche
                    try {
                        // const taskStatus = await api.runTask(taskId);
                        const taskStatus = await runTask(taskId);
                        console.log("Task run successfully:", taskStatus);
                        setScanData((prevState: IBackgroundScans) => ({...prevState, medium: taskStatus.url }));
                    } catch (error: any) {
                        console.error("+ RunTask error details:", error.response?.data);
                        setError((prevErrors) => [...prevErrors, "Error cannot run the task"]);
                    }
                    console.log("(no wait")
                } catch (error: any) {
                    console.error("Error creating task:", error);
                    setError((prevErrors) => [...prevErrors, "Error creating task"]);
                }
            }
        };
    
        createAndRunTask(); // Appeler la fonction asynchrone
    }, [current, scanData.background1, scanData.background2]);

    

    // useEffect(() => {

    //     console.debug("useEffect triggered", {
    //         current,
    //         background1: scanData.background1,
    //         background2: scanData.background2,
    //         taskId: scanData.taskId,
    //     });

    //     if (!scanData.background1 || !scanData.background2) {
    //         console.warn("Background data is incomplete.");
    //         return;
    //     }

    //     if (current === eState.process && !scanData.taskId && scanData.background1 && scanData.background2) {
    //         (async () => {
    //             try {
    //                 const taskId = await addBackgroundTask({
    //                     params: {
    //                         project: project.id,
    //                         background: [scanData.background1, scanData.background2],
    //                     },
    //                 });
    //                 console.log("Task created:", taskId);
    //                 setScanData((prevState: IBackgroundScans) => ({ ...prevState, taskId }));
                    
    //                 try {
    //                     await api.runTask(taskId);
    //                     console.log("Task run successfully");
    //                 } catch (error:any) {
    //                     console.error("RunTask error details:", error.response?.data);
    //                     setError((prevErrors) => [...prevErrors, "Error cannot run the task"]);
    //                 }
    //             } catch (error) {
    //                 console.error("Error creating task:", error);
    //                 setError((prevErrors) => [...prevErrors, "Error creating task"]);
    //             }
    //         })();
    //     }
    // }, [current, scanData.background1, scanData.background2]);
    

    // const renderCurrentStep = useMemo(() => {
        switch (current) {
    
            case eState.scannerSettings:{
                const params = {   
                    project,
                    instrument: instrument,
                    onCancel,
                    onValid: nextStep
                }
                return renderStep(eState.scannerSettings, () => <ScannerSettings {...params} />);
            }
            case eState.info:{
                const params = {
                    onCancel,
                    onValid:nextStep
                }
                return renderStep(eState.info, () => <Prepare {...params} />);
            }
            case eState.preview:{
                const params = {   
                        onCancel,
                        onValid:nextStep
                    }
                return renderStep(eState.preview, () => <Preview {...params} />);
            }
            case eState.scan1:{
                // const onChange = async (fileUrl: any) => {
                //     console.debug("onChange scan1", fileUrl);
                //     try {
                //         if ( scanData.scan !== fileUrl.url) {
                //             setScanData((prevState:IBackgroundScans) => ({ ...scanData, scan: fileUrl.url, fileUrl }));
                //             if (isTiff(fileUrl.url)) {
                //                 const data = { src: pathToRealStorage(fileUrl.url) };
                //                 const response = await converttiff2jpg(data);
                //                 const imageUrl = await response.text();
                //                 // const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/");
                //                 const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/").replace(/^\/\//, '/');
                //                 console.debug("localPath: ", localPath);
   
                //                 // store the background
                //                 console.debug("previous value scanData.background: ", scanData.background1);
                //                 if ( scanData.background1 !== localPath ) {
                //                     // setBackground(localPath);
                //                     console.debug("scanData.background !== localPath ");
                //                     // setScanData(prevState => ({ ...scanData, background: localPath }))
                //                     // setScanData({ ...scanData, background1: localPath , fileUrl })
                //                     setScanData((prevState:IBackgroundScans) => ({ ...scanData, scan: localPath, background1: data.src, fileUrl }));
                //                 }                    
                //             } else {
                //                 // setScanData({ ...scanData, scan: fileUrl.url, fileUrl });
                //                 setScanData((prevState:IBackgroundScans) => ({ ...scanData, scan: fileUrl.url, background1: fileUrl.url, fileUrl }));
                //             }
                //         }
                //     }
                //     catch (error) {
                //         console.error("Error in onChange: ", error);
                //         setError(error as any[]);
                //     }
                // };
                const onChange = async (fileUrl: any) => {
                    console.debug("onChange scan1", fileUrl);
                    try {
                        // if (scanData.scan !== fileUrl.url) {
                            // Just update the scan URL - the MyImage component will handle TIFF conversion
                            setScanData((prevState:IBackgroundScans) => ({ 
                                ...prevState, 
                                scan: fileUrl.url, 
                                background1: fileUrl.url, // or pathToRealStorage(fileUrl.url) if you need the real path
                                realPathBackground1: pathToRealStorage(fileUrl.url),
                                fileUrl 
                            }));
                        // }
                    }
                    catch (error) {
                        console.error("Error in onChange: ", error);
                        // setError(error as any[]);
                        setError([error]);
                        // setError(error);
                    }
                };

                const onValid = async () => {
                    console.debug("onValid1");
                    console.debug("scanData: ", scanData);
    
                    if (scanData.fileUrl == undefined) return;
                    const fileUrl = scanData.fileUrl;
    
                    try {
                        let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                        // let furl: IScan = { 
                        //     url: scanData.fileUrl,
                        //     // background1: scanData.fileUrl,
                        //     projectId: project.id,
                        //     instrumentId: instrument.id
                        // }
                        console.debug("1 Calling addBackground with:", furl, ", type: RAW_BACKGROUND");
                        const scanResponse:Background = await addBackground(furl, "RAW_BACKGROUND");
                        // console.debug("Calling addBackground with:", fileUrl);
                        // const scanResponse = await addBackground(fileUrl);
                        if  ( scanResponse ){
                            if (scanResponse.error) {
                                console.error("Error adding background:", scanResponse.error);
                                setError([scanResponse.error]);
                                setScanData((prevState:IBackgroundScans) => ({ ...prevState, textButton: "retry to Validate" }));
                            } else {
                                console.debug("Scan response:", scanResponse);
                                // if (scanData.image !== scanResponse.id) {
                                // if (scanData.backgroundId1 !== scanResponse.id) {
                                    // setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                                    setScanData((prevState:IBackgroundScans) => ({ ...prevState, backgroundId1: scanResponse.id , background1: scanResponse.url }));
                                // }
                                console.log("Go To the next page");
                                setScanData((prevState:IBackgroundScans) => ({ ...prevState, scan: imagePlaceholder, fileUrl, textButton: "Validate" }));
                                setError([])
                                nextStep()   
                            }
                        } else {
                            console.error("Error adding scan");
                            setError([{ message: "Error adding scan - no response received" }]);
                            setScanData((prevState:IBackgroundScans) => ({ ...prevState, textButton: "retry to Validate" }));
                        }
    
                        // setScanData((prevState:IBackgroundScans) => ({ ...prevState, scan: imagePlaceholder, fileUrl }));
                        // nextStep()  
                    } catch (error:any) {
                        console.error("Error in onValid: ", error);
                        console.error("message:", error.message)
                        console.error("digest:",error.digest)
                    //     // Extract useful information from the error
                    //     let errorMessage = "An unknown error occurred";
                    //     let errorDetails = {};
                        
                    //     // Handle different error formats
                    //     if (error.response && error.response.data) {
                    //         const responseData = error.response.data;
                            
                    //         if (responseData.error) {
                    //             // Extract the specific error information
                    //             errorMessage = responseData.error.message || "Drive access error";
                    //             errorDetails = {
                    //                 name: responseData.error.name || "Error",
                    //                 url: responseData.error.url || "",
                    //                 stack: responseData.error.stack || ""
                    //             };
                    //         } else {
                    //             errorMessage = responseData.message || "API error";
                    //         }
                    //     } else if (error.message) {
                    //         errorMessage = error.message;
                    // }    
                    //     // Create a clean error object with only the information we need
                    //     const cleanError = {
                    //         message: errorMessage,
                    //         ...errorDetails,
                    //         originalError: process.env.NODE_ENV === 'development' ? JSON.stringify(error) : undefined
                    //     };
                        
                    //     setError([cleanError]);        
                        
                       // setError([error]); ErrorComponent must manage the error but there is a a bug in it
                        // if (typeof error === 'object' && error !== null) {
                        //     // This will handle the error object thrown from background.ts
                            // setError([error]);
                        // } else {
                        //     // Fallback for other error types
                        //     setError([{ message: "An unknown error occurred" }]);
                        // }
                        // setError(error);
                          // Try to parse the serialized error
                        let errorObj;
                        try {
                            // Check if the error message contains a JSON string
                            if (error.message && error.message.startsWith('{') && error.message.endsWith('}')) {
                            errorObj = JSON.parse(error.message);
                            } else {
                            // If not, create a basic error object
                            errorObj = {
                                message: error.message || "An unknown error occurred",
                                name: error.name || "Error"
                            };
                            }
                        } catch (parseError) {
                            // If parsing fails, use a fallback error object
                            errorObj = {
                            message: error.message || "An unknown error occurred",
                            name: error.name || "Error"
                            };
                        }
                        
                        // Set the parsed error in the state
                        setError([errorObj]);
                        setScanData((prevState:IBackgroundScans) => ({ ...prevState, textButton: "retry to Validate" }));
                    } 
                }
                
                const params = {
                    project,
                    onChange,
                    onValid// : nextStep
                    ,scan:scanData.scan,
                    textButton:scanData.textButton = "Validate"
                }
                return renderStep(current, () => <Scan {...params} textButton={scanData.textButton} />);            
            }

            case eState.thirtys1:{
    
                const params = {
                    onCancel,
                    onValid: nextStep,
                    time: 5
                }
    
                return renderStep(current, () => <ThirtySeconds {...params} /> )
            }

            case eState.scan2:{
                // const onChange = async (fileUrl: any) => {
                //     console.debug("onChange scan2", fileUrl);
                //     try {
                //         if ( scanData.scan !== fileUrl.url) {
                //             setScanData((prevState:IBackgroundScans) => ({ ...prevState, scan: fileUrl.url, fileUrl }));
                //             if (isTiff(fileUrl.url)) {
                //                 const data = { src: pathToRealStorage(fileUrl.url) };
                //                 const response = await converttiff2jpg(data);
                //                 const imageUrl = await response.text();
                //                 // const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/");
                //                 const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/").replace(/^\/\//, '/');
                //                 console.debug("localPath: ", localPath);
                //                 // store the background
                //                 console.debug("previous value scanData.background: ", scanData.background2);
                //                 if ( scanData.background2 !== localPath ) {
                //                     // setBackground(localPath);
                //                     console.debug("scanData.background !== localPath ");
                //                     // setScanData(prevState => ({ ...scanData, background: localPath }))
                //                     // setScanData({ ...scanData, background2: localPath , fileUrl })
                //                     setScanData((prevState:IBackgroundScans) => ({ ...prevState, scan: localPath, background2: data.src, fileUrl }));
                //                 }                    
                //             } else {
                //                 setScanData((prevState:IBackgroundScans) => ({ ...prevState, scan: fileUrl.url, background2: fileUrl.url, fileUrl }));
                //             }
                //         }
                //     }
                //     catch (error) {
                //         console.error("Error in onChange: ", error);
                //         setError(error as any[]);
                //     }
                // };
                const onChange = async (fileUrl: any) => {
                    console.debug("onChange scan2", fileUrl);
                    try {
                        // if (scanData.scan !== fileUrl.url) {
                            // Just update the scan URL - the MyImage component will handle TIFF conversion
                            setScanData((prevState:IBackgroundScans) => ({ 
                                ...prevState, 
                                scan: fileUrl.url, 
                                // background1: fileUrl.url, // the web local path
                                background2: pathToRealStorage(fileUrl.url), // the real path
                                realPathBackground2: pathToRealStorage(fileUrl.url),
                                fileUrl 
                            }));
                        // }
                    }
                    catch (error) {
                        console.error("Error in onChange: ", error);
                        // setError(error as any[]);
                        setError([error])
                        // setError(error);
                    }
                };
                
                const onValid = async () => {
                    console.debug("onValid2");
                    console.debug("scanData: ", scanData);
    
                    if (scanData.fileUrl == undefined) return;
                    const fileUrl = scanData.fileUrl;
    
                    try {
                        let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                        // let furl: IScan = { 
                        //     url: scanData.fileUrl,
                        //     projectId: project.id,
                        //     instrumentId: instrument.id
                        // }
                        console.debug("2 Calling addBackground with:", furl, ", type: RAW_BACKGROUND");
                        const scanResponse = await addBackground(furl, "RAW_BACKGROUND");
                        if  ( scanResponse){
                            if (scanResponse.error) {
                                console.error("Error adding background:", scanResponse.error);
                                setError([scanResponse.error]);
                            } else{
                                console.debug("Scan response:", scanResponse);
        
                                // if (scanData.image !== scanResponse.id) {
                                // if (scanData.backgroundId2 !== scanResponse.id) {
                                    setScanData((prevState:IBackgroundScans) => ({ ...prevState, backgroundId2: scanResponse.id, background2: scanResponse.url }));
                                // }
                                console.log("Go To the next page");
                                setScanData((prevState:IBackgroundScans) => ({ ...prevState, scan: imagePlaceholder, fileUrl }));
                                setError([])
                                nextStep()
                            }
                        } else {
                            console.error("Error adding scan");
                            setError([{ message: "Error adding scan - no response received" }]);
                        }

                    // setScanData((prevState:IBackgroundScans) => ({ ...prevState, scan: imagePlaceholder, fileUrl }));
                    // nextStep()   
                    } catch (error:any) {
                        console.error("Error in onValid: ", error);
                        
                    //     // Extract useful information from the error
                    //     let errorMessage = "An unknown error occurred";
                    //     let errorDetails = {};
                        
                    //     // Handle different error formats
                    //     if (error.response && error.response.data) {
                    //         const responseData = error.response.data;
                            
                    //         if (responseData.error) {
                    //             console.debug("responseData.error:",responseData.error)
                    //             // Extract the specific error information
                    //             errorMessage = responseData.error.message || "Drive access error";
                    //             errorDetails = {
                    //                 name: responseData.error.name || "Error",
                    //                 url: responseData.error.url || "",
                    //                 stack: responseData.error.stack || ""
                    //             };
                    //         } else {
                    //             errorMessage = responseData.message || "API error";
                    //         }
                    //     } else if (error.message) {
                    //         errorMessage = error.message;
                    //     }
                        
                    //     // Create a clean error object with only the information we need
                    //     const cleanError = {
                    //         message: errorMessage,
                    //         ...errorDetails,
                    //         originalError: process.env.NODE_ENV === 'development' ? JSON.stringify(error) : undefined
                    //     };
                        
                    //     setError([cleanError]);
                        // setError(error);
                        // setError([error])
                        let errorObj;
                        try {
                            // Check if the error message contains a JSON string
                            if (error.message && error.message.startsWith('{') && error.message.endsWith('}')) {
                            errorObj = JSON.parse(error.message);
                            } else {
                            // If not, create a basic error object
                            errorObj = {
                                message: error.message || "An unknown error occurred",
                                name: error.name || "Error"
                            };
                            }
                        } catch (parseError) {
                            // If parsing fails, use a fallback error object
                            errorObj = {
                            message: error.message || "An unknown error occurred",
                            name: error.name || "Error"
                            };
                        }
                        
                        // Set the parsed error in the state
                        setError([errorObj]);
                    }
                }
                
                const params = {
                    project,
                    onChange,
                    onValid,
                    scan:scanData.scan,
                    textButton:scanData.textButton = "Validate"
                }
                // return renderStep(current, () => <Scan {...params} />);
                return renderStep(current, () => <Scan {...params} textButton={scanData.textButton} />);            
            }
            case eState.process:{
                // let taskCreate = false
                const onValid =  (value:string) => {
                    console.debug("onValid");
                    // setScanData(prevState => ({ ...scanData, taskId: value }));
                    // taskCreate = true
                    nextStep()
                }

                // const addTask = async (project: Project, background: Array<string>) => {
                //     const data = { 
                //         params : {
                //             project: project.id,
                //             background
                //         },
                //     }
    
                //     const taskId = await addBackgroundTask(data);
                //     if (!taskId) {
                //         console.error("Error addBackgroundTask ((((((()))))) - No task ID returned" )
                //         throw new Error("No task ID returned");
                //     }
                //     console.debug("addTask taskId: ", taskId )
                //     return taskId;
                // }

                // const handleValid = (value: string) => {
                //     'use server'
                //     onValid(value)
                // }
                
                if ( scanData.background1 && scanData.background2 ) {

                    if ( scanData.taskId){
                    // try {
                        // const result = await
                        // addTask(project, [scanData.background1, scanData.background2])
                        // .then(taskId => {
                        //     console.debug("addTask taskId: ", taskId )
                        //     setScanData(prevState => ({ ...scanData, taskId }));
                        const params = {
                            background1: scanData.background1 || "",
                            background2: scanData.background2 || "",
                            project,
                            taskId: scanData.taskId,
                            onCancel,
                            onValid: nextStep
                            // onValid: handleValid
                            // onValid: (value: string) => handleValidAction(value, onValid)
                            // onValid
                        }
                        console.debug("********************************************** Process params: ", params);
                        return renderStep(current, () => <Process {...params} />);
                        // })
                        } else {
                            return <>Missing taskId</>
                        }


                    
                    // }
                    // catch (error) {
                    //     console.error("Error in onValid: ", error);
                    //     setError(error as any[]);

                    // }

                } else {
                    return <>Missing background</>
                }
    
            }
    
            case eState.check:{



                const params = {
                    project,
                    taskId:scanData.taskId,
                    // task
                    onCancel,
                    onValid:nextStep
                }
                return renderStep(current, () => <Check {...params} />);
            }
            } // switch
        }//, [current, scanData, nextStep]);

        
    const showError = (error:any) => { 
        console.error("showError(",error,")")

        // if (error.length > 0) {
        if (error.message != undefined) {
            console.error("PRINT THE ERROR")
                return (
                    <>
                        <Debug params={error} title="error" open={true} />
                        <ErrorComponent error={error} />
                    </>
                // <div className="alert alert-danger" role="alert">
                //     <h4 className="alert-heading">Error</h4>
                //     <p>
                //         {JSON.stringify(error)}
                //     </p>
                // </div>
            )
        // }  else {
        //     if ( error != undefined) {
        //         console.error("PRINT THE ERROR 2")
        //         return (
        //             <>
        //                 <ErrorComponent error={error} />
        //             </>
        //         // <div className="alert alert-danger" role="alert">
        //         //     <h4 className="alert-heading">Error</h4>
        //         //     <p>
        //         //         {JSON.stringify(error)}
        //         //     </p>
        //         // </div>
        //     )
        //     }   
        //     return <>Error</>
        }
        
        return <></>

    }

return (
        <div className="flex-row">
            <h1>{project.name}</h1>
            <Debug params={current} title="Current" open={true} />
            <Timeline_scan current={current+0} list={timelist} />
            {/* {error && showError(error)} */}
            {/* { step(current) } */}
            {/* {error.length > 0 && showError(error)} */}
            {/* {showError(error)} */}
            <Debug params={error} title="error" open={true} />
            {/* {error && <ErrorComponent error={error} />} */}
            {error && error.length > 0 && <ErrorComponent error={error} />}
            {/* {renderCurrentStep} */}
            <Debug params={scanData} title="ScanData" open={true} pre={true} />
            {step(current)}
        </div>
        )



}
