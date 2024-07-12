import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { state } from "./state";
import { Project } from "@/app/api/network/zooprocess-api";
import { Debug } from "@/components/Debug";


const Metadata = (project: Project|any, current: state, nextState: state, onCancel: any , setCurrent: (state: state) => void) => {
    if ( current != state.metadata )  {
        return <></>
    }

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
                        <Debug params={project} title="project"/>
                        { project.instrument?.sn && <b>Your project use Zooscan : {project.instrument?.sn}</b>}
                        <br/>
                        <b>project.instrumentId: {project.instrumentId}</b>
                        {/* <b>Your project use Zooscan : {project.instrument?.sn||""}</b> */}
                        {/* <b>Your project use Zooscan : {project.instrumentId} {project.instrument.serial}</b> */}
                    </div>
                </div>
            </CardBody>

            <CardFooter className="flex flex-row-reverse py-3">

                <Button 
                    disabled={ isError || isLoading }
                    color="primary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    onPress={() =>{ console.debug("I'm using " + project.instrument?.sn);   setCurrent(nextState) }}
                    // onPress={onClick}
                >Continue - {"I'm using " + project.instrument?.sn}</Button>

                <Button 
                    // disabled={ isError || isLoading || !image }
                    color="secondary"
                    // showAnchorIcon
                    variant="solid"
                    data-testid="newProjectBtn"
                    // >Scan {actions[nextAction(action)]}</Button>
                    // onPress={() =>{ console.debug("cancel scanning"); router.push('/projects'); }}
                    onPress={() => onCancel()}
                    // onPress={onClick}
                >Cancel</Button>
            </CardFooter>
            </Card>       
        </>
    )
}

export default Metadata;