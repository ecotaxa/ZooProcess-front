import { Button, Card, CardBody, Link, Spacer } from "@nextui-org/react";


import { ArrowDownIcon, ArrowDownTrayIcon, CloudIcon, PlusIcon } from "@heroicons/react/20/solid";
import React, { FC } from "react";

// interface IBoxMessage {
//     children : any // React.ReactNode //React.RefAttributes<SVGSVGElement>
//     title : String
//     subtitle : String
//     href : String|undefined
// }
interface IBoxMessage {
    children: any; // React.ReactNode //React.RefAttributes<SVGSVGElement>
    title: String;
    subtitle: String;
    button: {
      href: String ;
      text: String;
      } | undefined
  }
  

const BoxMessage: FC<IBoxMessage> = (props) => {


  const { children, title, subtitle, button } = props;

  const IconElement = React.cloneElement(children, {
    className: "h-16 w-16 text-blue-500",
  });

  const ShowButton = (button :{
    href: String ;
    text: String;
    } | undefined| undefined) => {
    if ( button == undefined ) {return <></>}
    console.log("button: ", button);
    const testid = button.text.toString()+"Btn"
    return (
      <div className="flex text-right">
        <Button 
            href={button?.href.toString()}        
            as={Link}
            color="primary"
            // showAnchorIcon
            variant="solid"
            data-testid={testid}
        >{button?.text}</Button>
      </div>
    )
  };

  return (
    <Card>
      <CardBody>
        <div className="flex">
          <div className="flex-none p-6">{IconElement}</div>
          <div className="flex flex-wrap">
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
          </div>
          {ShowButton(button)}
        </div>
      </CardBody>
    </Card>
  );
};


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
