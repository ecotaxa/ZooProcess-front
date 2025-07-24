// import { useState, useEffect } from 'react'
import { MySpinner } from '@/components/mySpinner';
import { ErrorComponent } from '@/components/ErrorComponent';
import { ProjectsTableNextUI as ProjectsTable } from '@/components/projects-table';
import { Button, Card, CardBody, CardHeader, Link, Spacer } from '@heroui/react';
import * as api from '@/app/api/network/zooprocess-api';
// import { Project } from '@/app/api/network/zooprocess-api'
import { Project, Projects } from '@/app/api/network/interfaces';

interface ServerSideProps {
  initialProjects: Projects;
}

// export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
//   const projects = await api.getProjects()//'/projects/')
//   return { props: { initialProjects: projects } };
// }

async function getProjects(): Promise<Projects> {
  try {
    const projects = await api.getProjects();
    return { data: Array.isArray(projects) ? projects : [] };
  } catch (error) {
    console.error('Error - getProjects()', error);
    return { data: [] };
  }
}

// const ProjectsPage: NextPage<ServerSideProps> = ({ initialProjects }) => {
//   const [projects, setProjects] = useState<api.Projects>(initialProjects)
async function ProjectsPage() {
  const initialProjects = await getProjects();

  const t = await getTranslations('ProjectsPage');

  const formatData = (data: Project[]) => {
    return data.map((project: Project) => {
      const createdAt = new Date(project.createdAt);
      const updatedAt = project.updatedAt ? new Date(project.updatedAt) : createdAt;
      const nbscans =
        project.samples
          ?.flatMap(sample => sample.subsample?.map((sub: any) => sub.scan.length || 0))
          .reduce((a, b) => a + b, 0) || 0;
      // const nbscans = project.samples?.flatMap(sample => sample.scanSubsamples?.map((sub: any) => sub.scan.length || 0)).reduce((a, b) => a + b, 0) || 0

      return {
        id: project.id,
        name: project.name,
        drive: project.drive.name,
        sample: project.samples?.length || 0,
        scan: nbscans,
        createdAt,
        updatedAt,
        qc: project.qc || 'TODO',
      };
    });
  };

  // const [projectList, setProjectList] = useState(() => formatData(initialProjects.data))
  const projectList = formatData(initialProjects.data);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center justify-center">
        <h4 data-testid="title">{t('Title')}</h4>
        <Spacer y={5} />
        <Card className="inline-block" data-testid="projectCard">
          <CardHeader className="flex flex-row-reverse py-3">
            <Button
              href="projects/new"
              as={Link}
              color="primary"
              variant="solid"
              data-testid="newProjectBtn"
            >
              {t('Add')}
              {/* Add New Projects */}
            </Button>
          </CardHeader>
          <CardBody>
            {projectList.length > 0 ? <ProjectsTable projects={projectList} /> : <MySpinner />}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default ProjectsPage;
