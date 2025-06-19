"use server"

import { Card, CardBody, CardHeader, Spacer } from "@heroui/react";

import { FC } from "react";
import { Debug } from "@/components/Debug";
import { ProjectBreadcrumbs } from "@/components/ProjectBreadcrumbs";
import { Sample } from "@/app/api/network/interfaces";
import { getSample } from "@/app/api/data/samples";

import { SampleTabs } from "./SampleTabs";

interface pageProps {
    params: {
        projectid: string,
        sampleid: string
    }
}

const SamplePage : FC<pageProps> = async ({params}) => {



    const projectid = params.projectid
    const sampleid = params.sampleid


    const sample : Sample = await getSample(projectid,sampleid);
 

    return (
        <div>
{/* 
            <Card>
                <CardHeader>
                    <h1>Project</h1>
                </CardHeader>
                <CardBody>
                    <Debug params={sample} title="Sample" />
                    <h1>{projectName}</h1> 
                     <h3>{projectid}</h3>
                    <h3>{sampleid}</h3>
                    <h3>{sample.project.name} / {sample?sample.name:"Sample"}</h3>
                    <ProjectBreadcrumbs list={[projectid, sampleid]}  separator="/"/>
                    <ProjectBreadcrumbs list={[sample.project.name, sample.name]}  separator="/"/> 
                </CardBody>
            </Card>
            <Spacer y={20}/>  */}


        <SampleTabs sample={sample} params={params}/>

    </div>
    );
};

export default SamplePage;
