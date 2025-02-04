// "use client";
"use server";

import { Debug } from "@/components/Debug"
import { Timeline_scan } from "@/components/timeline-scan";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { FC, useEffect, useState } from "react"
import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
// import { useProject } from "@/app/api/projects";
import { getProject } from '@/app/api/data/projects';

// import { MySpinner } from "@/components/mySpinner";
import { ErrorComponent } from "@/components/ErrorComponent";
// import { IScan, Project, addBackground } from "@/app/api/network/zooprocess-api";

// import { MyImage } from "@/components/myImage";
// import { tree } from "next/dist/build/templates/app-page";

import {pathToRealStorage, pathToSessionStorage}  from "@/lib/gateway"
// import scan from "../samples/[sampleid]/subsamples/new/_[...scan]/page";

import { converttiff2jpg } from "@/api/convert";
import Timer from "@/components/timer";
import { TemporizedButton } from "@/components/temporized_button";
import { ScannerEffect } from "@/components/ScannerEffect";
// import { url } from "inspector";
// import { boolean } from "zod";
import { TimedScanButton } from "@/components/TimedScanButtonProps";
import { IScan, Project } from "@/app/api/network/interfaces";
import { addBackground } from "@/app/api/network/background";
// import { addBackground } from "@/app/api/network/zooprocess-api";

type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}



const BackgroundScanPage : FC<pageProps> = async ({params}) => {

    const router = useRouter();
    const {projectid, sampleid, subsampleid} = params;
    // const {project, isError, isLoading} = useProject/*<{Project,boolean,boolean>*/(projectid);
    const project = await getProject(projectid)

    const [image , setImage] = useState(false);
    const imagePlaceholder = "/images/placeholder-image.jpg";
    const [background, setBackground] = useState(imagePlaceholder)
    const [temporized, setTemporized] = useState(false)
    const [resetCounter, setResetCounter] = useState(0);

    const [triggerScan, setTriggerScan] = useState(false);

    const [scan1 , setScan1] = useState<string | undefined>(undefined)
    const [scan2 , setScan2] = useState<string | undefined>(undefined)

    // const [error , setError] = useState<Error | undefined>(undefined)
    const [error , setError] = useState<string | Error | undefined>(undefined)
    const [scanCompleted, setScanCompleted] = useState(false);

    // const [imageRGB , setImageRGB] = useState("");
    
    // const noError : Array<any>= []
    // const [error, setError] = useState(noError);
    // const [error, setError] = useState({});
    // const anyError : any = {}
    // const [error, setError] = useState(anyError);
    // const [error, setError]:[any,any] = useState(null);

    const [msg, setMsg]:[string, any] = useState("")

    const onClick = () => {
        console.log("validate scan")
        if ( image ) {
            // const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${subsampleid}/process/?image=${image}`
            const path = `/projects/${projectid}`
            console.log("path: " , path)
            router.push(path)
            // router.back()

        }
    };



    const isTiff = (fileUrl:string) : boolean => {
        console.log("fileUrl: ", fileUrl)
        // return true
        return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")

    }

    const onChange = async (fileUrl:IScan) => {

        ///TODO if old scan then remove it (because we replace with a new one)
        

        console.log("New scan onChange:", fileUrl)

        if (isTiff(fileUrl.url)){
        // if (isTiff(fileUrl)){
            const data = {
                src: pathToRealStorage(fileUrl.url),
                // src: pathToRealStorage(fileUrl),
                // dst: pathToRealStorage(fileUrl.url + ".jpg"),
            }

            // const data_test = {
            //     "src": "/Users/sebastiengalvagno/Drives/18-03-2024/medsea_mesocosme_wp220130310_c3_d2_raw_1-1710751210823-978326589.tif"
            // }

            console.log("data: ", data)
            console.log("data src: ", data.src)

            try {

                return await converttiff2jpg(data)
                .then(async (response:Response) => {
                    console.log("converttiff2jpg response: ", response)

                    // const imageUrl  = await response.text()

                    // console.log("converttiff2jpg response.text() : ", await response.text() ) 
                    // console.log("converttiff2jpg response.text() : ", imageUrl ) 
                    // response.text(
                    // text
                    response.text()
                    .then(async (imageUrl) => {
                        // show the converted image
                        // setImageUrl(imageUrl);
                        console.log("imageUrl: ", imageUrl)

                        imageUrl = imageUrl.replace(/"/g, "")
                        console.log("imageUrl cleaned: ", imageUrl)

                        // if ( imageUrl[0] == '"' ) {
                        //     console.error("arrrggggggggg !!!!!")
                        //     imageUrl=imageUrl.substring(1)
                        // }
                        // console.debug("imageUrl[-1]: ", imageUrl[-1])
                        // if ( imageUrl[-1] == '"'){
                        //     console.error("arrrggggggggg !!!!!")
                        //     imageUrl=imageUrl.substring(0,imageUrl.length-1)
                        // }

                        const localPath = pathToSessionStorage(imageUrl , "/" )
                        console.log("localPath: ", localPath)
                        setBackground(localPath)
                        // return response

                        // store the uploaded image 
                        let furl = fileUrl
                        furl.url = pathToRealStorage(fileUrl.url)
                        console.debug("furl: ", furl)

                        // return await addBackground(fileUrl)
                        return await addBackground(furl)
                        .then((response) => {
                            console.log("response: ", response)
                            // setImage(response.id)
                            setImage(true)
                            console.log("Go To the next page" )
                            // router.push(`${response.id}`)
                
                            // setImageRGB("/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_raw/dyfamed_20230111_100m_d1_raw_1.jpg")
                        })
                        .catch((error) => {
                            console.error("addBackground catch error: ", error)
                            return Promise.reject(error)
                        })

                    })
                    .catch((error) => {
                        console.error("Cannot convert Tiff to Jpg error: ", error)
                        const errormsg = { ...error, message: "Cannot convert Tiff to Jpg error"}
                        setMsg(errormsg.message)
                        setError(errormsg)
                        // throw new Error("Cannot convert Tiff to Jpg error: " + error)
                        throw errormsg
                    })

                })
                // .then(response => {
                //     response.text()
                //     .then(async (imageUrl) => {
                //         // setImageUrl(imageUrl);
                //         console.log("imageUrl: ", imageUrl)
                //         const localPath = pathToSessionStorage(imageUrl)
                //         console.log("localPath: ", localPath)
                //         setBackground(localPath)
                //         // return response

                //         return await addBackground(fileUrl)
                //         .then((response) => {
                //             console.log("response: ", response)
                //             setImage(response.id)
                //             console.log("Go To the next page" )
                //             // router.push(`${response.id}`)
                
                //             // setImageRGB("/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_raw/dyfamed_20230111_100m_d1_raw_1.jpg")
                //         })
                //         .catch((error) => {
                //             return Promise.reject(error)
                //         })

                //     })
                //     .catch((error) => {
                //         console.log("Cannot convert Tiff to Jpg error: ", error)
                //         const errormsg = { message:"Cannot convert Tiff to Jpg error: " + error}
                        // setMsg(errormsg.message)
                        // setError(errormsg)
                //         // throw new Error("Cannot convert Tiff to Jpg error: " + error)
                //         return Promise.reject(errormsg)
                //     })

                // })
                .catch((response) => {
                    console.error("Resp NOK", response.status)
                    // setError(response)
                    // setError([response])
                    if ( response.status == 422) {
                        const errormsg = { message:"The server do not accept your connection: " + error}
                        console.error("The server do not accept your connection")
                        console.error("Can't connect: ", response)
                        setMsg("The server do not accept your connection")
                        // throw new Error("The server do not accept your connection")
                        return Promise.reject(errormsg)
                    } else {
                        const errormsg = { message:"Cannot convert Tiff to Jpg error: " + error}
                        console.error("Cannot convert Tiff to Jpg error: ", response)
                        setMsg("Cannot convert Tiff to Jpg error:")
                        // throw new Error("Cannot convert Tiff to Jpg error: " + response)
                        setError(response)
                        return Promise.reject(errormsg)
                    }
                })

            }
            catch (error:any) {
                console.debug("catch exception")
                console.error("error: ", error)
                setError(error)
                setMsg(error)
            }

            // // const server = "http://localhost:8000"
            // const server = "http://zooprocess.imev-mer.fr:8000"
            // const url = server + "/convert/"
            // console.error("url: ", url)
            // console.error("data: ", data)
            // const response = await fetch( url , {
            //     method: "POST",
            //     body: JSON.stringify(data),
            //     // body: data_test,
            //     headers: {
            //         "Content-Type": "application/text",
            //         "Access-Control-Allow-Origin":"no-cors"
            //     },
            // })
            // .then((response) => {
            //     if (response.ok) {
            //         console.log("response: ", response)
            //         response.text()
            //         .then((imageUrl) => {
            //             // setImageUrl(imageUrl);
            //             console.log("imageUrl: ", imageUrl)
            //             const localPath = pathToSessionStorage(imageUrl)
            //             console.log("localPath: ", localPath)
            //             setBackground(localPath)
            //         })
            //         .catch((error) => {
            //             console.log("Cannot convert Tiff to Jpg error: ", error)
            //             const errormsg = { message:"Cannot convert Tiff to Jpg error: " + error}
            //             setMsg(errormsg.message)
            //             setError(errormsg)
            //         })
            //     } else {
            //         console.error("Resp NOK", response.status)
            //         setError(response)
            //         // setError([response])
            //         if ( response.status == 422) {
            //             console.error("The server do not accept your connection")
            //             console.error("Can't connect: ", response)
            //             setMsg("The server do not accept your connection")
            //         } else {
            //             console.error("Cannot convert Tiff to Jpg error: ", response)
            //             setMsg("Cannot convert Tiff to Jpg error:")
            //         }
            //     }
            // })
        } else {
            console.debug("not a TIFF")
            setBackground(fileUrl.url)

            let furl = fileUrl
            furl.url = pathToRealStorage(fileUrl.url)

            console.log("furl:", furl)

            // return await addBackground(fileUrl)
            return await addBackground(furl)
            .then((response) => {
                console.log("response: ", response)
                // setImage(response.id)
                setImage(true)
                console.log("Go To the next page" )
                // router.push(`${response.id}`)
    
                // setImageRGB("/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_raw/dyfamed_20230111_100m_d1_raw_1.jpg")
            })
            .catch((error) => {
                // return Promise.reject(error)
                setError(error)
                setMsg(error)
            })

        }

        // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
        // stringifiedData = JSON.stringify(value, null, 2);

        // POUR AFFICHAGE DEBUG
        // setData(JSON.stringify(value, null, 2))
        // console.log("App onChange:", stringifiedData);


        // return await addBackground(fileUrl)
        // .then((response) => {
        //     console.log("response: ", response)
        //     setImage(response.id)
        //     console.log("Go To the next page" )
        //     // router.push(`${response.id}`)

        //     // setImageRGB("/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_raw/dyfamed_20230111_100m_d1_raw_1.jpg")
        // })
        // .catch((error) => {
        //     return Promise.reject(error)
        // })
    }

    const timelist = [
        { text: "Scanner Info", checked: false },
        { text: "Prepare", checked: false },
        // { text: "Preview 1", checked: false },
        // { text: "30s", checked: false },
        { text: "Scan 1", checked: false },
        { text: "30s", checked: false },
        { text: "Scan 2", checked: false },
      ];

    interface MyLoaderProps {
        // instrumentId: string,
        project: Project|any,
        // sampleid: number,
        // subsampleid: number,
        onChange: (value: string) => void,
    }


    const Loader : FC<MyLoaderProps> = (props:MyLoaderProps) => {
        // if ( isLoading ) { return <MySpinner /> }
        // if ( isError ) { return <ErrorComponent error={isError}/> }

        console.log("project: ", props)
        console.log("project ID: ", props.project.id)
        console.log("instrumentId: ", props.project.instrumentId)

        if ( props.project.instrumentId === "undefined" ) {
            console.log("props.project.instrumentId === undefined")
            return <div>No instrument</div>
        }
        const instrumentId : string = props.project.instrumentId + "" //|| "" // + "" to force type string because test it before then existing

        // const props = {
        //     // projectid: projectid,
        //     // sampleid: sampleid,
        //     // subsampleid: subsampleid,
        //     instrumentId: project.instrumentId,
        // }

        return (
            <>
                <Debug params={project}/>
                <div><b>project: </b> {JSON.stringify(project)}</div>
                <div><b>project Id: </b> {props.project.id}</div>
                <div><b>instrument Id: </b> {props.project.instrumentId}</div>
                <div><b>instrument Id JS: </b> {JSON.stringify(props.project.instrumentId)}</div>
                {/* <Debug params={props}/> */}
                <FileUploader instrumentId={instrumentId} projectId={props.project.id} onChange={onChange} />
                {/* <FileUploader instrumentId={project.instrumentId} image={imageRGB} onChange={onChange} /> */}
            </>
        )
    }

    enum state {
        scannerSettings = 0,
        info = 1,
        // preview = 2,
        // thirtys1 = 3,
        // transition = 3,
        scan1 = 2,
        thirtys1bis = 3,
        scan2 = 4,
        end = 5
    }

    // let current = state.preview1 // 0 // 0.5

    let [current, setCurrent ] = useState(state.scannerSettings)

    const ScannerSettings = (project: Project|any, nextState: state ) => {
        // if ( current != state.scannerSettings ) {
        //     return <></>
        // }

        return (
            <>
            <Card className="inline-block size-full"
                data-testid="ScanCard" 
                >
                <CardBody className="p-6">
                    <div  className="bg-100 p-6">
                        <h1 className="text-center">You are about to scan a background with the Zooscan.</h1>
                        <br/><br/>
                        <div >
                            <Debug params={project} title="project"/>
                            { project.instrument?.sn && <b>Your project use Zooscan : {project.instrument?.sn}</b>}
                            <br/>
                            <b>project.instrumentId: {project.instrumentId}</b>
                            {/* <b>Your project use Zooscan : {project.instrument?.sn||""}</b> */}
                            {/* <b>Your project use Zooscan : {project.instrumentId} {project.instrument.serial}</b> */}
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex flex-row-reverse py-3">

                    <Button 
                        // disabled={ isError || isLoading || !image }
                        color="primary"
                        // showAnchorIcon
                        variant="solid"
                        data-testid="scanBackgroundBtn"
                        // >Scan {actions[nextAction(action)]}</Button>
                        onPress={() =>{ console.debug("I'm using " + project.instrument?.sn);   setCurrent(nextState) }}
                        // onPress={onClick}
                    >Continue - {"I'm using " + project.instrument?.sn}</Button>

                    <Button 
                        // disabled={ isError || isLoading || !image }
                        color="secondary"
                        // showAnchorIcon
                        variant="solid"
                        data-testid="backgroundCancelBtn"
                        // >Scan {actions[nextAction(action)]}</Button>
                        onPress={() =>{ console.debug("cancel scanning"); router.push('/projects'); }}
                        // onPress={onClick}
                    >Cancel</Button>
                </CardFooter>
            </Card>               
            </>
        )
    }

    const Info = ( nextState: state ) => {
        if ( current != state.info ) {
            return <></>
        }

        return (
            <>
            <Card className="inline-block size-full"
                data-testid="ScanCard" 
                >
                <CardBody className="p-6">
                    <div  className="bg-100 p-6">
                        <h1 className="text-center">You are about to scan a background with the Zooscan.</h1>
                        <br/><br/>
                        <div >
                            <ul className={"list-disc list-outside leading-loose"}>
                                <li>Clean the Zooscan tray.</li>
                                <li>Pour a small amount of water into the tray (salt or fresh)</li>
                                <li>Place the suitable frame (LARGE/NARROW) on the glass and adjust its position.</li>
                                <li>Add the sample</li>
                                <li>Adjust the water level just above the first step of the transparent frame (the meniscus must be above the step).</li>
                                {/* <li>Spread the specimens homogeneously, but avoid placing specimens close and parallel to the borders.<br/>
                                The number of objects will be adapted to their size, and it's important to limit the number of touching objects (multiple).</li>
                                <li>Help floating specimens to sink on the glass.</li>
                                <li>Separate the touching objects.</li> */}
                            </ul>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex flex-row-reverse py-3">

                    <Button 
                        // disabled={ isError || isLoading || !image }
                        color="primary"
                        // showAnchorIcon
                        variant="solid"
                        data-testid="PreviewBtn"
                        // >Scan {actions[nextAction(action)]}</Button>
                        onPress={() =>{ console.debug("go to Preview");   setCurrent(nextState) }}
                        // onPress={onClick}
                    >Done - Launch Preview</Button>
                </CardFooter>
            </Card>
            </>
        )
    }

    const Preview = (nextState: state ) => {
        // if ( current != state.preview ) {
        //     return <></>
        }

        // const afterScanComplete = () => {
        //     // setTemporized(false)
        //     console.log("Scan completed!");

        //     // if ( temporized == false ){
        //         // setTemporized(true)
        //     // } else {
        //         // setResetCounter(prev => prev + 1);
        //     // }
        //     setTimeout(() => {
        //         setTemporized(true);
        //         setResetCounter(prev => prev + 1);
        //     }, 100); // Adjust this delay as needed

        //     setTriggerScan(false);
        // }

        // useEffect( () => {

        // },[scanCompleted])

        const onPreviewClick = () => {
            console.log("onPreviewClick - TODO drive the scanner")
            console.debug("renew Preview");
        //     setTemporized(false)
        //     // setTemporized(true)
        //     // setResetCounter(prev => prev + 1);

            setTriggerScan(true);
            return Promise.resolve() 
        }

        const handleScan = () => {
            // console.log("Starting scan");
            // setTriggerScan(true);
            setCurrent(nextState) 
        };
    
        const handleValidate = () => {
            console.debug("go to wait 30s");
            setCurrent(nextState);
        };

        //setTriggerScan(true);

        return (
            <>
             <Card className="inline-block size-full w-4/5 max-w-screen-lg mx-auto"
                    data-testid="ScanCard" 
                    >
                <CardBody className="p-6">
                    <div  className="bg-100 p-6">
                        <h1 className="text-center">Preview</h1>
                        <ScannerEffect 
                            imageSrc="/demo/demo_background.jpg" 
                            scanDuration={1000} 
                            // onScanComplete={() => {
                            //     // Your function to run after the scan is complete
                            //     // You can call any function or perform any action here
                            //     afterScanComplete()
                            // }}
                            onScanComplete={() => {
                                console.log("Scan completed!");
                                setTriggerScan(false);
                                setScanCompleted(true)
                            }}
                            triggerScan={triggerScan}
                        />
                    </div>
                </CardBody>

                <CardFooter className="flex flex-row-reverse py-3">

                {/* <Button 
                        // isDisabled={ isError || isLoading }
                        color="secondary"
                        // showAnchorIcon
                        variant="solid"
                        data-testid="newProjectBtn"
                        // >Scan {actions[nextAction(action)]}</Button>
                        // onPress={onClick}
                        onPress={() =>{ console.debug("renew Preview");  onPreviewClick()  }}
                    >Preview</Button> */}

                    {/* <Button 
                        // isDisabled={ isError || isLoading }
                        color="danger"
                        // showAnchorIcon
                        variant="solid"
                        data-testid="newProjectBtn"
                        // >Scan {actions[nextAction(action)]}</Button>
                        // onPress={onClick}
                        onPress={() =>{ console.debug("go to wait 30s");   setCurrent(nextState) }}
                    >Scan</Button> */}
                    {/* <TemporizedButton  run={temporized} resetTrigger={resetCounter} onClick={() =>{ console.debug("go to wait 30s");   setCurrent(nextState) }}/> */}
                    <TimedScanButton
                        onScan={handleScan}
                        onPreview={() =>{  return  onPreviewClick() } }
                        // onValidate={handleValidate}
                        // scanDuration={1000}
                        // waitDuration={30}
                        initialTime={30}
                        scanCompleted={scanCompleted}
                    />
                </CardFooter>
            </Card>
            </>
        )
    }

    const ThirtySeconds = (nextState: state) => {
        if ( current != state.thirtys1 && current != state.thirtys1bis ) {
            return <></>
        }
    
        const handleTimerEnd = () => {
            setCurrent(nextState)
        }

        return (
            <Timer initialTime={30} onChange={handleTimerEnd} />
        )
    }
    // const ThirtySeconds = (nextState: state) => {
    //     if ( current != state.thirtys1 && current != state.thirtys1bis ) {
    //         return <></>
    //     }

    //     return (
    //         <>
    //          <Card className="inline-block size-full"
    //                 data-testid="ScanCard" 
    //                 >
    //             <CardBody className="p-6">
    //                 <div  className="bg-100 p-6">
    //                     <h1 className="text-center">Wait 30s.</h1>
    //                 </div>
    //             </CardBody>

    //             <CardFooter className="flex flex-row-reverse py-3">

    //                 <Button 
    //                     disabled={ isError || isLoading || !image }
    //                     color="primary"
    //                     // showAnchorIcon
    //                     variant="solid"
    //                     data-testid="newProjectBtn"
    //                     // >Scan {actions[nextAction(action)]}</Button>
    //                     // onPress={onClick}
    //                     onPress={
    //                         () =>{ 
    //                             console.debug("go to scan " + state.thirtys1?'1':'2'); 
    //                             //state.thirtys1 ? setCurrent(state.scan1):setCurrent(nextState) 
    //                             setCurrent(nextState) 
    //                         }
    //                     }
    //                 >Done - Launch Preview</Button>
    //             </CardFooter>
    //         </Card>
    //         </>
    //     )
    // }

  const Transition = ( nextState: state ) => {

    if (current != state.transition ) {
        return <></>;
      }
    
    setCurrent(nextState)

    return (
        <div></div>
    )
  }


  const Scan = (step: number = 1, nextState: state) => {
    if (current != state.scan1 && current != state.scan2) {
      return <></>;
    }

    // const loaderProps : MyLoaderProps = {
    //   project: project,
    //   onChange: onChange,
    // };

    const run = (filepath:string) => {
        // setTemporized(false)
        setTemporized(true)
        setTriggerScan(false);
        
        const p = project as Project ; 

        if ( p.instrumentId == undefined) {
            throw new Error("no instrumentId")
        }

        const file: IScan = {
            url: filepath,
            instrumentId: p.instrumentId,
            projectId: p.id,
        }

        onChange(file)
    }

    const scanned_image = "/demo/demo_background.jpg"

    const onClick = (image_path:string) => {
        console.debug("go to scan " + step);

        if (current == state.scan1) {
            setScan1(image_path)
        } else {
            setScan2(image_path)
        }

        console.debug("go to nextStep " + nextState);

        setCurrent(nextState)
    }
    

    return (
      <>
        <h3>Scan {step}</h3>
        <Card className="inline-block size-full" data-testid="ScanCard">
          <CardBody>
          <ScannerEffect 
                imageSrc="/demo/demo_background.jpg" 
                scanDuration={1000} 
                onScanComplete={() => {
                    // Your function to run after the scan is complete
                    console.log("Scan completed!");
                    // You can call any function or perform any action here
                    run("/demo/demo_background.jpg")
                }}
                triggerScan={triggerScan}
            />
          </CardBody>

          <CardFooter className="flex flex-row-reverse py-3">
            {/* <div className="flex-row">
              <Image
                className="height-auto"
                src={background}
                alt="uploaded image"
                height={446}
              />
            </div> */}
            { current == state.scan2 ? (
                <Button
                disabled={isError || isLoading || !image}
                color="primary"
                variant="solid"
                data-testid="newProjectBtn"
                onPress={ () => {
                    // if (current == state.scan1) {
                    // console.debug("go to 30s bis");
                    // setCurrent(nextState);
                    // } else {
                    console.debug("go to onClick");
                    // onClick();
                    // setCurrent(nextState);
                    // }
                    onClick(scanned_image)
                }}
                >
                Validate
                </Button>
            ):(
                // <TemporizedButton /*timer={30} label="Scan" waitlabel="Wait"*/ run={temporized} noWait={true}  onClick={() =>{ console.debug("go to wait 30s"); setScan1(scanned_image);  setCurrent(nextState) }}/>
                <TemporizedButton  run={temporized} noWait={true}  onClick={() =>{  onClick(scanned_image) }}/>
                // <TimedScanButton onPreview={() => {}} onScan={()=>{}} initialTime={30} />
            )}
          </CardFooter>
        </Card>
      </>
    );
  };

    const step = (current:state) => {
        switch (current) {
            case state.scannerSettings:
                return ScannerSettings(project, state.info)
            case state.info:
                // return Info(state.preview)
                return Info(state.scan1)
            // case state.preview:
                // return Preview(state.scan1) // thirtys1)
            // case state.thirtys1:
            //     return ThirtySeconds(state.scan1)
            case state.scan1:
                return Scan(1,state.scan2)
            // case state.thirtys1bis:
                // return ThirtySeconds(state.scan2)
            case state.scan2:
                return Scan(2,state.end)
            case state.end:
                return (
                    <>
                        <p>wait running background process</p>
                        <Button onClick={() => {
                                console.debug("running background process");
                                router.back()}
                            }>Back</Button>
                    </>
                )
            default:
                return (
                <>
                   <Debug params={{current,"error":"Unknown state"}} title="Error"/>
                </>
                )
        }
    }


    const showError = (error:any) => { 
        // console.error("showError")

        // if (error.length > 0) {
        if (error.message != undefined) {
            console.error("PRINT THE ERROR")
                return (
                    <ErrorComponent error={error} />
                // <div className="alert alert-danger" role="alert">
                //     <h4 className="alert-heading">Error</h4>
                //     <p>
                //         {JSON.stringify(error)}
                //     </p>
                // </div>
            )
        }
        return <></>

    }

    return (
        <>
            <Debug params={{...params,current}}/>
            <Debug params={error} title="Error" />
            <h1>Background</h1>
            <Timeline_scan current={current+0} list={timelist} />

            {error && showError(error)}
            {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
            {/* {JSON.stringify(error)} */}

            {/* <div><b>project Id: </b> {projectid}</div>
            <div><b>sample Id: </b> {sampleid}</div>
            <div><b>subsample Id: </b> {subsampleid}</div>
            <div><b>current: </b> {current}</div> */}

            { step(current) }
           
        </>
    )

}

export default BackgroundScanPage;

