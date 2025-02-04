import { Project, Sample, SubSample } from "@/app/api/network/interfaces"
import { Debug } from "@/components/Debug"
import FileUploader from "@/components/FileUploader"
import { FC } from "react"




export interface MyLoaderProps {
    // instrumentId: string,
    project: Project|any,
    // sample: Sample,
    // subsample: SubSample,
    // sampleid: number,
    // subsampleid: number,
    onChange: (value: string) => void,
}

export const Loader : FC<MyLoaderProps> = (props:MyLoaderProps) => {
    // if ( isLoading ) { return <MySpinner /> }
    // if ( isError ) { return <ErrorComponent error={isError}/> }

    // const { project, sample, subsample, onChange } = props    
    const { project /* sample, subsample*/, onChange } = props    

    console.debug("project: ", props)
    console.debug("project ID: ", props.project.id)
    console.debug("instrumentId: ", props.project.instrumentId)
    // console.debug("sample: ", sample)
    // console.debug("subsample: ", subsample)

    if ( props.project.instrumentId === "undefined" ) {
        console.debug("props.project.instrumentId === undefined")
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
            {/* <div><b>project: </b> {JSON.stringify(project)}</div> */}
            <div><b>project Id: </b> {props.project.id}</div>
            <div><b>instrument Id: </b> {props.project.instrumentId}</div>
            {/* <div><b>instrument Id JS: </b> {JSON.stringify(props.project.instrumentId)}</div> */}
            {/* <Debug params={props}/> */}
            {/* <FileUploader instrumentId={instrumentId} projectId={props.project.id} sampleId={sample.id} subsampleId={subsample.id} onChange={onChange} /> */}
            <FileUploader instrumentId={instrumentId} projectId={props.project.id} onChange={onChange} />
            {/* <FileUploader instrumentId={project.instrumentId} image={imageRGB} onChange={onChange} /> */}
        </>
    )
}

