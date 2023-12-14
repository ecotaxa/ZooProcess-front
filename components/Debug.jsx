
import {Switch} from "@nextui-org/react";
import { useState } from "react";
export const Debug = ({params,title="debug"}) => {



    const [isSelected, setIsSelected] = useState(true);

    // return (
    //     <div>
    //         {JSON.stringify(params)}
    //     </div>
    // )

    const ShowError = () => {

        if (isSelected) { return (<></>) }

        return (
            <div>
                {JSON.stringify(params)}
            </div>
        )
    }

    return (
    <>
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

        <ShowError/>
    </>
    );
}