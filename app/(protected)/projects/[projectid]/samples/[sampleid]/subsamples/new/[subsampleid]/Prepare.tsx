"use client"

import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { eState } from "./state";
import { on } from "events";
import { Sample } from "@/app/api/network/interfaces";


// const Prepare = ( current: eState, nextState: eState, setCurrent: /*(s:state)=>{}*/ any) => {
    export function Prepare (params:{
        // current:eState, 
        // nextState: eState, 
        // setCurrent:(state:eState)=>void, 
        // project:Project,
        onCancel:()=>void,
        onValid:()=>void
    }) {
        // let {current, nextState, setCurrent, onCancel } = params
        const { onCancel, onValid } = params
    


    // if ( current != eState.info ) {
    //     return <></>
    // }

    return (
        <>
        <Card className="inline-block size-full"
            data-testid="ScanCard" 
            >
            <CardBody className="p-6">
                <div  className="bg-100 p-6">
                    <h1 className="text-center">You are about to scan with the Zooscan.</h1>
                    <br/><br/>
                    <div >
                        <ul className={"list-disc list-outside leading-loose"}>
                            <li>Clean the Zooscan tray.</li>
                            <li>Pour a small amount of water into the tray (salt or fresh)</li>
                            <li>Place the suitable frame (LARGE/NARROW) on the glass and adjust its position.</li>
                            <li>Add the sample</li>
                            <li>Adjust the water level just above the first step of the transparent frame (the meniscus must be above the step).</li>
                            <li>Spread the specimens homogeneously, but avoid placing specimens close and parallel to the borders.<br/>
                                The number of objects will be adapted to their size, and it's important to limit the number of touching objects (multiple).</li>
                            <li>Help floating specimens to sink on the glass.</li>
                            <li>Separate the touching objects.</li>
                        </ul>
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

                <Button 
                    // disabled={ isError || isLoading || !image }
                    color="primary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={() =>{ console.debug("go to Preview"); setCurrent(nextState) }}
                    onPress={() =>{ console.debug("go to Preview"); onValid() }}
                    // onPress={onClick}
                >Done - Launch Preview</Button>
            </CardFooter>
        </Card>
        </>
    )
}