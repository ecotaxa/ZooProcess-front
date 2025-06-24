import { Card, CardBody, CardHeader, Spacer } from "@heroui/react";
import { FC } from "react";


interface pageProps {
    // params: {
        projectid: string
    // }
}


const QC : FC<pageProps> = (params) => {

    const projectId = params.projectid ;
    console.log("Metadata params: ", params);
    console.log("Metadata params projectid: ", params.projectid);


    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
            <Spacer y={5}/>
            <Card className="inline-block "
                    data-testid="backgroundCard" 
                >
                <CardHeader className="flex flex-row py-3">
                    <div>
                        <h1>QC</h1>
                    </div>
                </CardHeader>
                <CardBody>
                    <div></div>
                </CardBody>

            </Card> 

        </div>
    </section>

    );
};

export default QC;


