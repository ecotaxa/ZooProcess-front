
import {Switch, Tooltip} from "@nextui-org/react";
import { useState } from "react";
export const Debug = ({params,title="debug"}) => {



    const [isSelected, setIsSelected] = useState(false);

    // return (
    //     <div>
    //         {JSON.stringify(params)}
    //     </div>
    // )

    //return (<></>)

    const ShowError = () => {

        if (!isSelected) { return (<></>) }

        return (
            <div className="xm-sm-max-100">
                {JSON.stringify(params)}
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