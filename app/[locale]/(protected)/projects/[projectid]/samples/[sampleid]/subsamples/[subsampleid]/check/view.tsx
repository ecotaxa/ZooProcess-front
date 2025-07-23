"use client"


// import showBackgroundScan from "@/app/(protected)/projects/[projectid]/background/[backgroundId]/page";
import { Sample, SubSample } from "@/app/api/network/interfaces";
import { MyImage } from "@/components/myImage";
// import Link from "next/link";
import { Card, CardBody, CardHeader, Spacer, Link, CardFooter, Button } from "@heroui/react";

import { FC, useEffect, useState } from "react";
import { Debug } from "@/components/Debug";


interface pageProps {
    // params:{
        sample: Sample,
        subsample: SubSample,
    // }
}

const ViewPage: FC<pageProps> = ({sample, subsample}) => {

    console.log("sample: ", sample)
    console.log("subsample: ", subsample)

    const [background,setBackground] = useState<any|null>(null)
    const [mask,setMask] = useState<any|null>(null)

    const hasScanData = subsample && subsample.scan && subsample.scan.length > 0;

    const vignettesUrl = `/project/${sample.projectId}/sample/${sample.id}/subsample/${subsample.id}/vignettes`;

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

    // useEffect(() => {
    //     const background = findScan('MEDIUM_BACKGROUND') // findBackground();
    //     if (background) setBackground(background)
    //     const mask = findScan('MASK')
    //     if ( mask ) setMask(mask)
    // },[])

    useEffect(()=>{
        const groupedByType = subsample.scan.reduce((acc, scan) => {
            if (!acc[scan.type]) {
                acc[scan.type] = [];
            }
            acc[scan.type].push(scan);
            return acc;
        }, {} as Record<string, typeof subsample.scan>);

        const mediumBackgrounds = groupedByType['MEDIUM_BACKGROUND'];
        const scans = groupedByType['SCAN'];
        const masks = groupedByType['MASK'];

        if (mediumBackgrounds) setBackground(mediumBackgrounds[0])
        if ( masks ) setMask(masks[0])

    },[])

// const findScan = (type: string) => {
//         if (!hasScanData) {
//             console.error("Subsamples has no scan linked to it")
//             return null;
//         }

//         const back = subsample.scan.filter(scan => scan.type === type)
//         console.debug(`nb scan of type ${type} : ${back.length}`)
//         console.debug( `scan of type ${type} : ${back}`)
//         return back.length > 0 ? back[0] : null;
//     }

    // const findBackground = () => {
    //     if (!hasScanData) {
    //         return null;
    //     }

    //     const back = subsample.scan.filter(scan => scan.type === 'MEDIUM_BACKGROUND')
    //     return back.length > 0 ? back[0] : null;
    // }


     

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
                        Choose background
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
 


                    </div>
                </CardBody>
                <CardFooter>
                        <Button as={Link} href="./vignettes" className="bg-primary text">Go to Vignettes</Button>
                </CardFooter>
            </Card>
        <section>
            <Debug params={sample} title="sample" pre={true} open={false}/>
            <Debug params={subsample} title="subsample" pre={true} open={false}/>
            <Debug params={ subsample.scan } title="scan" pre={true} open={false}/>

            <Debug params={background} title="background" pre={true}/>
            <Debug params={backgroundURL} title="backgroundURL" pre={false}/>
        </section>
        </>
    ) 

}
export default ViewPage