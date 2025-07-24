import { getProject } from '@/app/api/data/projects';
import NewSubSampleForm from './newSubSampleForm';
import { getSample } from '@/app/api/data/samples';

interface pageProps {
  params: {
    projectid: string;
    sampleid: string;
  };
}

// const NewSubSample : FC<pageProps> = async (params ) => {
// const NewSubSample : FC<pageProps> = async ({projectid, sampleid}: pageProps) => {
// const NewSubSample = async ({projectid, sampleid}: pageProps) => {

// const NewSample : FC<pageProps> = async (params) => {
const NewSample = async (params: pageProps) => {
  // const {projectid} = params;
  const { projectid, sampleid } = params.params;

  console.log('NewSample params projectid: ', projectid);
  const projectId = projectid;
  const sample = await getSample(projectid, sampleid);

  return (
    <>
      <div>
        {sample.project.name} / {sample.name}{' '}
      </div>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
          <NewSubSampleForm project={sample.project} sample={sample} />
        </div>
      </section>
    </>
  );
};

export default NewSample;
