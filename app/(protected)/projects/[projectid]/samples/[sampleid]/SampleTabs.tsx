'use client'

import { Tab, Tabs } from "@nextui-org/react";
import Metadata from "./@metadata/page";
import Stats from "./@stats/page";
// import * as api from '@/app/api/network/zooprocess-api'
// import QC from "./@qc/page";
// import Scans from "./@scans/page";
// import BackgroundScans from "./@background/page";
import { Debug } from "@/components/Debug";
import { useHash } from "@/lib/useHash";
import { Project, Sample } from "@/app/api/network/interfaces";
import SubSamples from "./@subsamples/page";

export function SampleTabs({ sample, params }:{sample:Sample, params:any}) {

//   const isQcTabDisabled = (p: Project): string[] => {
//     if (p.samples && p.samples.length > 0) {
//       return [];
//     }
//     return ['qc'];
//   };

  let selectedKey="stats"

  const hash = useHash().replace('#','')
  console.log("path:",hash)

  switch (hash){ 
    case "stats":
    case "metadata":
    case "subsamples":
    // case "background":
    // case "scans":
    // case "qc":
      selectedKey = hash
  }
  return (
    // <Tabs aria-label="Sample tabs" disabledKeys={isQcTabDisabled(project)} defaultSelectedKey={selectedKey}>
    <Tabs aria-label="Sample tabs" defaultSelectedKey={selectedKey}>
      <Tab key="stats" title="Stats" >
          <Stats sample={sample}  {...params}/>
      </Tab>
      <Tab key="metadata" title="Metadata" >
          <Metadata sample={sample}  {...params}/>
      </Tab>
      <Tab key="samples" title="Sub Samples">
          <SubSamples sample={sample} {...params}/>
          <Debug params={params}/>
      </Tab>
    </Tabs>
  );

}
