import { Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/tabs";
import Samples from "./samples/page";
import Stats from "./stats/page";
import Scans from "./scans/page";
import Metadata from "./metadata/page";
// import Samples from "./@samples/page";

import { FC } from "react";

interface pageProps {
    params: {projectid: string}
}

// const Project = ({ params }: { params: { projectid: string; }} ) => {
const Project : FC<pageProps> = ({ params }) => {

    const projectid = params.projectid

    const projectName = "Zooscan_ptb_wp2_2021_journee";

    return (
        <div>

            <Card>
                <CardHeader>
                    <h1>Project</h1>
                </CardHeader>
                <CardBody>
                    <h1>{projectName}</h1>
                </CardBody>
            </Card>
            <Spacer y={20}/>
        {/* <div className="flex w-full flex-col"> */}
            {/* <Tabs aria-label="Options"> */}
                {/* <Tab key="stats" title="Stats"> */}
                    <Stats/>
                {/* </Tab> */}
                {/* <Tab key="metadata" title="Metadata" href={`/projects/${projectid}/metadata`}> */}
                    <Metadata/>
                {/* </Tab> */}
                {/* <Tab key="samples" title="Samples"> */}
                    <Samples params={params}/>
                {/* </Tab> */}
                {/* <Tab key="scans" title="Scans"> */}
                    <Scans/>
                {/* </Tab> */}
            {/* </Tabs> */}
        {/* </div> */}

    </div>
    );
};

export default Project;
