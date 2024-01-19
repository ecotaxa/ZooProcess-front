import { Card, CardBody, Spacer } from "@nextui-org/react";


import { ArrowDownIcon, ArrowDownTrayIcon, CloudIcon, PlusIcon } from "@heroicons/react/20/solid";
import React, { FC } from "react";

interface IBoxMessage {
    children : any // React.ReactNode //React.RefAttributes<SVGSVGElement>
    title : String
    subtitle : String
}

const BoxMessage : FC<IBoxMessage> = (props) => {

    const {children,title,subtitle} = props   

    const IconElement = React.cloneElement(children, {className:"h-16 w-16 text-blue-500"})

    return (
        <Card>
        <CardBody>
            <div className="flex">
                <div className="flex-none p-6">{IconElement}</div> 
                    <div className="flex flex-wrap">
                    <h2>{title}</h2>
                    <h3>{subtitle}</h3>
                </div>
            </div>
        </CardBody>
    </Card>
    )
}

const Stats = () => {

    return (
        <div>
            <BoxMessage
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
            </BoxMessage>
        </div>
    );
};

export default Stats;
