"use client";


// import Head from 'next/head';
// import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, Typography } from '@mui/material';


import { SamplesTableNextUI as SamplesTable } from '@/components/samples-table'
import { Button, Card, CardBody, CardHeader, Spacer, Link } from "@heroui/react";
// import { MySpinner } from '@/components/mySpinner';
// import { ErrorComponent } from '@/components/ErrorComponent';
import { FC, useEffect, useState } from 'react';

// import { useSamples } from '@/app/api/samples';
import { Samples } from '@/app/api/network/interfaces';
import { getSamples } from '@/app/api/data/samples';
// import Project from '../page';

// import { useQuery } from 'react-query';
// import { useMemo } from 'react';

interface pageProps {
  // params: {
    projectid: string
  // }
}

const SamplesTab: FC<pageProps> = ({ projectid }) => {
  console.log("Samples params: ", { projectid });
  console.log("Samples projectid: ", projectid);

  const projectId = projectid;

  // const [samples, setSamples] = useState<Samples | null>(null);
  const [sampleList, setSampleList] = useState<any[]>([]);

  useEffect(() => {
    const fetchSamples = async () => {
      const fetchedSamples = await getSamples(projectId);
      // setSamples(fetchedSamples);
      const formattedData = formatData(fetchedSamples);
      setSampleList(formattedData);
    };
    fetchSamples();
  }, [projectId]);

  const formatData = (data: any) => {
    console.log("formatData", data);

    const formattedSamples = Object.keys(data).map((sample) => {
      console.log("sample: ", sample);

      if (sample === "key") {
        console.error("ARRGG indey == key");
        console.log("ARRGG indey == key");
        console.log(data);
        console.log("pfffff");
        return null;
      } else {
        const s = data[sample];

        return {
          id: data[sample].id,
          name: data[sample].name,
          fraction: s.nbFractions,
          scans: s.nbScans,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        };
      }
    }).filter(Boolean);

    console.log("formatted data: ", formattedSamples);
    return formattedSamples;
  };

  const ShowData = () => {
    return <SamplesTable projectId={projectId} samples={sampleList} />;
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center justify-center">
        <Spacer y={5} />
        <Card className="inline-block" data-testid="projectCard">
          <CardHeader className="flex flex-row-reverse py-3">
            <Button
              href={`/projects/${projectId}/new`}
              as={Link}
              color="primary"
              variant="solid"
              data-testid="newProjectBtn"
            >
              Add new sample
            </Button>
          </CardHeader>
          <CardBody>
            <ShowData />
          </CardBody>
        </Card>
      </div>
    </section>
  );
};
export default SamplesTab;
