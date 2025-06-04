// code obsolette ou doublons pour le mode uplaod ou vrai scan ?
"use client";

import { Debug } from "@/components/Debug"
import { Timeline_scan } from "@/components/timeline-scan";
import { Button, Card, CardBody, CardFooter, Image, Spinner } from "@heroui/react";
import { FC, useEffect, useState } from "react"
import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
import { MySpinner } from "@/components/mySpinner";
import { ErrorComponent } from "@/components/ErrorComponent";


import {pathToRealStorage, pathToSessionStorage}  from "@/lib/gateway"

import { converttiff2jpg } from "@/api/convert";
import Timer from "@/components/timer";
import { Background, Project } from "@/app/api/network/interfaces";
import { addBackground } from "@/app/api/network/background";

type pageProps = {
    params:{
        project: Project,
        // sample: string,
        // subsample: string,    
    }
}



const BackgroundUpload : FC<pageProps> = ({params}) => {

    const {project} = params;

    console.debug("BackgroundUpload()::project:",project)

    const router = useRouter();
        

    const [image , setImage] = useState(false);
    const imagePlaceholder = "/images/placeholder-image.jpg";
    const [background, setBackground] = useState(imagePlaceholder)
    
    const noError : Array<any> = []
    const [error, setError]:[any,any] = useState(null);

    const [msg,setMsg]:[string,any] = useState("")

    const [scan1 , setScan1] = useState<string | undefined>(undefined)
    const [scan2 , setScan2] = useState<string | undefined>(undefined)

    const onClick = () => {
        console.debug("onClick - validate scan")
        if ( image ) {
            const path = `/projects/${project.id}`
            console.debug("onClick - path: ", path)

               
            const data = {

            }

            router.push(path)
        }
    };

    const onPreviewClick = () => {
        console.log("onPreviewClick")
    }

    const isTiff = (fileUrl:string) : boolean => {
        console.log("fileUrl: ", fileUrl)
        return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")

    }

    const onChange = async (fileUrl:any) => {

        ///TODO if ancien scan then remove it (because we replace with a new one)
        
        console.log("New scan onChange:", fileUrl)

        if (isTiff(fileUrl.url)){
            const data = {
                src: pathToRealStorage(fileUrl.url),
            }

            console.log("data: ", data)
            console.log("data src: ", data.src)

            try {

                return await converttiff2jpg(data)
                .then(async (response:Response) => {
                    console.log("converttiff2jpg response: ", response)

                    response.text()
                    .then(async (imageUrl) => {
                        // show the converted image
                        console.log("imageUrl: ", imageUrl)

                        imageUrl = imageUrl.replace(/"/g, "")
                        console.log("imageUrl cleaned: ", imageUrl)

                        const localPath = pathToSessionStorage(imageUrl , "/" )
                        console.log("localPath: ", localPath)
                        setBackground(localPath)

                        // store the uploaded image 
                        let furl = fileUrl
                        furl.url = pathToRealStorage(fileUrl.url)
                        console.debug("furl: ", furl)

                        return  addBackground(furl)
                        .then((response:Background) => {
                            console.log("response: ", response)
                            setImage(response.id)
                            console.log("Go To the next page" )
                        })
                        .catch((error) => {
                            console.error("addBackground catch error: ", error)
                            return Promise.reject(error)
                        })

                    })
                    .catch((error) => {
                        console.error("Cannot convert Tiff to Jpg error: ", error)
                        const errormsg = { ...error, message:"Cannot convert Tiff to Jpg error"}
                        throw errormsg
                    })

                })
                .catch((response) => {
                    console.error("Resp NOK", response.status)
                    if ( response.status == 422) {
                        console.error("The server do not accept your connection")
                        console.error("Can't connect: ", response)
                        throw new Error("The server do not accept your connection")
                    } else {
                        console.error("Cannot convert Tiff to Jpg error: ", response)
                        const errormsg = { ...response, message:"Cannot convert Tiff to Jpg error"}
                        throw errormsg
                    }
                });

            }
            catch (error) {
                console.error("error: ", error)
                setError(error)
                setMsg(error)
            }

        } else {
            setBackground(fileUrl.url)

            let furl = fileUrl
            furl.url = pathToRealStorage(fileUrl.url)

            console.log("furl:", furl)

            return await addBackground(furl)
            .then((response:Background) => {
                console.log("response: ", response)
                setImage(response.id != null)
                console.log("Go To the next page" )
            })
            .catch((error) => {
                setError(error)
                setMsg(error)
            })

        }

    }

    const timelist = [
        { text: "Scanner Info", checked: false },
        { text: "Prepare", checked: false },
        { text: "Scan 1", checked: false },
        { text: "30s", checked: false },
        { text: "Scan 2", checked: false },
      ];

    interface MyLoaderProps {
        project: Project|any,
        onChange: (value: string) => void,
    }


    const Loader : FC<MyLoaderProps> = (props:MyLoaderProps) => {

        console.log("project: ", props)
        console.log("project ID: ", props.project.id)
        console.log("instrumentId: ", props.project.instrumentId)

        if ( props.project.instrumentId === "undefined" ) {
            console.log("props.project.instrumentId === undefined")
            return <div>No instrument</div>
        }
        const instrumentId : string = props.project.instrumentId + "" //|| "" // + "" to force type string because test it before then existing

        return (
            <>
                <Debug params={project}/>
                <div><b>project Id: </b> {props.project.id}</div>
                <div><b>instrument Id: </b> {props.project.instrumentId}</div>
                <div><b>instrument Id JS: </b> {JSON.stringify(props.project.instrument)}</div>
                <FileUploader instrumentId={instrumentId} projectId={project.id} onChange={onChange} />
            </>
        )
    }

    enum state {
        scannerSettings = 0,
        info ,
        scan1,
        thirtys1bis,
        scan2 ,
        end 
    }

    let [current, setCurrent ] = useState(state.scannerSettings)

    const ScannerSettings = (project: Project|any, nextState: state ) => {
        if ( current != state.scannerSettings ) {
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
                            <Debug params={project} title="project"/>
                            { project.instrument && project.instrument.sn && <b>Your project use Zooscan : {project.instrument?.sn}</b>}
                            <br/>
                            <b>project.instrumentId: {project.instrumentId}</b>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex flex-row-reverse py-3">

                    <Button 
                        disabled={  !image }
                        color="primary"
                        variant="solid"
                        data-testid="newProjectBtn"
                        onPress={() =>{ console.debug("go to info");   setCurrent(nextState) }}
                    >Continue</Button>

                    <Button 
                        disabled={ !image }
                        color="secondary"
                        variant="solid"
                        data-testid="newProjectBtn"
                        onPress={() =>{ console.debug("cancel scanning"); router.push('/projects'); }}
                    >Cancel</Button>
                </CardFooter>
            </Card>               
            </>
        )
    }

    const Process = ( nextState: state ) => {
        if ( current != state.end ) {
            return <></>
        }

        return (
            <>
            <Card className="inline-block size-full"
                data-testid="ScanCard"
                >
                <CardBody className="p-6">
                    <div  className="bg-100 p-6">
                        <h1 className="text-center">Processing</h1>
                        <MySpinner />
                        <br/><br/>
                        <div >
                            <Button onClick={() => { router.push('/projects'); }}
                            >Back</Button>
 
                        </div>
                    </div>
                </CardBody>
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
                                <li>Spread the specimens homogeneously, but avoid placing specimens close and parallel to the borders.<br/>
                                The number of objects will be adapted to their size, and it's important to limit the number of touching objects (multiple).</li>
                                <li>Help floating specimens to sink on the glass.</li>
                                <li>Separate the touching objects.</li>
                            </ul>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="flex flex-row-reverse py-3">

                    <Button 
                        disabled={  !image }
                        color="primary"
                        variant="solid"
                        data-testid="newProjectBtn"
                        onPress={() =>{ console.debug("go to Preview");   setCurrent(nextState) }}
                    >Done - Launch Preview</Button>
                </CardFooter>
            </Card>
            </>
        )
    }


    const ThirtySeconds = (nextState: state) => {
        if (  current != state.thirtys1bis ) {
                return <></>
        }
    
        const handleTimerEnd = () => {
            setCurrent(nextState)
        }

        return (
            <Timer initialTime={30} onComplete={handleTimerEnd} />
        )
    }

     const Scan = (step: number, nextState: state) => {
        if (current != state.scan1 && current != state.scan2) {
            return <></>;
        }

        const loaderProps : MyLoaderProps = {
            project: project,
            onChange: onChange,
        };

        const showImage = () => {
            // if (isError) { return <></> }

            return (
            <>
                <div className="flex-row">
                <Image
                    className="height-auto"
                    src={background}
                    alt="uploaded image"
                    height={446}
                />
                </div>

                <Button
                // disabled={isError || isLoading || !image}
                disabled={ !image}
                color="primary"
                variant="solid"
                data-testid="newProjectBtn"
                onPress={() => {
                    setError(null)
                    if (current == state.scan1) {
                    console.debug("go to 30s bis");
                    setBackground(imagePlaceholder)
                    setCurrent(nextState);
                    } else {
                    console.debug("go to onClick");
                    setBackground(imagePlaceholder)
                    // onClick();
                    setCurrent(nextState);
                    }
                }}
                >
                Validate
                </Button>
            </>
            )
        }

        // const onClick = () => {
            
        // }

        return (
        <>
            {/* <h3>Scan {step}</h3> */}
            <Card className="inline-block size-full" data-testid="ScanCard">
            <CardBody>
                <Loader project={project} onChange={onChange} />
                {/* <Loader props={loaderProps} /> */}
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">
                { showImage() }
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
                return Info(state.scan1)
            // case state.preview:
            //     return Preview(state.thirtys1)
            // case state.thirtys1:
            //     return ThirtySeconds(state.scan1)
            case state.scan1:
                return Scan(1,state.thirtys1bis)
            case state.thirtys1bis:
                return ThirtySeconds(state.scan2)
            case state.scan2:
                return Scan(2,state.end)

            case state.end:
                // return Process(project, state.end)
                return Process(/*project,*/ state.end)

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
            console.trace("trace")
                return (
                    // <div className="alert alert-danger" role="alert">
                    //     <h4 className="alert-heading">Error</h4>
                    //     <p>
                    //         {JSON.stringify(error)}
                    //     </p>
                    // </div>
                    <ErrorComponent error={error} />
                );
        }
        return <></>

    }

    return (
        <>
            <Debug params={{...params,current}}/>

            <Timeline_scan current={current+0} list={timelist} />

            {error && showError(error)}
            {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
            {JSON.stringify(error)}

            {/* <div><b>project Id: </b> {projectid}</div>
            <div><b>sample Id: </b> {sampleid}</div>
            <div><b>subsample Id: </b> {subsampleid}</div>
            <div><b>current: </b> {current}</div> */}

            { step(current) }
           
        </>
    )

}

export default BackgroundUpload;

