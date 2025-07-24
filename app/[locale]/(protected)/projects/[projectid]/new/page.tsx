import { getProject } from '@/app/api/data/projects';
import NewSampleForm from './newSampleForm';

interface pageProps {
  params: {
    projectid: string;
  };
}

// const NewSubSample : FC<pageProps> = async (params ) => {
// const NewSubSample : FC<pageProps> = async ({projectid, sampleid}: pageProps) => {
// const NewSubSample = async ({projectid, sampleid}: pageProps) => {

// const NewSample : FC<pageProps> = async (params) => {
const NewSample = async (params: pageProps) => {
  // const {projectid} = params;
  const projectid = params.params.projectid;

  console.log('NewSample params projectid: ', projectid);
  const projectId = projectid;
  const project = await getProject(projectid);

  return (
    <>
      <div>{project.name} </div>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
          <NewSampleForm project={project} />
        </div>
      </section>
    </>
  );
};

export default NewSample;
