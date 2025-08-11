import { MySpinner } from '@/components/mySpinner.tsx';
import { ProjectsTableNextUI as ProjectsTable } from '@/components/projects-table.jsx';
import { Button, Card, CardBody, CardHeader, Link, Spacer } from '@heroui/react';
import * as api from '@/app/api/network/zooprocess-api.ts';
import { Project, Projects } from '@/app/api/network/interfaces.ts';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

async function getProjects(): Promise<Projects> {
  try {
    try {
      const projects = await api.getProjects();
      return { data: Array.isArray(projects) ? projects : [] };
    } catch (error) {
      console.error('Error - getProjects()', error);
      return { data: [] };
    }
  } catch (error) {
    console.error('Error - getProjects()', error);
    return Promise.resolve({ data: [] });
  }
}

function ProjectsPage() {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation('ProjectsPage');

  useEffect(() => {
    setIsLoading(true);
    getProjects()
      .then(projects => {
        const formattedData = formatData(projects.data);
        setProjectList(formattedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setProjectList([]);
        setIsLoading(false);
      });
  }, []);

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
            {isLoading ? <MySpinner /> : <ProjectsTable projects={projectList} />}
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default ProjectsPage;
