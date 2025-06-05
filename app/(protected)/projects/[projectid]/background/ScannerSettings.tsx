"use client";

import { Instrument, Project } from "@/app/api/network/interfaces";
import { Button, Card, CardBody, CardFooter } from "@heroui/react";
import { Debug } from "@/components/Debug";


export function ScannerSettings(param: {
    project: Project, //|any,
    instrument: Instrument,
    onCancel: () => void;
    onValid: () => void;
}) {
    const { project,instrument, onCancel, onValid } = param;

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
                        { instrument.sn && <b>Your project use Zooscan : {instrument.sn}</b>}
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

                <Button 
                    color="primary"
                    variant="solid"
                    data-testid="ScannerNextBtn"
                    onPress={() =>{ console.debug("I'm using " + instrument.sn);   onValid() }}
                >Continue - {"I'm using " + instrument.sn}</Button>

                <Button 
                    color="secondary"
                    variant="solid"
                    data-testid="scannerCancelBtn"
                    onPress={() =>{ console.debug("cancel scanning"); onCancel() }}
                >Cancel</Button>
            </CardFooter>
        </Card>               
        </>
    )
}
