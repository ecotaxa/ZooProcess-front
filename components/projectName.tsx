import { useProject } from "@/app/api/projects";
import { MySpinner } from "./mySpinner";
import { ErrorComponent } from "./ErrorComponent";
import * as api from "@/app/api/network/zooprocess-api";
import { th } from "date-fns/locale";
import { Project } from "@/app/api/network/interfaces";


async function getProject(projectid:string): Promise<Project> {
  try {
    const project = await api.getProject(projectid);
    return project;
  } catch (error) {
    console.error("Error - getProject()", error);
    throw error;
  }
}

interface ProjectNameProps {
    id: string;
  };


async function ProjectName ({
    id,
  }: ProjectNameProps) : Promise<JSX.Element> {
    
    // const { project, isLoading, isError } = useProject(id)

    const project = await getProject(id);
    
    // if (isLoading) return <MySpinner />
    // if (isError) return <ErrorComponent error={isError}/>
  
  

    return (
    //   <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
        <div>
            <h1>Project</h1>
            <br/>
            <h1>{project.name}</h1>
      </div>
    );
  };
  