import { Button, Card, CardBody, Link } from "@nextui-org/react";
import React, { FC } from "react";

export interface IBoxMessage {
    children: any; // React.ReactNode //React.RefAttributes<SVGSVGElement>
    title: String;
    subtitle: String;
    button: {
      href: String ;
      text: String;
      } | undefined
  }
  

export const BoxMessage: FC<IBoxMessage> = (props) => {


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
          <span>
          <div className="flex-none p-6">{IconElement}</div>
          </span>
          <span >
          <div className="">
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
          </div>
          </span>
          {ShowButton(button)}
        </div>
      </CardBody>
    </Card>
  );
};

