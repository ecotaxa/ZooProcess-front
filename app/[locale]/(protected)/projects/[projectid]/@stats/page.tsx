"use client"

import { Spacer } from "@heroui/react";


import {  ArrowDownTrayIcon, CloudIcon, PlusIcon } from "@heroicons/react/20/solid";
import React, { FC } from "react";
import { BoxMessage } from "@/components/BoxMessage";
import { Debug } from "@/components/Debug";
import { Project } from "@/app/api/network/interfaces";
import { useTranslations } from 'next-intl' ;

// interface IBoxMessage {
//     children : any // React.ReactNode //React.RefAttributes<SVGSVGElement>
//     title : String
//     subtitle : String
//     href : String|undefined
// }

interface pageProps {
      project: Project
  }

const Stats: FC<pageProps> = (params) => {
  console.log("Metadata params: ", params);
  const t = useTranslations('ProjectPageStats');

  const projectEmpty = (p:Project) => {
    if (p.samples && p.samples.length != 0) {
      return <></>;
    }

          const title=t("Title")

    return (
      <>
        <BoxMessage
          title={t("Box_Sample_Title")}
          subtitle={t("Box_Sample_SubTitle")}
          button={{
            href: `/projects/${params.project.id}/new`,
            text: t("Box_Sample_Button")
          }}
        >
          <PlusIcon />
        </BoxMessage>

        <Spacer y={10} />

        <BoxMessage
            title={t("Box_Scan_Title")}
          subtitle={t("Box_Scan_Subtitle")} 
          button={{
            href: "/projects/new",
            text: t("Box_Scan_Button")
          }}
        >
          <ArrowDownTrayIcon />
        </BoxMessage>

        <Spacer y={10} />
      </>
    );
  };

  const ecotaxaLink = (p:Project) => {
    if (p.ecotaxaId) {
      const title = t("Box_Ecotaxa_Title_Linked")
      const subtitle = p.ecotaxaId
     return (
        <>
      <BoxMessage
          title={title}
          subtitle={subtitle}
          button={undefined}
        >
          <CloudIcon />
        </BoxMessage>
        </>
      );
    }
    return (
      <>
        <BoxMessage
          title={t("Box_Ecotaxa_Title_Unlinked")} 
          subtitle={t("Box_Ecotaxa_Subtitle_Unlinked")}
          button={{
            href: "/projects/new",
            text: t("Box_Ecotaxa_Button_Unlinked")
          }}
        >
          <CloudIcon />
        </BoxMessage>
      </>
    );
  };


  const pc: Project = params.project;

  return (
    <>
    <div>
      <h1>Stats</h1>
      {projectEmpty(pc)}
      {ecotaxaLink(pc)}
    </div>
    <Debug params={pc} title="project" pre={true}/>
    </>
  );
};

export default Stats;

