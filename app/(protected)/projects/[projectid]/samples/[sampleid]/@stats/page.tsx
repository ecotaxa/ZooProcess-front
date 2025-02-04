import { Card, CardBody, Spacer } from "@nextui-org/react";


import { ArrowDownIcon, ArrowDownTrayIcon, CloudIcon, PlusIcon } from "@heroicons/react/20/solid";
import React, { FC } from "react";
import { Sample } from "@/app/api/network/interfaces";
import { BoxMessage } from "@/components/BoxMessage";

// interface IBoxMessage {
//     children : any // React.ReactNode //React.RefAttributes<SVGSVGElement>
//     title : String
//     subtitle : String
// }

// const BoxMessage : FC<IBoxMessage> = (props) => {

//     const {children,title,subtitle} = props   

//     const IconElement = React.cloneElement(children, {className:"h-16 w-16 text-blue-500"})

//     return (
//         <Card>
//         <CardBody>
//             <div className="flex">
//                 <div className="flex-none p-6">{IconElement}</div> 
//                     <div className="flex flex-wrap">
//                     <h2>{title}</h2>
//                     <h3>{subtitle}</h3>
//                 </div>
//             </div>
//         </CardBody>
//         </Card>
//     )
// }


interface pageProps {
    // params: {
      projectid: string,
      // sampleid: string
      sample: Sample
    // }
  }

const Stats: FC<pageProps> = (params) => {

    const {sample} = params


    console.log("Metadata params: ", params);
    console.log("Metadata params sample: ", params.sample);


    return (
        <div>
            {/* <BoxMessage
                title="Your project is empty ! Please create samples"
                subtitle="You can create samples in the data tab of your project."
            >
                <PlusIcon/>
            </BoxMessage>

            <Spacer y={10}/>
            <BoxMessage
                title="Your project is empty! Please import data."
                subtitle="You can import or scan and import data in the import tab of your project."
            >
                <ArrowDownTrayIcon/>
            </BoxMessage>
            
            <Spacer y={10}/>
            <BoxMessage
                title="Your project isn't linked to an EcoTaxa project! Please link it to an existing or new EcoTaxa project."
                subtitle="You will then be able to import data to EcoTaxa from EcoPart and classify it in EcoTaxa."
            >
                <CloudIcon/>
            </BoxMessage> */}

            {/* { sample.project != null  && */}
                <BoxMessage
                    title="Your project isn't linked to any instrument! Please link it to an existing or new instrument."
                    subtitle="You cannot scan without scanning instrument."
                    button={
                        {
                            href: `/projects/${sample.projectId}`,
                            text: "Add instrument",
                        }
                    }
                >
                    <CloudIcon/>
                </BoxMessage>
            {/* } */}
        
        
                <div>
                    { JSON.stringify(sample, null, 2) }
                </div>


        </div>
    );
};

export default Stats;
