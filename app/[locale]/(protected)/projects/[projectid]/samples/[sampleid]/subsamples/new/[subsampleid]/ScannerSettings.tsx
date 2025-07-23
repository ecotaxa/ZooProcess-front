"use client";

import { Instrument, Project } from "@/app/api/network/interfaces";
import { Button, Card, CardBody, CardFooter } from "@heroui/react";
import { Debug } from "@/components/Debug";
import { useRouter } from "next/navigation";


export function ScannerSettings(param: {
    project: Project|any,
    instrument: Instrument,
    onCancel: () => void;
    onValid: () => void;
}) {
    const { project,instrument, onCancel, onValid } = param;

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
                        <b>project.instrumentId: {instrument.id}</b>}
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

            <div className="flex flex-row justify-end gap-4">

                <Button 
                    color="secondary"
                    variant="solid"
                    data-testid="scannerCancelBtn"
                    onPress={() =>{ console.debug("cancel scanning"); onCancel() }}
                >Cancel</Button>

                <Button 
                    color="primary"
                    variant="solid"
                    data-testid="ScannerNextBtn"
                    onPress={() =>{ console.debug("I'm using " + instrument.sn);   onValid() }}
                >Continue - {"I'm using " + instrument.sn}</Button>

                </div>
            </CardFooter>
        </Card>               
        </>
    )
}
