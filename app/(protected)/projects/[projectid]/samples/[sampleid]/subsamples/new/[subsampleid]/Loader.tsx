import { Project } from "@/app/api/network/interfaces"
// import { Debug } from "@/components/Debug"
import FileUploader from "@/components/FileUploader"
import { FC } from "react"




export interface MyLoaderProps {
    project: Project|any,
    onChange: (value: string) => void,
}

export const Loader : FC<MyLoaderProps> = (props:MyLoaderProps) => {
  

    const { project, onChange } = props    

    console.debug("project: ", props)
    console.debug("project ID: ", props.project.id)
    console.debug("instrumentId: ", props.project.instrumentId)

    if ( props.project.instrumentId === "undefined" ) {
        console.debug("props.project.instrumentId === undefined")
        return <div>No instrument</div>
    }
    const instrumentId : string = props.project.instrumentId + "" //|| "" // + "" to force type string because test it before then existing



    return (
        <div className="relative w-full border-b pb-4 mb-4">
            {/* <div className="absolute top-0 right-0 z-10 max-w-[700px]">
                <Debug params={project} title="Loader debug" open={false}/>
            </div> */}
            
            {/* <div className="flex flex-col space-y-2">
                <div><b>project Id: </b> {props.project.id}</div>
                <div><b>instrument Id: </b> {props.project.instrumentId}</div>
            </div> */}
            
            <div className="mt-4">
                <FileUploader instrumentId={instrumentId} projectId={props.project.id} onChange={onChange} />
            </div>
        </div>
    )

}

