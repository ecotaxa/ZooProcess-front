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
import { Background } from "./background";
import { linkScanToSubsample } from "@/app/api/data/scan";





export function ProcessTimeline(param: {
    // project: Project|any,
    project: Project|any,
    sample: Sample,
    subsample: SubSample,
    backgrounds: any
}) {
    const { project, sample, subsample, backgrounds } = param;

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
                return eState.process
            case "background":
                return eState.background
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
        // fields to play with image to show
        image: false as string|boolean,
        background: undefined, //imagePlaceholder,
        scan: undefined as string | undefined,
        fileUrl: undefined as any|undefined,

        // field to use for processing
        backgroundId: undefined as string | undefined, // the background associated to the scan
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
            case eState.background:{

                const choosenType = ['BACKGROUND','SCAN']

                // search in subsample the scan with type MEDIUM_BACKGROUND
                const medium_background = subsample.scan.find( (scan:any) => {
                    console.debug("scan:", scan.id, "=", scan.type)
                    return (scan.type == 'MEDIUM_BACKGROUND') }
                )
                console.log("medium_background: ", medium_background)

                const formatData = (data:any) => {
                    console.log("formatData", data);
                    console.debug("in medium_background: ", medium_background)

                    let selectedBackground = undefined // "" //new Set("")
                
                    if (medium_background) { 
                        console.debug("apply medium defined previously")
                        //selectedBackground.add(medium_background.id)
                        selectedBackground = medium_background.id
                        console.debug("(apply) selectedBackground: ", selectedBackground);

                    }



                    const backgrounds = Object.keys(data).map( (_scan) => {
                        console.log("background: ", _scan);
                
                        if ( _scan == "key"){
                            // console.error("ARRGG indey == key");
                            // console.log("ARRGG indey == key")
                            // console.debug(data);
                            // console.log("pfffff")
                            return null;
                        } else {
                          const s = data[_scan]
                          console.log("s: ", s);
              
                          const date = new Date(s.createdAt)
              
                          return {
                            id: s.id,
                            name: s.url,
                            creator: s.user.name,
                            utc: s.createdAt,
                            time:date.toLocaleTimeString(),
                            date:date.toLocaleDateString(),
                            type: s.type,
                            qc: s.qc || "TODO",  
                            action:s.url
                          }
                        }
                      }).filter(Boolean);
            
                    console.log("formated backgrounds data: ", backgrounds);
            
                    const filtered = backgrounds.filter((background:any) => background.type == "MEDIUM_BACKGROUND")
                    console.log("filtered backgrounds data: ", filtered)
                    
                    let sorted = filtered.sort((a:any,b:any) => new Date(b.utc).getTime() - new Date(a.utc).getTime())
            
                    let key = undefined
                    if (sorted && sorted.length > 0) {
                        const subsampleDate = new Date();
                        key = (sorted as any).reduce((prev:any, current:any) => {
                            return Math.abs(new Date(current.date).getTime() - subsampleDate.getTime()) <
                            Math.abs(new Date(prev.date).getTime() - subsampleDate.getTime()) ? current : prev
                        }).id 
                        console.log("key: ", key);
                        // setSelectedBackground(new Set([key]))

                        // If no one has been chosen previouly then choose the near date)
                        console.debug("selectedBackground.size =", selectedBackground)
                        if (selectedBackground) {
                            console.debug("== 0")
                            selectedBackground = key //new Set([key])
                            console.debug("selectedBackground: ", selectedBackground);
                        }                
            
                        // remove unwanted field utc
                        sorted = sorted.map((background:any) => {
                            const { utc, ...rest } = background
                            
                            return rest
                        })
                    }
                
                    console.debug("selectedBackground: ", selectedBackground);

                    return {background:sorted || [], selected:selectedBackground}
                }
            

                /**
                 * update internal object with the choosen background
                 */
                const updateScan = (backgroundId:string|undefined) => {
                    if (backgroundId){
                        setScanData({
                            ...scanData,
                            backgroundId
                        })
                    }
                }

                const formattedData:any = formatData(backgrounds)

                /**
                 * push data to the DB (link the background with the subsample)
                 */
                const updateBackground  = async () => {

                    // Update the DB
                    // const bodyBackground: any = {
                    //     "scanId": scanData.backgroundId,
                    //     "subsampleIs": subsample.id
                    // }
                    try {
                        if(scanData.backgroundId){
                            updateScan(scanData.backgroundId)
                            await linkScanToSubsample(project.id, sample.id, subsample.id, scanData.backgroundId)
                        }
                    }
                    catch(error){
                        console.error("Error updating scan:", error);
                    }

                    nextStep()
                }


                const params = {
                    project,
                    sample,
                    subsample, 
                    backgrounds: formattedData.background,
                    onCancel,
                    onValid:()=>updateBackground(), // push data to the DB
                    onSelect:(backgroundId:string|undefined) => {
                        // on select just put information in the local object
                        updateScan(backgroundId)
                        // if (backgroundId){
                        //     setScanData({
                        //         ...scanData,
                        //         backgroundId
                        //     })
                            // update scan data with id = scanID , to link it to the subsample
                            // updateScan({
                            //     subsampleId: subsample.id,
                            //     backgroundId
                            // })
                        // }
                        // nextStep()
                    },
                    selectedBackgroundId: scanData.backgroundId || formattedData.selected,
                }
                return renderStep(eState.background, Background(params))
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
                    console.debug("eState.scan1::onChange", fileUrl);
                    try {
                        setError(noError);
                        console.debug("eState.scan1::scanData:", scanData)
                        if (scanData.scan !== fileUrl.url) {
                            // setScanData({ ...scanData, scan: fileUrl.url, fileUrl });
                            // if (isTiff(fileUrl.url)) {
                            //     const data = { src: pathToRealStorage(fileUrl.url) };
                            //     const response = await converttiff2jpg(data);
                            //     if (response === null || response === undefined) {
                            //         throw new Error("Error converting tiff to jpg");
                            //     }
                            //     const imageUrl = await response.text();
                            //     const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/");
                            //     console.debug("scanData.background: ", scanData.background);
                            //     if (scanData.background !== localPath) {
                            //         console.debug("scanData.background !== localPath ");
                            //         setScanData({ ...scanData, background: localPath, fileUrl })
                            //     }
                            // } else {
                            //     setScanData({ ...scanData, scan: fileUrl.url, fileUrl });
                            // }
                            setScanData({ ...scanData, scan: fileUrl.url, fileUrl , background: fileUrl.url });
                        }
                    }
                    catch (error:any) {
                        console.error("Error in onChange: ", error);
                        setError([error.message]);
                    }
                };

                const onValid = async () => {
                    try {
                      console.debug("eState.scan1 onValid");
                      console.debug("scanData: ", scanData);
                  
                      if (scanData.fileUrl == undefined) {
                        setError(["Please select a file"]);
                        return;
                      }
                      
                      const fileUrl = scanData.fileUrl;
                      let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url), subsampleId: subsample.id };
                      console.debug("Calling addScan with:", furl);
                      
                      try {
                        const response = await addScan(furl);
                        console.debug("Scan response:", response);
                        
                        if (scanData.image !== response.id) {
                          setScanData(prevState => ({ ...scanData, image: response.id }));
                        }
                        // // remove the await because addScan take too time , and i got a timeout
                        // addScan(furl);
                        console.log("Go To the next page");
                        nextStep();
                      } catch (error: any) {
                        console.error("Error adding scan:", error);
                        
                        // Essayer de parser le message d'erreur JSON
                        try {
                          // Vérifier si le message d'erreur est une chaîne JSON
                          const errorMessage = error.message || error;
                          const errorObj = JSON.parse(typeof errorMessage === 'string' ? errorMessage : '{}');
                          
                          setError([
                            `${errorObj.message || "Failed to add scan"}`,
                            errorObj.details ? `Details: ${errorObj.details}` : null,
                            errorObj.path ? `Path: ${errorObj.path}` : null
                          ].filter(Boolean)); // Filtrer les valeurs null
                        } catch (parseError) {
                          // Si le parsing échoue, utiliser le message d'erreur brut
                          setError([error.message || error || "Unknown error occurred"]);
                        }
                      }
                    } catch (error: any) {
                      console.error("Error in onValid:", error);
                      setError([error.message || "An unexpected error occurred"]);
                    }
                  };

                // const onValid = async () => {
                //     try {
                //     console.debug("eState.scan1 onValid");
                //     console.debug("scanData: ", scanData);

                //     // if (scanData.fileUrl == undefined) return; // showError("Please select a file");
                //     if (scanData.fileUrl == undefined) {
                //         setError(["Please select a file"]);
                //         return;
                //       }
                    
                //     const fileUrl = scanData.fileUrl;
                //     // if (isTiff(fileUrl.url)) {

                //         let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url), subsampleId:subsample.id };
                //         console.debug("Calling addScan with:", furl);
                //         // const scanResponse = await addScan(furl);
                //         // if  ( scanResponse ){
                //         //     console.debug("Scan response:", scanResponse);

                //         //     // setImage(scanResponse.id);
                //         //     if (scanData.image !== scanResponse.id) {
                //         //         setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                //         //     }
                //         //     console.log("Go To the next page");
                //         // }
                //         // else {
                //         //     console.error("Error adding scan");
                //         //     setError(["Error adding scan"]);
                //         //     return
                //         // }

                //         // await addScan(furl)
                //         // .then(response => {
                //         //     console.debug("2 Scan response:", response);
                //         //     // setImage(response.id);
                //         //     if (scanData.image !== response.id) {
                //         //         setScanData(prevState => ({ ...scanData, image: response.id }));
                //         //     }
                //         //     console.log("Go To the next page 2");
                //         // })
                //         // .catch(error => {
                //         //     console.error("Error adding scan 2", error);
                //         //     setError([error.message]);
                //         // });

                //         try {
                //             const response = await addScan(furl);
                //             console.debug("Scan response:", response);
                            
                //             if (scanData.image !== response.id) {
                //               setScanData(prevState => ({ ...scanData, image: response.id }));
                //             }
                //             console.log("Go To the next page");
                //             nextStep();
                //           } catch (error: any) {
                //             console.error("Error adding scan:", error);
                //             // Essayer de parser le message d'erreur JSON
                //             try {
                //                 // Vérifier si le message d'erreur est une chaîne JSON
                //                 const errorMessage = error.message || error;
                //                 const errorObj = JSON.parse(typeof errorMessage === 'string' ? errorMessage : '{}');
                                
                //                 setError([
                //                 `${errorObj.message || "Failed to add scan"}`,
                //                 errorObj.details ? `Details: ${errorObj.details}` : null,
                //                 errorObj.path ? `Path: ${errorObj.path}` : null
                //                 ].filter(Boolean)); // Filtrer les valeurs null
                //             } catch (parseError) {
                //                 // Si le parsing échoue, utiliser le message d'erreur brut
                //                 setError([error.message || error || "Unknown error occurred"]);
                //             }

                //     // } else { // not a Tiff

                //     //     if ( scanData.background !== fileUrl.url ) {
                //     //         setScanData(prevState => ({ ...scanData, background: fileUrl.url }))
                //     //     }
                //     //     let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
                //     //     console.debug("2 Calling addScan with:", furl);
                //     //     const scanResponse = await addScan(furl);
                //     //     if  ( scanResponse){
                //     //         console.debug("2 Scan response:", scanResponse);
                //     //         // setImage(scanResponse.id);
                //     //         if (scanData.image !== scanResponse.id) {
                //     //             setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
                //     //         }
                //     //         console.log("Go To the next page 2");
                //     //     } else {
                //     //         console.error("Error adding scan 2");
                //     //     }

                //     // }

                //             // addScan a été fait au dessus

                //     nextStep()
                //     }
                //     catch (error: any) {
                //         console.error("Error in handleFileUploaderChange:", error);
                //         // Vous pouvez afficher l'erreur dans un toast ou une notification
                //         // toast.error(error.message);
                //         setError([error.message]);

                //       }
                // }
                



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


    // const showError = (error:any) => { 
    //     if (error.message != undefined) {
    //         console.error("PRINT THE ERROR")
    //             return (
    //                 <ErrorComponent error={error} />
    //         )
    //     }
    //     return <></>

    // }

    // const showError = (error: any) => { 
    //     // Si c'est un tableau non vide
    //     if (Array.isArray(error) && error.length > 0) {
    //         return (
    //             <ErrorComponent error={error} />
    //         );
    //     }
        
    //     // Si c'est un objet avec une propriété message
    //     if (error && typeof error === 'object' && error.message !== undefined) {
    //         return (
    //             <ErrorComponent error={error} />
    //         );
    //     }
        
    //     // Si c'est une simple chaîne
    //     if (typeof error === 'string' && error.trim() !== '') {
    //         return (
    //             <ErrorComponent error={error} />
    //         );
    //     }
        
    //     return <></>;
    // }
    const showError = (error: any) => { 
        // Vérifier si l'erreur existe et n'est pas vide
        if (error) {
            // // Si c'est un tableau non vide
            // if (Array.isArray(error) && error.length > 0) {
                return <ErrorComponent error={error} />;
            // }
            
            // // Si c'est un objet ou une chaîne
            // if (typeof error === 'object' || typeof error === 'string') {
            //     return <ErrorComponent error={error} />;
            // }
        }
        
        return <></>;
    }

return (
    <div className="flex-row">
    <h1>{project.name}</h1>
    <div className="debug-container">
        <Debug params={scanData} title="ScanData" />
        <Debug params={error} title="Error" open={true} />
    </div>
    <Timeline_scan current={current+0} list={timelist} />
    {/* {error && showError(error)} */}
    {error && error.length > 0 && showError(error)}
    {/* <div className="flex-grow h-[80vh] overflow-hidden"> */}
    <div>
        { step(current) }
    </div>

</div>
)

}
