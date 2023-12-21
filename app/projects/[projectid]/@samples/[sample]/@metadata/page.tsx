

import Head from 'next/head';
// import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, Typography } from '@mui/material';

// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import { SamplesTable } from 'src/sections/samples/samples-table';
// import { useRouter } from 'next/router';
// import { SubSamplesTable } from '../../../../sections/sub-samples/sub-samples-table';
import { Card, CardBody, CardHeader, Spacer } from '@nextui-org/react';
 



const Sample = (params) => {
    // const router = useRouter()
    // const projectid = router.query.projectid //as string
    // const sampleid = router.query.sampleid //as string

  const sampleName = "mon Sample";

    const sampleid = 10;


    return (
    <>
        <Head>
        <title>
            Samples {sampleid} | ZooProcess
        </title>
        </Head>
        <div>

            <Card>
                <CardHeader>
                    <h1>Sample</h1>
                </CardHeader>
                <CardBody>
                    <h1>{sampleName}</h1>
                </CardBody>
            </Card>
            <Spacer y={20}/>
        {/* <div className="flex w-full flex-col"> */}
            {/* <Tabs aria-label="Options"> */}
                {/* <Tab key="stats" title="Stats"> */}
                    {/* <Stats/> */}
                {/* </Tab> */}
                {/* <Tab key="metadata" title="Metadata" href={`/projects/${projectid}/metadata`}> */}
                    {/* <Metadata/> */}
                {/* </Tab> */}
                {/* <Tab key="samples" title="Samples"> */}
                    {/* <Samples/> */}
                {/* </Tab> */}
                {/* <Tab key="scans" title="Scans"> */}
                    {/* <Scans/> */}
                {/* </Tab> */}
            {/* </Tabs> */}
        {/* </div> */}

    </div>
    </>
    );
}

export default Sample;
