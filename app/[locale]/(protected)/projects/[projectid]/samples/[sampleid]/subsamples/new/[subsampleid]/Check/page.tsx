
"use server";

import { getProject } from "@/app/api/data/projects";
import { eState } from "../state"
import { Check } from "./Check"
import { getSample } from "@/app/api/data/samples";
import { getSubSample } from "@/app/api/data/subsamples";
import { FC } from "react";


type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}


const CheckNewScanPage : FC<pageProps> = async ({params}) => {


    const {projectid, sampleid, subsampleid} = params;

    const project = await getProject(projectid);
    const sample = await getSample(projectid, sampleid);
    const subsample = await getSubSample(projectid, sampleid, subsampleid);

    function setCurrent(current:eState) {return current+1;}

    return (
        <>
        Check Page
        </>
    )

}

export default CheckNewScanPage;

