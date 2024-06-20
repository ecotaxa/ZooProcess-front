"use client";

import { Debug } from "@/components/Debug"
import { Timeline_scan } from "@/components/timeline-scan";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { FC } from "react"
// import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
// import { useProject } from "@/app/api/projects";
// import { MySpinner } from "@/components/mySpinner";
// import { ErrorComponent } from "@/components/ErrorComponent";


type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}



const InfoPage : FC<pageProps> = ({params}) => {

    const router = useRouter();
    const { projectid, sampleid, subsampleid } = params


    function onPress() {
        // router.push("../scan");
        const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${subsampleid}/scan`
        router.push(path)
    }

    return (
        <>

        <Timeline_scan current={0.5} />

        <div className="text-start w-">
            <h1>You are about to scan a sample with the Zooscan</h1>
            <ul className="list-disc  text-lm text-start">
                <li>Clean the Zooscan tray.</li>
                <li>Pour a small amount of water into the tray (salt or fresh)</li>
                <li>Place the suitable frame (LARGE/NARROW) on the glass ans adjust its position.</li>
                <li>Add the sample</li>
                <li>Adjust the water level just above the first step of the transparent frame (the meniscus must be above the step)</li>
                <li><span>Spread the specimens homogeneously, but avoid placing specimens close and parallel to the borders. <br/>
                    The number of objects will be adapted to their size, and it's important to limit the number of touching objects (multiple).</span></li>
                <li>Help floating specimens to sink on the glass.</li>
                <li>Separate the touching objects.</li>
            </ul>

        </div>        
        <div>
            <Button onPress={onPress} color="primary">DONE</Button>
        </div>
        </>
    )

}


export default InfoPage;
