'use client'

import { Tab, Tabs } from "@heroui/react";
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
import { useSearchParams } from "next/navigation";

export function SampleTabs({ sample, params }:{sample:Sample, params:any}) {

//   const isQcTabDisabled = (p: Project): string[] => {
//     if (p.samples && p.samples.length > 0) {
//       return [];
//     }
//     return ['qc'];
//   };

    const searchParams = useSearchParams()
    const state = searchParams.get('state') 
    console.debug("state:",state)

  let selectedKey="stats"
  // if ( state && state == "stats" || state == "metadata" || state == "subsamples") {selectedKey = state}

  // const hash = useHash().replace('#','')
  // console.log("path:",hash)

  // switch (hash){ 
  switch (state){ 
    case "stats":
    case "stat":
      selectedKey = "stats"
    case "metadata":
      selectedKey = "metadata"
    case "subsamples":
    case "subsample":
    case "scans":
    case "scan":
      selectedKey = "subsamples"
  }

  console.debug(" selectedKey:", selectedKey)

  return (
    // <Tabs aria-label="Sample tabs" disabledKeys={isQcTabDisabled(project)} defaultSelectedKey={selectedKey}>
    <Tabs aria-label="Sample tabs" defaultSelectedKey={selectedKey}>
      <Tab key="stats" title="Stats" >
          <Stats sample={sample}  {...params}/>
      </Tab>
      <Tab key="metadata" title="Metadata" >
          <Metadata sample={sample}  {...params}/>
      </Tab>
      <Tab key="subsamples" title="Sub Samples">
          <SubSamples sample={sample} {...params}/>
          <Debug params={params}/>
      </Tab>
    </Tabs>
  );

}
