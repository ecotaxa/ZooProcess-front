import { Card, CardBody, Spacer } from "@nextui-org/react";

const Stats = () => {

    return (
        <div>
            <Card>
                <CardBody>
                    <div className="flex flex-col">
                        <span>Icone Plus</span>
                        <h2>Your project is empty ! Please create samples</h2>
                        <h3>You can create samples in the data tab of your project.</h3>
                    </div>
                </CardBody>
            </Card>

            <Spacer y={10}/>
            <Card>
                <CardBody>
                    <div className="flex flex-col">
                        <span>Icone Download</span>
                        <h2>Your project is empty! Please import data.</h2>
                        <h3>You can import or scan and import data in the import tab of your project.</h3>
                    </div>
                </CardBody>
            </Card>
            
            <Spacer y={10}/>
            <Card>
                <CardBody>
                    <div className="flex flex-col">
                        <span>Icone Cloud</span>
                        <h2>Your project isn't linked to an EcoTaxa project! Please link it to an existing or new EcoTaxa project.</h2>
                        <h3>You will then be able to import data to EcoTaxa from EcoPart and classify it in EcoTaxa.</h3>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Stats;
