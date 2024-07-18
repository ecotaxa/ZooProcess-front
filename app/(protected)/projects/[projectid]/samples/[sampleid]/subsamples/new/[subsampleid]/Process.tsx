

import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";

import { MySpinner } from "@/components/mySpinner"
import { ErrorComponent } from "@/components/ErrorComponent"

import { IProcess } from "@/app/api/network/zooprocess-api"

import {eState, timelist} from "./state"
import { useProcess } from "@/app/api/process"



// export const Process = (params:{current:eState, nextState: eState, scan: string, background: string, image: string, projectid: string, sampleid: string, subsampleid: string, setCurrentFn:(state:eState)=>void}) => {
export function Process (params:{current:eState, nextState: eState, scan?: string, background: string, projectid: string, sampleid: string, subsampleid: string, setCurrentFn:(state:eState)=>void}) {

    let {current, nextState, scan, background,  projectid, sampleid, subsampleid, setCurrentFn} = params

    if ( current != eState.process )  {
        return <></>
    }

 
    const { data, isLoading, isError } = useProcess(projectid, sampleid, subsampleid)

    const showState = (data:IProcess|any) => {
        if (isLoading) return <MySpinner />
        if (isError) return <ErrorComponent error={isError}/>
    
        return (
            <>
                {data.state}
            </> 
        )
    }


    return (
        <>
        <Card className="inline-block size-full"
            data-testid="ScannerSettingsCard" 
            >
            <CardBody className="p-6">
                <div  className="bg-100 p-6">
                    <h1 className="text-center">Processing.</h1>
                    <br/><br/>
                    <div >
                        <h1>id: {subsampleid}</h1>
                        <h1>bg: {background}</h1>
                        <h1>sc: {scan}</h1>
                    </div>
                    <div>
                        {showState(data)}
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

                <Button 
                    disabled={ isError || isLoading  }
                    color="primary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    onPress={() =>{   setCurrentFn(nextState) }}
                    // onPress={onClick}
                >Continue</Button>

                <Button 
                    disabled={ isError || isLoading  }
                    color="secondary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    onPress={() =>{ router.back() }} // push('/projects'); }}
                    // onPress={onClick}
                >Cancel</Button>
            </CardFooter>
        </Card>               
        </>
    )

}