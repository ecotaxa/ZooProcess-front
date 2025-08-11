// import { getProject } from "@/app/api/data/projects";
import { getSample } from '@/app/api/data/samples';
import { getSubSample } from '@/app/api/data/subsamples';
import { FC } from 'react';
import ViewPage from './view';

type pageProps = {
  params: {
    projectid: string;
    sampleid: string;
    subsampleid: string;
  };
};

const CheckPage: FC<pageProps> = async ({ params }) => {
  const { projectid, sampleid, subsampleid } = params;

  // const project = await getProject(projectid);
  const sample = await getSample(projectid, sampleid);
  const subsample = await getSubSample(projectid, sampleid, subsampleid);

  // console.log("sample: ", sample)
  // console.log("subsample: ", subsample)

  //http://localhost:3001/projects/67fde1fa7724babc8c40bef2/samples/67fde6ce7724babc8c40bf93?state=subsamples
  const backUrl = `/projects/${projectid}/samples/${sampleid}?state=subsamples`;

  return (
    <>
      <section>
        <h1>Scan View</h1>
        {/* <h3>{projectid}</h3>
            <h3>{sampleid}</h3>
            <h3>{subsampleid}</h3> */}
        <h1>
          {sample.project.name} / {sample.name} / {subsample.name}
        </h1>

        <Link href={backUrl}>Back to subsample list</Link>
        <ViewPage sample={sample} subsample={subsample} />
      </section>
    </>
  );
};

export default CheckPage;
