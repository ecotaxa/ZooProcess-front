// "use client"

// import { Card, CardBody, CardHeader, Spacer } from "@heroui/react";
// import { Tab, Tabs } from "@heroui/tabs";
// import SamplesTab from "./@samples/page";
// import Stats from "./@stats/page";
// import Scans from "./@scans/page";
// import Metadata from "./@metadata/page";
// import BackgroundScans from "./@background/page";

// import Samples from "./@samples/page";

import { FC } from 'react';

// import { useHash } from '@/lib/useHash'
// import * as api from "@/app/api/network/zooprocess-api";
import { ProjectTabs } from './ProjectTabs';
import { getProject } from '@/app/api/data/projects';
import { Project } from '@/app/api/network/interfaces';

interface pageProps {
  params: {
    projectid: string;
  };
}

const ProjectPage: FC<pageProps> = async ({ params }) => {
  console.log('params:', params);

  // const useHash = () => { (typeof window != 'undefined' ? decodeURIComponent(window.location.hash.replace('#','')) : undefined)}

  const projectid = params.projectid;

  const t = await getTranslations('ProjectPage');

  const project: Project = await getProject(projectid);

  const p: Project = project as Project;

  const isQcTabDisabled = () => {
    if (p.samples && p.samples.length > 0) {
      return;
    }

    return 'qc';
  };

  return (
    <div>
      {/* <ProjectName id={projectid} /> */}
      <div>
        <h1>{t('Title')}</h1>
        <br />
        <h1>{project.name}</h1>
      </div>

      {/* <Card>
        <CardHeader>
          <h1>Project</h1>
        </CardHeader>
        <CardBody>
          <ProjectBreadcrumbs list={[projectid]} separator="/" />
        </CardBody>
      </Card>
      <Spacer y={20} /> */}
      {/* <Debug params={params} /> */}
      <ProjectTabs project={project} params={params} />

      {/* <Tabs aria-label="Options" disabledKeys={isQcTabDisabled()} defaultSelectedKey={selectedKey}>
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

      </Tabs> */}
    </div>
  );
};
export default ProjectPage;
