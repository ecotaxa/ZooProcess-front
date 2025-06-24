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
import { useTranslations } from 'next-intl' ;



// export function ProjectTabs({ project, params,translate }:{project:Project, params:any, translate:any}) {
export function ProjectTabs({ project, params }:{project:Project, params:any}) {
  const t = useTranslations();

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
      <Tab key="stats" title={t("ProjectPageStats.Title")}>
        <Stats project={project} {...params}  />
      </Tab>
      <Tab key="metadata" title={t("ProjectPage_Metadata.Title")}>
        <Metadata project={project} {...params} />
      </Tab>
      <Tab key="samples" title={t("ProjectPage_Samples.Title")}>
        <SamplesTab {...params} />
        <Debug params={params} />
      </Tab>
      <Tab key="background" title={t("ProjectPage_Backgrounds.Tab")}>
        <BackgroundScans {...params} />
      </Tab>
      <Tab key="scans" title={t("ProjectPage_Scans.Title")}>
        <Scans {...params} />
      </Tab>
      <Tab key="qc" title={t("ProjectPage_QC.Title")}>
        <QC {...params} />
      </Tab>
    </Tabs>
  );

}
