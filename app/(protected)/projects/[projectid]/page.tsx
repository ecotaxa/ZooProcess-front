"use client"

import { Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import { Tab, Tabs } from "@nextui-org/tabs";
import SamplesTab from "./@samples/page";
import Stats from "./@stats/page";
import Scans from "./@scans/page";
import Metadata from "./@metadata/page";
import BackgroundScans from "./@background/page";

// import Samples from "./@samples/page";

import { FC } from "react";
import { Debug } from "@/components/Debug";
import { ProjectBreadcrumbs } from "@/components/ProjectBreadcrumbs";
import { ProjectName } from "@/components/projectName";
import QC from "./@qc/page";
import { useProject } from "@/app/api/projects";
import { Project } from "@/app/api/network/zooprocess-api";
import { useParams, usePathname } from "next/navigation";

import { useHash } from '@/lib/useHash'

interface pageProps {
    params: {
        projectid: string
    }
}

// const Project = ({ params }: { params: { projectid: string; }} ) => {
const ProjectPage: FC<pageProps> = ({ params }) => {

  console.log("params:", params)

  // const useHash = () => { (typeof window != 'undefined' ? decodeURIComponent(window.location.hash.replace('#','')) : undefined)}

  const projectid = params.projectid;

  const hash = useHash().replace('#','')
  console.debug("path:",hash)

  const { project, isLoading, isError } = useProject(projectid);

  let selectedKey="stats"
  // const selectedKey = path

  switch (hash){ 
    case "stats":
    case "metadata":
    case "samples":
    case "background":
    case "scans":
    case "qc":
      selectedKey = hash
  }


  const p: Project = project;

  
  const isQcTabDisabled = () => {
    if (p.samples && p.samples.length > 0) {
      return ;
    }

    return "qc";
  };

  return (
    <div>
      <ProjectName id={projectid} />

      {/* <Card>
        <CardHeader>
          <h1>Project</h1>
        </CardHeader>
        <CardBody>
          <ProjectBreadcrumbs list={[projectid]} separator="/" />
        </CardBody>
      </Card>
      <Spacer y={20} /> */}
      <Debug params={params} />
      <Tabs aria-label="Options" disabledKeys={isQcTabDisabled()} defaultSelectedKey={selectedKey}>
        <Tab key="stats" title="Stats">
          <Stats {...params} />
        </Tab>
        <Tab key="metadata" title="Metadata">
          <Metadata {...params} />
        </Tab>
        <Tab key="samples" title="Samples">
          <SamplesTab {...params} />
          <Debug params={params} />
        </Tab>
        <Tab key="background" title="Background Scans">
          <BackgroundScans {...params} />
        </Tab>
        <Tab key="scans" title="Scans">
          <Scans {...params} />
        </Tab>
        <Tab key="qc" title="QC">
          <QC {...params} />
        </Tab>

      </Tabs>
    </div>
  );
};

export default ProjectPage;
