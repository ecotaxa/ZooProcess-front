
import {Code, Switch, Tooltip} from "@nextui-org/react";
import { useState } from "react";

import {debug} from "../config/settings"

export const Debug = ({params,title="debug",open=false}) => {

    const [isSelected, setIsSelected] = useState(open);



    if ( debug == false ){
        return (<></>)
    }

    //
    // return (
    //     <div>
    //         {JSON.stringify(params)}
    //     </div>
    // )


    const ShowError = () => {

        // if(!open)
           if (!isSelected) { return (<></>) }

        return (
            <div className="xm-sm-max-100 w-50">
                {/* <Code className="size-sm" color="secondary"> */}
                    {JSON.stringify(params)}
                {/* </Code> */}
            </div>
        )
    }

    return (
    <>
        <Tooltip
            content={
                <div className="xm-sm-max-100">
                    {JSON.stringify(params)}
                </div>
            }
            >
        <div className="flex flex-col gap-2">
            <Switch 
                isSelected={isSelected} 
                onValueChange={setIsSelected} 
                size="sm"
                color="secondary"
            >
                {title}
            </Switch>
            {/* <p className="text-small text-default-500">Selected: {isSelected ? "true" : "false"}</p> */}
        </div>
        </Tooltip>

        <ShowError/>
        
    </>
    );
}