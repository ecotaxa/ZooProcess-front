"use client";

import { Instrument, Project } from "@/app/api/network/interfaces";
// import { eState } from "./state";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { Debug } from "@/components/Debug";
import { useRouter } from "next/navigation";
// import { on } from "events";



// const ScannerSettings = (project: Project|any, current : eState, nextState: eState, setCurrent: (etate: eState) => void;) => {
export function ScannerSettings(param: {
    project: Project|any,
    instrument: Instrument,
    // current: eState;
    // nextState: eState;
    // setCurrent: (etate: eState) => void;
    onCancel: () => void;
    onValid: () => void;
}) {
    const { project,instrument, onCancel, onValid } = param;
    // const { project, current, nextState, setCurrent } = param;

    // if ( current != eState.scannerSettings ) {
    //     return <></>
    // }

    const router = useRouter();

    return (
        <>
        <Card className="inline-block size-full"
            data-testid="ScannerSettingsCard" 
            >
            <CardBody className="p-6">
                <div  className="bg-100 p-6">
                    <h1 className="text-center">You are about to scan with the Zooscan.</h1>
                    <br/><br/>
                    <div >
                        <Debug params={project} title="project"/>
                        { project.instrument?.sn && <b>Your project use Zooscan : {instrument.sn}</b>}
                        <br/>
                        <b>project.instrumentId: {instrument.id}</b>
                        {/* <b>Your project use Zooscan : {project.instrument?.sn||""}</b> */}
                        {/* <b>Your project use Zooscan : {project.instrumentId} {project.instrument.serial}</b> */}
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

            <div className="flex flex-row justify-end gap-4">

                <Button 
                    // disabled={ isError || isLoading || !image }
                    color="secondary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="scannerCancelBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={() =>{ console.debug("cancel scanning"); router.push('/projects'); }}
                    onPress={() =>{ console.debug("cancel scanning"); onCancel() }}
                    // onPress={onClick}
                >Cancel</Button>

                <Button 
                    // disabled={ isError || isLoading || !image }
                    color="primary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="ScannerNextBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={() =>{ console.debug("I'm using " + project.instrument?.sn);   setCurrent(nextState) }}
                    onPress={() =>{ console.debug("I'm using " + instrument.sn);   onValid() }}
                    // onPress={onClick}
                >Continue - {"I'm using " + instrument.sn}</Button>


                </div>
            </CardFooter>
        </Card>               
        </>
    )
}
