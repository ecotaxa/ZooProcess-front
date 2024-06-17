import { Button, Card, CardBody, Link, Spacer } from "@nextui-org/react";


import { ArrowDownIcon, ArrowDownTrayIcon, CloudIcon, PlusIcon } from "@heroicons/react/20/solid";
import React, { FC } from "react";
import { BoxMessage } from "@/components/BoxMessage";

// interface IBoxMessage {
//     children : any // React.ReactNode //React.RefAttributes<SVGSVGElement>
//     title : String
//     subtitle : String
//     href : String|undefined
// }

interface pageProps {
    // params: {
      projectid: string
    // }
  }

const Stats  : FC<pageProps> = (params) => {

    const projectId = params.projectid ;
    console.log("Metadata params: ", params);
    console.log("Metadata params projectid: ", params.projectid);

    return (
        <div>

            <BoxMessage
                title="Your project is empty ! Please create samples"
                subtitle="You can create samples in the data tab of your project."
                button={{
                    href: `/projects/${projectId}/new`,
                    text: "Create samples",
                }}
            >
                <PlusIcon/>
            </BoxMessage>
                       
            <Spacer y={10}/>

            <BoxMessage
                title="Your project is empty! Please import data."
                subtitle="You can import or scan and import data in the import tab of your project."
                button={{
                    href: "/projects/new",
                    text: "Import data",
                }}
            >
                <ArrowDownTrayIcon/>
            </BoxMessage>
            
            <Spacer y={10}/>

            <BoxMessage
                title="Your project isn't linked to an EcoTaxa project! Please link it to an existing or new EcoTaxa project."
                subtitle="You will then be able to import data to EcoTaxa from EcoPart and classify it in EcoTaxa."
                button={{
                    href: "/projects/new",
                    text: "Link Project",
                }}
            >
                <CloudIcon/>
            </BoxMessage>

        </div>
    );
};

export default Stats;
