"use client";

import { Debug } from "@/Components/Debug"
import { Timeline_scan } from "@/components/timeline-scan";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { FC, useState } from "react"
import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
import { useProject } from "@/app/api/projects";
import { MySpinner } from "@/components/mySpinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { addBackground } from "@/app/api/network/zooprocess-api";


type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}



const ScanPage : FC<pageProps> = ({params}) => {

    const router = useRouter();
    const {projectid, sampleid, subsampleid} = params;
    const {project, isError, isLoading} = useProject(projectid);
    const [image , setImage] = useState(false);

    const onClick = () => {
        console.log("validate scan")
        if ( image ) {
            const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${subsampleid}/process/?image=${image}`
            console.log("path: " , path)
            router.push(path)
        }
    };

    const onChange = async (value:any) => {
        console.log("New scan onChange:", value)

        // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
        // stringifiedData = JSON.stringify(value, null, 2);

        // POUR AFFICHAGE DEBUG
        // setData(JSON.stringify(value, null, 2))
        // console.log("App onChange:", stringifiedData);


        return await addBackground(value)
        .then((response) => {
            console.log("response: ", response)
            setImage(response.id)
            console.log("Go To the next page" )
            // router.push(`${response.id}`)
        })
        .catch((error) => {
            return Promise.reject(error)
        })
    }


    const Loader = () => {
        if ( isLoading ) { return <MySpinner /> }
        if ( isError ) { return <ErrorComponent  error={isError}/> }

        console.log("project: ", project)

        const props = {
            // projectid: projectid,
            // sampleid: sampleid,
            // subsampleid: subsampleid,
            instrumentId: project.instrumentId,
        }

        return (
            <>
                <Debug params={project}/>
                <div><b>instrument Id: </b> {project.instrumentId}</div>
                <Debug params={props}/>
                <FileUploader instrumentId={project.instrumentId} onChange={onChange} />
            </>
        )
    }

    return (
        <>
            <Debug params={params}/>

            <Timeline_scan current={2} />

            <Card className="inline-block size-full"
                data-testid="projectCard" 
                >
                <CardBody>
                    <div><b>project Id: </b> {projectid}</div>
                    <div><b>sample Id: </b> {sampleid}</div>
                    <div><b>subsample Id: </b> {subsampleid}</div>

                    <Loader />
                </CardBody>

                <CardFooter className="flex flex-row-reverse py-3">
                    <Button 
                        disabled={ isError || isLoading || !image }
                        color="primary"
                        // showAnchorIcon
                        variant="solid"
                        data-testid="newProjectBtn"
                        // >Scan {actions[nextAction(action)]}</Button>
                        onPress={onClick}
                    >Scan</Button>
                </CardFooter>

            </Card>

        </>
    )

}

export default ScanPage;

