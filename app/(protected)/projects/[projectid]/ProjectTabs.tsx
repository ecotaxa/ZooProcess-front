'use client'

import { Tab, Tabs } from "@heroui/react";
import Metadata from "./@metadata/page";
import Stats from "./@stats/page";
// import * as api from '@/app/api/network/zooprocess-api'
import QC from "./@qc/page";
import Scans from "./@scans/page";
import BackgroundScans from "./@background/page";
import SamplesTab from "./@samples/page";
import { Debug } from "@/components/Debug";
import { useHash } from "@/lib/useHash";
import { Project } from "@/app/api/network/interfaces";

export function ProjectTabs({ project, params }:{project:Project, params:any}) {

  const isQcTabDisabled = (p: Project): string[] => {
    if (p.samples && p.samples.length > 0) {
      return [];
    }
    return ['qc'];
  };

  let selectedKey="stats"

  const hash = useHash().replace('#','')
  console.log("path:",hash)

  switch (hash){ 
    case "stats":
    case "metadata":
    case "samples":
    case "background":
    case "scans":
    case "qc":
      selectedKey = hash
  }
  return (
    <Tabs aria-label="Project tabs" disabledKeys={isQcTabDisabled(project)} defaultSelectedKey={selectedKey}>
      <Tab key="stats" title="Stats">
        <Stats project={project} {...params} />
      </Tab>
      <Tab key="metadata" title="Metadata">
        <Metadata project={project} {...params} />
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
  );

}
