"use client"


import { ScannerEffect } from "@/components/ScannerEffect";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
// import { eState } from "./state";
import { TemporizedButton } from "@/components/temporized_button";

// const Preview = (current: eState, nextState: eState, setCurrent: (etate: eState) => void, onPress: () => void) => {
export function Preview(param: {
        // current: eState;
        // nextState: eState;
        // setCurrent: (etate: eState) => void;
        // onPress: () => void;
        onCancel: () => void;
        onValid: () => void;
      }) {
    // const { current, nextState, setCurrent, onPress } = param;
    const { onCancel, onValid } = param;

    // if ( current != eState.preview ) {
    //     return <></>
    // }

    const onPreviewClick = () => {
        console.log("onPreviewClick")
    }

    return (
        <>
         <Card className="inline-block size-full"
                data-testid="ScanCard" 
                >
            <CardBody className="p-6">
                <div  className="bg-100 p-6">
                    <h1 className="text-center">Preview.</h1>
                    <ScannerEffect imageSrc={"/demo/demo_background.jpg"} onScanComplete={()=>{console.log("scan preview done")}} triggerScan={true} />
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

            <Button 
                    // disabled={ isError || isLoading || !image }
                    color="secondary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={onClick}
                    onPress={() =>{ console.debug("renew Preview");  onPreviewClick()  }}
                >Preview</Button>
 
                {/* <TemporizedButton timer={5} label="Scan" waitlabel="Wait 30s" onClick={() =>{ console.debug("go to wait 30s");   setCurrent(nextState) }}  run={true} /> */}
                <TemporizedButton timer={5} label="Scan" waitlabel="Wait 30s" onClick={() =>{ console.debug("go to wait 30s");   onValid() }}  run={true} />
            </CardFooter>
        </Card>
        </>
    )
}
