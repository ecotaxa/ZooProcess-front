import { getProject } from '@/app/api/network/zooprocess-api';
import { FC } from 'react';
import { timelist } from './eStateBackground';
import { Timeline_scan } from '@/components/timeline-scan';
import { BackgroundTimeline } from './backgroundTimeline';

type pageProps = {
  params: {
    projectid: string;
    // sampleid: string,
    // subsampleid: string,
  };
};

const BackgroundScanPage: FC<pageProps> = async ({ params }) => {
  // const {projectid, sampleid, subsampleid} = params;
  const { projectid } = params;
  const project = await getProject(projectid);

  return (
    <>
      <div>{project.name} </div>

      {project.instrument && (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="text-center justify-center">
            {/* Sub Sample|undefined = undefined; Metadata to sample {sampleid} from project {projectid} */}
            from project {projectid}
            {/* <Timeline_scan list={timelist} current={0} /> */}
            <BackgroundTimeline project={project} instrument={project.instrument} />
          </div>
        </section>
      )}

      {project.instrument == null && <div>You have no instrument defined in your project</div>}
    </>
  );
};

export default BackgroundScanPage;
