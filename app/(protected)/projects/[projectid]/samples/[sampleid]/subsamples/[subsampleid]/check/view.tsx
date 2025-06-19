"use client"


import showBackgroundScan from "@/app/(protected)/projects/[projectid]/background/[backgroundId]/page";
import { Sample, SubSample } from "@/app/api/network/interfaces";
import { MyImage } from "@/components/myImage";
// import Link from "next/link";
import { Card, CardBody, CardHeader, Spacer, Link, CardFooter } from "@heroui/react";

import { FC } from "react";

interface pageProps {
    // params:{
        sample: Sample,
        subsample: SubSample,
    // }
}

const ViewPage: FC<pageProps> = ({sample, subsample}) => {

    console.log("sample: ", sample)
    console.log("subsample: ", subsample)

    const hasScanData = subsample && subsample.scan && subsample.scan.length > 0;

    const showScanList = () => {

        if (!hasScanData) {
            return null;
        }

        return (
            <div>
                <ul>
                    { subsample && subsample.scan && subsample.scan.map((scan, index) => (
                        <li key={index}>
                            {scan.type} | {scan.url}
                        </li>
                    ))}
                </ul>
            </div>
        )

    }

    const findBackground = () => {
        if (!hasScanData) {
            return null;
        }

        const back = subsample.scan.filter(scan => scan.type === 'MEDIUM_BACKGROUND')
        return back.length > 0 ? back[0] : null;
    }
     const background = findBackground();

     const backgroundURL = `/background?instrument=${sample.project}&backurl=/projects/{projectid}/samples/${sample.id}?state=subsamples`

    // extract the file name from the url
    const extractFileName = (url:string) => {
        const parts = url.split('/');
        const fileName = parts.pop();
        return fileName;
    }


    const showScan = () => {
        if (!hasScanData) {
            return (
                <p>No scan data available for this subsample.</p>
            )
        }

        return (
            <div>
                <h3 className="text-lg font-semibold truncate">{extractFileName(subsample.scan[0].url)}</h3>
                <MyImage src={subsample.scan[0].url} legend="RAW" />
            </div>
        )
    }

    const showBackgroundScan = () => {
        if (!hasScanData) { return null;}
        if (!background) { 
            return (
                <div>
                    <p className="mb-4">No background image found.</p>
                    <Link 
                        href={backgroundURL}
                        className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                        Choose one
                    </Link>
                </div>
            )
        }

        return (
            <div>
                <h3 className="text-lg font-semibold truncate">{extractFileName(background.url)}</h3>
                <MyImage src={background.url} legend="BACKGROUND" />
            </div>
        )


    }

    return (
        <>
            <Card>
                <CardHeader>
                    <h1>View Page</h1>
                      <div>
                        { subsample.scan.length } images associated
                    </div>
                    {showScanList()}
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1">
                        {showScan()}
                        {showBackgroundScan()}
 

                        <Link href="./vignettes" className="bg-primary text">Go to Vignettes</Link>

                    </div>
                </CardBody>
                <CardFooter>

                </CardFooter>
            </Card>
        </>
    ) 

}
export default ViewPage