import { getProject } from '@/app/api/network/zooprocess-api';
import { FC } from 'react';
import BackgroundUpload from './backgroundUpload';
import { Project } from '@/app/api/network/interfaces';

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

  // const project = await getProject(projectid);
  const project: Project = await getProject(projectid);

  return (
    <div>
      <BackgroundUpload params={project} />
    </div>
  );
};

export default BackgroundScanPage;
