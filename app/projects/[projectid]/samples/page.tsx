"use client";


import Head from 'next/head';
// import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, Typography } from '@mui/material';


import { SamplesTableNextUI as SamplesTable } from '@/components/samples-table'
import { Button, Card, CardBody, CardHeader, Spacer, Link } from '@nextui-org/react';
import { MySpinner } from '@/components/mySpinner';
import { ErrorComponent } from '@/components/ErrorComponent';
import { FC, useEffect, useState } from 'react';

import { useSamples } from '@/app/api/samples';
// import Project from '../page';


interface pageProps {
  params: {projectid: string}
}

const Samples : FC<pageProps> = (params:any) => {
    // const router = useRouter()
    // const projectid = router.query.projectid //as string
    // const sampleid = router.query.sampleid //as string

  console.log("Samples params: ", params);

  const sampleName = "mon Sample";

    // const sampleid = 10;
    const projectId = params.projectid ;

    const { samples, isLoading, isError } = useSamples()
    const [ sampleList, setSampleList ] = useState([samples])

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
  
        console.log("sample: ", sample);

        return {
          id: data[sample].id,
          name: data[sample].name,
          // createdAt,
          // updatedAt,    
        }
      });
  
      console.log("formated data: ",samples);
      return samples
    }

    useEffect( () => { 
      console.log("samples has changed", samples);
      const data = formatData(samples)
      setSampleList(data);
    } , [samples])


    const ShowData = () => {
      if (isLoading) return <MySpinner />
      if (isError) return <ErrorComponent error={isError}/>
      return <SamplesTable projectId={projectId} samples={sampleList}/>
    }

  return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="text-center justify-center">
              <h4 data-testid="title">
                  Samples
              </h4>
              <Spacer y={5}/>
              <Card className="inline-block "
                  data-testid="projectCard" 
                  >
                  <CardHeader className="flex flex-row-reverse py-3">
                      <Button 
                          href="projects/new"
                          as={Link}
                          color="primary"
                          // showAnchorIcon
                          variant="solid"
                          data-testid="newProjectBtn"
                          >Add new sample</Button>
                  </CardHeader>
                  <CardBody>
                      <ShowData/>
                  </CardBody>

              </Card> 
          </div>
      </section>
  );
};

export default Samples;
