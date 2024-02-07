"use client"

import { Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/tabs";
import Samples from "./@samples/page";
import Stats from "./@stats/page";
import Scans from "./@scans/page";
import Metadata from "./@metadata/page";
// import Samples from "./@samples/page";

import { FC } from "react";
import { Debug } from "@/Components/Debug";
import { ProjectBreadcrumbs } from "@/components/ProjectBreadcrumbs";

interface pageProps {
    params: {
        projectid: string
    }
}

// const Project = ({ params }: { params: { projectid: string; }} ) => {
const Project : FC<pageProps> = ({params}) => {



    const projectid = params.projectid

    // const projectName = "MOCK ;) Zooscan_ptb_wp2_2021_journee";
    // const projectName = {name: "MOCK_Zooscan_ptb_wp2_2021_journee"};
    // const projectName : Array<string> = [ "MOCK_Zooscan_ptb_wp2_2021_journee" ]; 


    return (
        <div>

            <Card>
                <CardHeader>
                    <h1>Project</h1>
                </CardHeader>
                <CardBody>
                    {/* <h1>{projectName.name}</h1> */}
                    {/* <ProjectBreadcrumbs list={projectName}/> */}
                    <ProjectBreadcrumbs list={[projectid]}  separator="/"/>
                    {/* <h3>{projectid}</h3> */}
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
                <Tab key="samples" title="Samples">
                    <Samples {...params}/>
                    <Debug params={params}/>
                </Tab>
                <Tab key="scans" title="Scans">
                    <Scans  {...params}/>
                </Tab>
            </Tabs>
        {/* </div> */}

    </div>
    );
};

export default Project;
