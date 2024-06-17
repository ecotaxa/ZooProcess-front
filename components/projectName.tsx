import { useProject } from "@/app/api/projects";
import { MySpinner } from "./mySpinner";
import { ErrorComponent } from "./ErrorComponent";


interface ProjectNameProps {
    id: string;
  };


export const ProjectName = ({
    id,
  }: ProjectNameProps) => {
    
    const { project, isLoading, isError } = useProject(id)

    if (isLoading) return <MySpinner />
    if (isError) return <ErrorComponent error={isError}/>
  
    return (
    //   <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
        <div>
            <h1>Project</h1>
            <br/>
            <h1>{project.name}</h1>
      </div>
    );
  };
  