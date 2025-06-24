"use client"

import { Button, Card, CardBody, Link, Spacer } from "@heroui/react";


import { ArrowDownIcon, ArrowDownTrayIcon, CloudIcon, PlusIcon } from "@heroicons/react/20/solid";
import React, { FC } from "react";
import { BoxMessage } from "@/components/BoxMessage";
// import { useProject } from "@/app/api/projects";
import { MySpinner } from "@/components/mySpinner";
import { ErrorComponent } from "@/components/ErrorComponent";
// import { Project } from "@/app/api/network/zooprocess-api";
import { Debug } from "@/components/Debug";
import { title } from "process";
import { sub } from "date-fns";
import { Project } from "@/app/api/network/interfaces";

// interface IBoxMessage {
//     children : any // React.ReactNode //React.RefAttributes<SVGSVGElement>
//     title : String
//     subtitle : String
//     href : String|undefined
// }

interface pageProps {
    // params: {
      // projectid: string
      project: Project
    // }
  }

const Stats: FC<pageProps> = (params) => {
  // const projectId = params.projectid;
  console.log("Metadata params: ", params);
  // console.log("Metadata params projectid: ", params.projectid);

  // const { project, isLoading, isError } = useProject(projectId);

  // const p: Project = project;
  // const [p, castProject] = React.useState(project);

  // useEffect(() => {
  //   const pc: Project = project;
  //   castProject(pc);
  // }, [project]);

  const projectEmpty = (p:Project) => {
    if (p.samples && p.samples.length != 0) {
      return <></>;
    }

    return (
      <>
        <BoxMessage
          title="Your project is empty! Please create samples"
          subtitle="You can create samples in the data tab of your project."
          button={{
            // href: `/projects/${projectId}/new`,
            href: `/projects/${params.project.id}/new`,
            text: "Create samples",
          }}
        >
          <PlusIcon />
        </BoxMessage>

        <Spacer y={10} />

        <BoxMessage
          title="Your project is empty! Please import data."
          subtitle="You can import or scan and import data in the import tab of your project."
          button={{
            href: "/projects/new",
            text: "Import data",
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
      const title = 'Your project is linked to an EcoTaxa project:'
      const subtitle = p.ecotaxaId
     return (
        <>
      <BoxMessage
          title={title}
          subtitle={subtitle}
          button={undefined}
          // button={{
          //   href: "/projects/new",
          //   text: "Link Project",
          // }}
        >
          <CloudIcon />
        </BoxMessage>
        </>
      );
    }
    return (
      <>
        <BoxMessage
          title="Your project isn't linked to an EcoTaxa project! Please link it to an existing or new EcoTaxa project."
          subtitle="You will then be able to import data to EcoTaxa from EcoPart and classify it in EcoTaxa."
          button={{
            href: "/projects/new",
            text: "Link Project",
          }}
        >
          <CloudIcon />
        </BoxMessage>
      </>
    );
  };

  // if (isLoading) return <MySpinner />;
  // if (isError) return <ErrorComponent error={isError} />;

  const pc: Project = params.project;
  // castProject(pc);

  return (
    <div>
        <Debug params={pc} title="p cast"/>
        <h1>Stats</h1>
        {projectEmpty(pc)}
      {ecotaxaLink(pc)}
    </div>
  );
};

export default Stats;

