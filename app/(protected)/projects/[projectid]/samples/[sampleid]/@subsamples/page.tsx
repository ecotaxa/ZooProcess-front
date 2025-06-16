"use client";


import Head from 'next/head';
// import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, Typography } from '@mui/material';


import { SubSamplesTable } from '@/components/subsamples-table'
import { Button, Card, CardBody, CardHeader, Spacer, Link, Tooltip } from "@heroui/react";
// import { MySpinner } from '@/components/mySpinner';
// import { ErrorComponent } from '@/components/ErrorComponent';
import { FC, useEffect, useState } from 'react';


import { IMetadata, IScan, Sample } from '@/app/api/network/interfaces';
import { Debug } from '@/components/Debug';

// import Project from '../page';


interface pageProps {
  // params: {
    projectid: string,
    // sampleid: string
    sample: Sample
    //subsampleid: string
  // }
}

const SubSamples : FC<pageProps> = (params) => {

  console.debug("SubSamples params: ", params);
  console.debug("SubSamples params: ", params.projectid);
  
  const { sample, projectid:projectId } = params;
  const sampleId = sample.id ;

  const disabled = sample.project.instrumentId == null
  const tooltipMessage = disabled ? "Instrument not defined" : "Add a subsample"

  const [ subsampleList, setSubSampleList ] = useState(params.sample.subsample)



    // const formatData = (data:any) => {

    //   console.log("formatData", data);
  
    //   const subsamples = Object.keys(data).map( (subsample) => {
    //     // const createdAt = new Date(samples.createdAt)
    //     // console.log("createdAt: ", createdAt)
  
    //     // let updatedAt = undefined;
    //     // if (samples.updatedAt){
    //     //   try {
    //     //     updatedAt = new Date(samples.updatedAt)
    //     //   }
    //     //   catch {
    //     //     updatedAt = createdAt;
    //     //   }
    //     // } else {
    //     //   updatedAt = createdAt;
    //     // }
  
    //     console.log("subsample: ", subsample);



    //     function getScan(data:Array<IScan>, type:String="Scan") {
    //       console.log("getScan: ", data);
    //       const value = data.find( (m:IScan) => m.type == type)
    //       console.log("getScan value: ",  value);
    //       return value?.url || null
    //       // return 1
    //     }

    //     if ( subsample == "key"){
    //         console.error("ARRGG indey == key");
    //         console.log("ARRGG indey == key")
    //         console.debug(data);
    //         console.log("pfffff")
    //     } else {
    //       const s = data[subsample]
    //       console.log("sssssss: ", typeof(s), s);

    //       return {
    //         id: data[subsample].id,
    //         name: data[subsample].name,
    //         // fraction:s.nbFractions,
    //         // scans:s.nbScans,
    //         createdAt:s.createdAt,
    //         updatedAt:s.updatedAt,
    //         operator:s.user.name,
    //         fractionid:getMetadata(s.metadata, "fraction_id"),
    //         fracmin:getMetadata(s.metadata, "fraction_min_mesh"),
    //         fracsup:getMetadata(s.metadata, "fraction_max_mesh"),
    //         obs:getMetadata(s.metadata, "observation"),
    //         url:getScan(s.scans, "SCAN"),
    //       }  
    //     }

    //   });
  
    //   console.log("formated data: ",subsamples);
    //   return subsamples
    // }

    // useEffect( () => { 
    //   console.log("sub samples has changed", subsamples);
    //   const data = formatData(subsamples)
    //   // const data = samples
    //   setSubSampleList(data);
    // } , [subsamples])

    const ShowData = () => {
      // if (isLoading) return <MySpinner />
      // if (isError) return <ErrorComponent error={isError}/>
      return <SubSamplesTable projectId={projectId} sampleId={sampleId} subsamples={subsampleList}/>
    }

  return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Debug params={disabled} title='disabled' open={true} />
          <div className="text-center justify-center">
              <h1 data-testid="title">
                  Samples {projectId}
              </h1>
              <Spacer y={5}/>
              <Card 
                  className="inline-block "
                  data-testid="projectCard" 
                >
                <CardHeader className="flex flex-row-reverse py-3">
                { disabled &&
                  <div className="flex flex-col items-center justify-center gap-4  text-red-600">You have no instrument</div>
                }
                <Tooltip content={tooltipMessage} isDisabled={!disabled} color="warning">
                {/* isDisabled={disabled} */}
                    <Button 
                      href={`/projects/${projectId}/samples/${sampleId}/subsamples/new`}
                      as={Link}
                      color="primary"
                      isDisabled={disabled}
                      // showAnchorIcon
                      variant="solid"
                      data-testid="newSubSampleBtn"
                      >Scan sub sample</Button>
                      </Tooltip>
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
