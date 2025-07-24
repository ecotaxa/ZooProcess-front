import { Card, CardBody, Spacer } from '@heroui/react';

import { CloudIcon } from '@heroicons/react/20/solid';
import React, { FC } from 'react';
import { Sample } from '@/app/api/network/interfaces';
import { BoxMessage } from '@/components/BoxMessage';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

import { Debug } from '@/components/Debug';

interface pageProps {
  projectid: string;
  sample: Sample;
}

const Stats: FC<pageProps> = params => {
  const { sample } = params;
  const t = useTranslations('SamplePageStats');

  console.log('Metadata params: ', params);
  console.log('Metadata params sample: ', params.sample);

  const info = {
    title: t('Stats_Info_Project', { name: sample?.project?.name || '' }),
    subtitle: t('Stats_Info_Sample', { name: sample?.name || '' }),
  };

  return (
    <>
      <section>
        <BoxMessage title={info.title} subtitle={info.subtitle} button={undefined}>
          <InformationCircleIcon />
        </BoxMessage>

        {sample && sample.project != null && sample.project.instrumentId == null && (
          <BoxMessage
            title="Your project isn't linked to any instrument! Please link it to an existing or new instrument."
            subtitle="You cannot scan without scanning instrument."
            button={{
              href: `/projects/${sample.projectId}`,
              text: 'Add instrument',
            }}
          >
            <CloudIcon />
          </BoxMessage>
        )}
      </section>
      <section>
        <Debug title="Sample" params={sample} pre={true} open={true} />
      </section>
    </>
  );
};

export default Stats;
