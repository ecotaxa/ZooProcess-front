"use client";


import Head from 'next/head';
// import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, Typography } from '@mui/material';


import { SubSamplesTable } from '@/components/subsamples-table'
import { Button, Card, CardBody, CardHeader, Spacer, Link } from '@nextui-org/react';
import { MySpinner } from '@/components/mySpinner';
import { ErrorComponent } from '@/components/ErrorComponent';
import { FC, useEffect, useState } from 'react';

import { useSubSamples } from '@/api/subsamples';
// import Project from '../page';


interface pageProps {
  // params: {
    projectid: string,
    sampleid: string
    //subsampleid: string
  // }
}

const SubSamples : FC<pageProps> = (params) => {
    // const router = useRouter()
    // const projectid = router.query.projectid //as string
    // const sampleid = router.query.sampleid //as string

  console.log("Samples params: ", params);
  console.log("Samples params: ", params.projectid);
  console.log("Samples params: ", params.sampleid);
  // console.log("SubSamples params: ", params.subsampleid);

  // const sampleName = "mon Sample";

    // const sampleid = 10;
    const projectId = params.projectid ;
    const sampleId = params.sampleid ;
    // const subsampleId = params.subsampleid ;

    const { subsamples, isLoading, isError } = useSubSamples(projectId, sampleId)
    const [ subsampleList, setSubSampleList ] = useState(subsamples)

    // const formatData = (data:any) => {
    //   console.log("formatData: ",data);
    //   return data;
    // }

    const formatData = (data:any) => {

      console.log("formatData", data);
  
      const samples = Object.keys(data).map( (sample) => {
        // const createdAt = new Date(samples.createdAt)
        // console.log("createdAt: ", createdAt)
  
        // let updatedAt = undefined;
        // if (samples.updatedAt){
        //   try {
        //     updatedAt = new Date(samples.updatedAt)
        //   }
        //   catch {
        //     updatedAt = createdAt;
        //   }
        // } else {
        //   updatedAt = createdAt;
        // }
  
        console.log("subsample: ", subsamples);

        if ( sample == "key"){
            console.error("ARRGG indey == key");
            console.log("ARRGG indey == key")
            console.debug(data);
            console.log("pfffff")
        } else {
          const s = data[sample]

          return {
            id: data[sample].id,
            name: data[sample].name,
            fraction:s.nbFractions,
            scans:s.nbScans,
            createdAt:s.createdAt,
            updatedAt:s.updatedAt,
          }  
        }

      });
  
      console.log("formated data: ",samples);
      return samples
    }

    useEffect( () => { 
      console.log("sub samples has changed", subsamples);
      const data = formatData(subsamples)
      // const data = samples
      setSubSampleList(data);
    } , [subsamples])


    const ShowData = () => {
      if (isLoading) return <MySpinner />
      if (isError) return <ErrorComponent error={isError}/>
      return <SubSamplesTable projectId={projectId} sampleId={sampleId} subsamples={subsampleList}/>
    }

  return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="text-center justify-center">
              <h1 data-testid="title">
                  Samples {projectId}
              </h1>
              <Spacer y={5}/>
              <Card className="inline-block "
                  data-testid="projectCard" 
                  >
                  <CardHeader className="flex flex-row-reverse py-3">
                      <Button 
                          href={`/projects/${projectId}/samples/${sampleId}/subsamples/new`}
                          as={Link}
                          color="primary"
                          // showAnchorIcon
                          variant="solid"
                          data-testid="newSubSampleBtn"
                          >Scan sub sample</Button>
                  </CardHeader>
                  <CardBody>
                      <ShowData/>
                  </CardBody>

              </Card> 
          </div>
      </section>
  );
};

export default SubSamples;
