"use client"

import { Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/tabs";
import SubSamples from "./@subsamples/page";
import Stats from "./@stats/page";
import Metadata from "./@metadata/page";
// import Samples from "./@samples/page";

import { FC } from "react";
import { Debug } from "@/Components/Debug";
import { ProjectBreadcrumbs } from "@/components/ProjectBreadcrumbs";

interface pageProps {
    params: {
        projectid: string,
        sampleid: string
    }
}

// const Project = ({ params }: { params: { projectid: string; }} ) => {
const Project : FC<pageProps> = ({params}) => {



    const projectid = params.projectid
    const sampleid = params.sampleid

    // const projectName = "MOCK ;) Zooscan_ptb_wp2_2021_journee";

    return (
        <div>

            <Card>
                <CardHeader>
                    <h1>Project</h1>
                </CardHeader>
                <CardBody>
                    {/* <h1>{projectName}</h1>
                    <h3>{projectid}</h3>
                    <h3>{sampleid}</h3> */}
                    <ProjectBreadcrumbs list={[projectid, sampleid]}  separator="/"/>

                </CardBody>
            </Card>
            <Spacer y={20}/>
            <Debug params={params}/>
        {/* <div className="flex w-full flex-col"> */}
            <Tabs aria-label="Options">
                {/* <Tab key="stats" title="Stats" href={`/projects/${projectid}/stats`}> */}
                <Tab key="stats" title="Stats" >
                    <Stats/>
                </Tab>
                {/* <Tab key="metadata" title="Metadata" href={`/projects/${projectid}/metadata`}> */}
                <Tab key="metadata" title="Metadata" >
                    <Metadata  {...params}/>
                </Tab>
                <Tab key="samples" title="Sub Samples">
                    <SubSamples {...params}/>
                    <Debug params={params}/>
                </Tab>
            </Tabs>
        {/* </div> */}

    </div>
    );
};

export default Project;
