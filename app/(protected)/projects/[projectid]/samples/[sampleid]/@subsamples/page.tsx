"use client";


import Head from 'next/head';

import { SubSamplesTable } from '@/components/subsamples-table'
import { Button, Card, CardBody, CardHeader, Spacer, Link, Tooltip } from "@heroui/react";
import { FC, useEffect, useState } from 'react';


import { IMetadata, IScan, Sample } from '@/app/api/network/interfaces';
import { Debug } from '@/components/Debug';


interface pageProps {
    projectid: string,
    sample: Sample
}

const SubSamples : FC<pageProps> = (params) => {

  console.debug("SubSamples params: ", params);
  console.debug("SubSamples params: ", params.projectid);
  
  const { sample, projectid:projectId } = params;
  const sampleId = sample.id ;

  const disabled = sample.project.instrumentId == null
  const tooltipMessage = disabled ? "Instrument not defined" : "Add a subsample"

  const [ subsampleList, setSubSampleList ] = useState(params.sample.subsample)


    const ShowData = () => {
  
      return <SubSamplesTable projectId={projectId} sampleId={sampleId} subsamples={subsampleList}/>
    }

  return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        {/* <Debug params={disabled} title='disabled' open={true} /> */}
          <div className="text-center justify-center">
              {/* <h1 data-testid="title">
                  SubSamples in {sample.name}
              </h1> */}
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
                    <Button 
                      href={`/projects/${projectId}/samples/${sampleId}/subsamples/new`}
                      as={Link}
                      color="primary"
                      isDisabled={disabled}
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
