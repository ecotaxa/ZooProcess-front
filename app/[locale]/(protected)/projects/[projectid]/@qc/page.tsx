import { Card, CardBody, CardHeader, Spacer } from "@heroui/react";
import { FC } from "react";
import { useTranslations } from 'next-intl' ;


interface pageProps {
    // params: {
        projectid: string,
        translate:any
    // }
}


const QC : FC<pageProps> = (params) => {
	const t = useTranslations('ProjectPage_QC');

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
                        <h1>{t("Title")}</h1>
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


