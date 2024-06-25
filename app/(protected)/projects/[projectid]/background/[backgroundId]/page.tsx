"use client";

import { useGetScan } from "@/app/api/background";
import { Background } from "@/app/api/network/zooprocess-api";
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

    const projectId = params.projectid ;
    const backgroundId = params.params.backgroundId ;
    console.log("Metadata params: ", params);
    console.log("Metadata params projectid: ", params.params.projectid);
    console.log("Metadata params backgroundId: ", params.params.backgroundId);
    console.log("Metadata params projectid: ", projectId);
    // console.log("Metadata params backgroundId: ", backgroundId);
    
    
    const {scan, isLoading, isError} = useGetScan(backgroundId)

    
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

        return ( 
            <>
                <Image src={path} />
            </>
        )
    }

    // const scanProps : MyScanProps = {scan}

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
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


