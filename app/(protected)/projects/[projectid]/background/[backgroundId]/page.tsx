"use client";

import {  useShowScan } from "@/app/api/background";
// import { converttiff2jpg } from "@/app/api/convert";
import { Background } from "@/app/api/network/zooprocess-api";
import { Debug } from "@/components/Debug";
import { ErrorComponent } from "@/components/ErrorComponent";
import { MySpinner } from "@/components/mySpinner";
import { pathToSessionStorage } from "@/lib/gateway";
import { Card, CardBody, CardHeader, Image, Spacer } from "@nextui-org/react";
import { FC } from "react";


interface pageProps {
    
        projectid: string,
        backgroundId: string,
}


// const showBackgroundScan : FC<pageProps> = ({projectid, backgroundId}) => {
const showBackgroundScan : FC<pageProps> = (params) => {

    const projectId = params.params.projectid ;
    const backgroundId = params.params.backgroundId ;
    console.log("Metadata params: ", params);
    console.log("Metadata params projectid: ", params.params.projectid);
    console.log("Metadata params backgroundId: ", params.params.backgroundId);
    console.log("Metadata params projectid: ", projectId);
    // console.log("Metadata params backgroundId: ", backgroundId);
    
    
    const {scan, isLoading, isError} = useShowScan(backgroundId)

    
    interface MyScanProps {
        scan: Background|any,
    }

    // const showImage = (scan: Background) => {
    const ShowImage : FC<MyScanProps> = (props: MyScanProps) => {
        if ( isLoading ) { return <MySpinner /> }
        if ( isError ) { return <ErrorComponent error={isError}/> }

        if ( props.scan.url === "undefined" ) {
            console.log("scan.url === undefined")
            return <div>No scan</div>
        }


        let path = props.scan.url
        if ( path.substring(0, 1) != '/' ) {
            // path = path.substring(1)
            // path = "/Users/sebastiengalvagno/" + path
            path = "/" + path
        }

        // let locapPath = undefined // pathToSessionStorage(path, "/")
        let locapPath = pathToSessionStorage(path, "/")
       
            // const scanProps : MyScanProps = {scan}
        // const ttt = async (path:string) => {
        // try {
            // return await converttiff2jpg(path)
            // let locapPath = await converttiff2jpg(path)
            //     .then(async (response:Response) => {
            //         console.log("converttiff2jpg response: ", response)
            //         response.text()
            //         .then(async (imageUrl) => {
            //             // show the converted image
            //             // setImageUrl(imageUrl);
            //             console.log("imageUrl: ", imageUrl)
            //             // if ( imageUrl[0] == '"' ) {
            //             //     console.error("arrrggggggggg !!!!!")
            //             //     imageUrl=imageUrl.substring(1)
            //             // }
            //             // console.debug("imageUrl[-1]: ", imageUrl[-1])
            //             // if ( imageUrl[-1] == '"'){
            //             //     console.error("arrrggggggggg !!!!!")
            //             //     imageUrl=imageUrl.substring(0,imageUrl.length-1)
            //             // }
            //             // const
            //             const locapPath = pathToSessionStorage(imageUrl)
            //             console.log("localPath: ", locapPath)
            //             // setBackground(localPath)
            //             return locapPath
            //         })
            //         .catch((error) => {
            //             console.error("addBackground catch error: ", error)
            //             // return Promise.reject(error)
            //             // return <div>Error: {error}</div>
            //             return undefined
            //         })
            //     })
            //     .catch(error => {
            //         return undefined                    
            //     })
        // }
        // catch (error:any) {
        //     return <div>Error: {error}</div>
        // }

    // }

    // const localPath = ttt(path)

        if ( locapPath == undefined){
            return <div>Error: Cannot convert the scan</div>
        }

        return (
            <>
                <Image src={locapPath} />
                <h2>path: {path}</h2>
                <h2>localpath: {locapPath}</h2>
            </>
        )
    }


    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Debug params={scan} title="scan" />
        <h3>params: {JSON.stringify(params)}</h3>
        <h3>projectId: {projectId}</h3>
        <h3>backgroundId: {backgroundId}</h3>
        <div className="text-center justify-center">
            <Spacer y={5}/>
            <Card className="inline-block "
                    data-testid="backgroundCard" 
                >
                <CardHeader className="flex flex-row py-3">
                    <div>
                    </div>
                </CardHeader>
                <CardBody>
                    {/* {scan && showImage(scanProps)} */}
                    <ShowImage scan={scan} />
                </CardBody>

            </Card> 

        </div>
    </section>

    );
};

export default showBackgroundScan;


