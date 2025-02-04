"use client"


import { Sample, SubSample } from "@/app/api/network/interfaces";
import { MyImage } from "@/components/myImage";
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

    return (
        <>
            <h1>View Page</h1>
            <h3>{subsample.scan[0].url}</h3>
            <MyImage src={subsample.scan[0].url} legend="RAW" />

        </>
    )

}
export default ViewPage