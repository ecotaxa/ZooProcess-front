"use server"


import { FC } from "react";
import { Sample } from "@/app/api/network/interfaces";
import { getSample } from "@/app/api/data/samples";

import { SampleTabs } from "./SampleTabs";

interface pageProps {
    params: {
        projectid: string,
        sampleid: string
    },
    searchParams: {
        state?: string
    }
}

const SamplePage : FC<pageProps> = async ({params, searchParams}) => {



    const projectid = params.projectid
    let sampleid = params.sampleid
    // let state = undefined
    // // remove &wwwww at the end od sampleid
    // const cleanedsampleid = sampleid.replace(/&$/,'')

    // console.debug("😤😤😤😤😤😤😤😤😤 🔥🔥🔥🔥🔥 sampleid:",sampleid )

    //  // Extraire l'état du sampleid si nécessaire
    // if (sampleid.includes('&state=')) {
    //     const parts = sampleid.split('&state=');
    //     sampleid = parts[0];
    //     state = parts[1];
    // }

    // console.debug("😤😤😤😤😤😤😤😤😤 🔥🔥🔥🔥🔥 cleaned sampleid:",sampleid)
    // console.debug("😤😤😤😤😤😤😤😤😤 🔥🔥🔥🔥🔥 state:",state)

    // console.log("Sample ID:", sampleid);
    // console.log("State:", state);
    
    const sample : Sample = await getSample(projectid, sampleid);
    // const sample : Sample = await getSample(projectid, cleanedsampleid);

    // const sample_str = JSON.stringify(sample,null,2)

    return (
        <div>
            <h1>{sample.name}</h1>
        <SampleTabs sample={sample} params={params}/>
    </div>
    );
};

export default SamplePage;
