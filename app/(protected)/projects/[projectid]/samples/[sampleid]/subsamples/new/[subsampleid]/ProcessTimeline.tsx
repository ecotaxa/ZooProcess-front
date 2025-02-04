"use client";

import { Project, Sample, SubSample } from "@/app/api/network/interfaces";
import { eState, timelist } from "./state";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { addScan } from "@/app/api/network/zooprocess-api";
import { pathToRealStorage, pathToSessionStorage, isTiff } from "@/lib/gateway";
import { converttiff2jpg } from "@/app/api/convert";
import { Debug } from "@/components/Debug";
// import { Check } from "./Check";
// import { Process } from "./Process";
import { Preview } from "./Preview";
import { ScannerSettings } from "./ScannerSettings";
import { Prepare } from "./Prepare";
import { Metadata } from "./Metadata";
import { Timeline_scan } from "@/components/timeline-scan";
import { ErrorComponent } from "@/components/ErrorComponent";
import { Scan } from "./Scan";
// import { addScan } from "@/app/api/network/scan";
import { addScan } from "@/app/actions/scan-actions"





export function ProcessTimeline(param: {
    // project: Project|any,
    project: Project|any,
    sample: Sample,
    subsample: SubSample,
}) {
    const { project, sample, subsample } = param;

    console.debug("ProcessTimeline:", param)

    const searchParams = useSearchParams()
    const state = searchParams.get('state') 

    const definePage = (state: string|null) => {
        switch (state) {
            case "preview":
                return eState.preview
            case "metadata":
                console.debug("goto metadata step")
                return eState.metadata
            case "scanner":
                return eState.scannerSettings
            case "prepare":
                return eState.info
            case "scan":
                return eState.scan1
            case "check":
                return eState.check
            case "process":
                 eState.process
            default:
                return eState.metadata
        }
    }
    // let initState = eState.metadata
    let initState = definePage(state)
    // console.debug("state", state)
    // if (state == "preview") {
    //     initState = eState.preview
    // }

    

    if ( project.instrument == undefined ) {
        throw new Error("No intrument defined")
        // return <ErrorComponent error={"No intrument defined"} />
    }

    const imagePlaceholder : string = "/images/placeholder-image.jpg";
    // const [image , setImage] = useState(false);
    // const [background, setBackground] = useState(imagePlaceholder)
    // const [scan, setScan] = useState<string|undefined>(undefined)

    const [scanData, setScanData] = useState({
        image: false as string|boolean,
        background: imagePlaceholder,
        scan: undefined as string | undefined,
        fileUrl: undefined as any|undefined
      });

    //   useEffect(() => {
    //     console.log("Current scanData:", scanData);
    // }, [scanData]);

    const noError : Array<any>= []
    const [error, setError] = useState(noError);
    const router = useRouter();




    // const isTiff = (fileUrl: string) : boolean => {
    //     console.log("fileUrl: ", fileUrl)
    //     return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")
    // }

    const onCancel = () => {
        // router.back()
        router.push(`/projects/${project.id}/samples/${sample.id}`)
    }

    const renderStep = (expectedStep: eState, component: JSX.Element) => {
        return current === expectedStep ? component : <></>;
    };

    const step = (current:eState) => {

        const nextStep = ()=>{
            setCurrent(current + 1)
            console.log("nextStep" , current+1)
            return current + 1}

        switch (current) {
            case eState.metadata:{
                const params = {
                    project,
                    sample,
                    subsample,
                    onCancel,
                    onValid:nextStep
                }
                return renderStep(eState.metadata, Metadata(params));
            }
            case eState.scannerSettings:{
                const params = {   
                    project,
                    instrument: project.instrument,
                    onCancel,
                    onValid:nextStep
                }
                return renderStep(eState.scannerSettings, ScannerSettings(params));
            }
            case eState.info:{
                    const params = {
                        onCancel,
                        onValid:nextStep
                    }
                    return renderStep(eState.info, Prepare(params));

                }
            case eState.preview:{
                const params = {   
                        onCancel,
                        onValid:nextStep
                    }
                return renderStep(eState.preview, Preview(params));

            }
            case eState.scan1:{
                // const onChange = async (fileUrl: any) => {
                //     try {
                //         // setScan(fileUrl.url);
                //         if ( scanData.scan !== fileUrl.url) {
                //             setScanData({ ...scanData, scan: fileUrl.url });
                //             if (isTiff(fileUrl.url)) {
                //                 const data = { src: pathToRealStorage(fileUrl.url) };
                //                 const response = await converttiff2jpg(data);
                //                 const imageUrl = await response.text();
                //                 const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/");
                //                 if ( scanData.background !== localPath ) {
                //                     // setBackground(localPath);
                //                     console.debug("scanData.background !== localPath ");
                //                     setScanData(prevState => ({ ...scanData, background: localPath }))
                //                 }
                        
                //             let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                //             console.debug("Calling addScan with:", furl);
                //             const scanResponse = await addScan(furl);
                //             if  ( scanResponse){
                //                 console.debug("Scan response:", scanResponse);

                //                 // setImage(scanResponse.id);
                //                 if (scanData.image !== scanResponse.id) {
                //                     setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                //                 }
                //                 console.log("Go To the next page");
                //             }
                //             else{
                //                 console.error("Error adding scan");
                //             }
                //         } else {
                //             // setBackground(fileUrl.url);
                //             if ( scanData.background !== fileUrl.url ) {
                //                 setScanData(prevState => ({ ...scanData, background: fileUrl.url }))
                //             }
                //             let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                //             console.debug("2 Calling addScan with:", furl);
                //             const scanResponse = await addScan(furl);
                //             if  ( scanResponse){
                //                 console.debug("2 Scan response:", scanResponse);
                //                 // setImage(scanResponse.id);
                //                 if (scanData.image !== scanResponse.id) {
                //                     setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                //                 }
                //                 console.log("Go To the next page 2");
                //             } else {
                //                 console.error("Error adding scan 2");
                //             }
                //         }
                //     }
                // }
                // catch (error) {
                //         console.error("Error in onChange: ", error);
                //         setError(error as any[]);
                //     }
                // };

                const onChange = async (fileUrl: any) => {
                    console.debug("onChange", fileUrl);
                    try {
                        // setScan(fileUrl.url);
                        if ( scanData.scan !== fileUrl.url) {
                            setScanData({ ...scanData, scan: fileUrl.url, fileUrl });
                            if (isTiff(fileUrl.url)) {
                                const data = { src: pathToRealStorage(fileUrl.url) };
                                const response = await converttiff2jpg(data);
                                const imageUrl = await response.text();
                                const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/");
                                console.debug("scanData.background: ", scanData.background);
                                if ( scanData.background !== localPath ) {
                                    // setBackground(localPath);
                                    console.debug("scanData.background !== localPath ");
                                    // setScanData(prevState => ({ ...scanData, background: localPath }))
                                    setScanData({ ...scanData, background: localPath , fileUrl})
                                }
                        
                            // let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                            // console.debug("Calling addScan with:", furl);
                            // const scanResponse = await addScan(furl);
                            // if  ( scanResponse){
                            //     console.debug("Scan response:", scanResponse);

                            //     // setImage(scanResponse.id);
                            //     if (scanData.image !== scanResponse.id) {
                            //         setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                            //     }
                            //     console.log("Go To the next page");
                            // }
                            // else{
                            //     console.error("Error adding scan");
                            // }
                        } else {
                            setScanData({ ...scanData, scan: fileUrl.url, fileUrl });
                        }
                        // else {
                        //     // setBackground(fileUrl.url);
                        //     if ( scanData.background !== fileUrl.url ) {
                        //         setScanData(prevState => ({ ...scanData, background: fileUrl.url }))
                        //     }
                        //     let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                        //     console.debug("2 Calling addScan with:", furl);
                        //     const scanResponse = await addScan(furl);
                        //     if  ( scanResponse){
                        //         console.debug("2 Scan response:", scanResponse);
                        //         // setImage(scanResponse.id);
                        //         if (scanData.image !== scanResponse.id) {
                        //             setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                        //         }
                        //         console.log("Go To the next page 2");
                        //     } else {
                        //         console.error("Error adding scan 2");
                        //     }
                        // }
                    }
                }
                catch (error) {
                        console.error("Error in onChange: ", error);
                        setError(error as any[]);
                    }
                };


                const onValid = async () => {
                    console.debug("onValid");
                    console.debug("scanData: ", scanData);

                    if (scanData.fileUrl == undefined) return; // showError("Please select a file");
                    const fileUrl = scanData.fileUrl;
                    // if (isTiff(fileUrl.url)) {

                        let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                        console.debug("Calling addScan with:", furl);
                        const scanResponse = await addScan(furl);
                        if  ( scanResponse ){
                            console.debug("Scan response:", scanResponse);

                            // setImage(scanResponse.id);
                            if (scanData.image !== scanResponse.id) {
                                setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                            }
                            console.log("Go To the next page");
                        }
                        else {
                            console.error("Error adding scan");
                        }
                    // } else { // not a Tiff

                    //     if ( scanData.background !== fileUrl.url ) {
                    //         setScanData(prevState => ({ ...scanData, background: fileUrl.url }))
                    //     }
                    //     let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                    //     console.debug("2 Calling addScan with:", furl);
                    //     const scanResponse = await addScan(furl);
                    //     if  ( scanResponse){
                    //         console.debug("2 Scan response:", scanResponse);
                    //         // setImage(scanResponse.id);
                    //         if (scanData.image !== scanResponse.id) {
                    //             setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                    //         }
                    //         console.log("Go To the next page 2");
                    //     } else {
                    //         console.error("Error adding scan 2");
                    //     }

                    // }

                            // addScan a été fait au dessus

                    nextStep()   
                }
                



                // const onValid = () => {
                //     console.debug("onValid");

                //     console.debug("scanData: ", scanData);

                //     // addScan a été fait au dessus

                //     nextStep()   
                // }

                const params = {
                    // current,
                    // nextState: eState.process,
                    // scan,
                    background: scanData.background,
                    // scanId:"1",
                    project,
                    sample,
                    subsample,
                    // setCurrent:setCurrentFn,
                    // onCancel,
                    onChange,
                    // onClick //: onPreview // a fouiller dans l'ancienn page
                    onValid // :nextStep
                }
                return renderStep(eState.scan1, Scan(params));

            }
            case eState.process:
                // {
                //     const params = {
                //         current, 
                //         nextState: eState.check, 
                //         scan, 
                //         background,  
                //         project, 
                //         sample, 
                //         subsample,
                //         setCurrentFn, 
                //         onCancel,
                //         scanId : "42", ///TODO put the good value here
                //     }
                // return renderStep(eState.process, Process(params));

                // }

                router.push(`/projects/${project.id}/samples/${sample.id}/subsamples/${subsample.id}/process`)
                return (<></>)
            // case eState.check:
            //     // return Scan(2,eState.end)
            //     {
            //         const params = {current, nextState: eState.end, setCurrent: setCurrentFn, onCancel }
            //         return ( <Check {...params} />)
            //     }

            // case eState.end:
            //     router.push(`/projects/${project.id}/samples/${sample.id}/subsamples/${subsample.id}`)
            //     // router.back()

            default:
                return (
                <>
                   <Debug params={{current,"error":"Unknown state"}} title="Error"/>
                </>
                )
        }
    }

    let [current, setCurrent ] = useState<eState>(initState)

    let setCurrentFn = (current:eState) => {
        setCurrent(current)
        console.log("setCurrent: ", current)
    }


    const showError = (error:any) => { 
        if (error.message != undefined) {
            console.error("PRINT THE ERROR")
                return (
                    <ErrorComponent error={error} />
            )
        }
        return <></>

    }

return (
    <div className="flex-row">
    <h1>{project.name}</h1>
    <Timeline_scan current={current+0} list={timelist} />
    {error && showError(error)}
    { step(current) }
   
</div>
)

}
