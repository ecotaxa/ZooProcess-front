import * as api from '@/app/api/network/zooprocess-api';
import { Project } from '@/app/api/network/interfaces';

async function getProject(projectid: string): Promise<Project> {
  try {
    const project = await api.getProject(projectid);
    return project;
  } catch (error) {
    console.error('Error - getProject()', error);
    throw error;
  }
}

interface ProjectNameProps {
  id: string;
}

async function ProjectName({ id }: ProjectNameProps): Promise<JSX.Element> {
  const project = await getProject(id);

  return (
    <div>
      <h1>Project</h1>
      <br />
      <h1>{project.name}</h1>
    </div>
  );
}
