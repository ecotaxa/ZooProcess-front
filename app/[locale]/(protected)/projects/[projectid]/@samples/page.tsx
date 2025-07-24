import { SamplesTableNextUI as SamplesTable } from '@/components/samples-table';
import { Button, Card, CardBody, CardHeader, Spacer, Link } from '@heroui/react';
import { FC, useEffect, useState } from 'react';

import { Samples } from '@/app/api/network/interfaces';
import { getSamples } from '@/app/api/data/samples';

import { Debug } from '@/components/Debug';

interface pageProps {
  projectid: string;
}

const SamplesTab: FC<pageProps> = ({ projectid }) => {
  console.debug('Samples params: ', { projectid });
  console.debug('Samples projectid: ', projectid);

  const projectId = projectid;

  const [sampleList, setSampleList] = useState<any[]>([]);
  const t = useTranslations('ProjectPage_Samples');

  useEffect(() => {
    const fetchSamples = async () => {
      const fetchedSamples = await getSamples(projectId);
      const formattedData = formatData(fetchedSamples);
      setSampleList(formattedData);
    };
    fetchSamples();
  }, [projectId]);

  const formatData = (data: any) => {
    console.log('formatData', data);

    const formattedSamples = Object.keys(data)
      .map(sample => {
        console.log('sample: ', sample);

        if (sample === 'key') {
          console.error('ARRGG indey == key');
          console.log('ARRGG indey == key');
          console.log(data);
          console.log('pfffff');
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
      })
      .filter(Boolean);

    console.log('formatted data: ', formattedSamples);
    return formattedSamples;
  };

  const ShowData = () => {
    return <SamplesTable projectId={projectId} samples={sampleList} />;
  };

  return (
    <>
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
                data-testid="newSampleBtn"
              >
                {t('New')}
              </Button>
            </CardHeader>
            <CardBody>
              <ShowData />
            </CardBody>
          </Card>
        </div>
      </section>
      <section>
        <Debug params={sampleList} title="sampleList" pre={true} />
      </section>
    </>
  );
};
export default SamplesTab;
