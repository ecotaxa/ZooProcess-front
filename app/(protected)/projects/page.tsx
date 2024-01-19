"use client";

import { useProjects } from '@/app/api/projects';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MySpinner } from '@/components/mySpinner'
import { ErrorComponent } from '@/components/ErrorComponent'
import { ProjectsTableNextUI as ProjectsTable } from '@/components/projects-table'
import { Button, Card, CardBody, CardFooter, CardHeader, Link, Spacer } from '@nextui-org/react';

// import { Projects } from "@/app/api/network/zooprocess-api"


// const castArray = (value:Array<any>) => Array.isArray(value) ? value : [value];

const Projects = () => {

    const formatData = (data:any) => {
        const projects = data.map( (project:any) => {
            const createdAt = new Date(project.createdAt)
            console.log("createdAt: ", createdAt)

            let updatedAt = undefined;
            if (project.updatedAt){
                try {
                    updatedAt = new Date(project.updatedAt)
                }
                catch {
                    updatedAt = createdAt;
                }
            } else {
                updatedAt = createdAt;
            }

            // ici les colonnes qui m'interresse pour mon tableau
            return {
                id: project.id,
                name: project.name,
                drive: project.drive.name,
                sample:0,
                scan:0,
                createdAt,
                updatedAt,
                // description: project.description,
                // scanningOptions: project.scanningOptions,
                qc: project.qc || "TODO"  
            }
        });
    
        console.log(projects);
        return projects;
    }

    const { projects, isLoading, isError } = useProjects()
    const [ projectList, setProjectList ] = useState([projects])
    const router = useRouter()
    
    useEffect( () => { 
        if ( Object.keys(projects).length == 0) return;

        console.log("projects have changed (only useful columns for the table)", projects);
        const data = formatData(projects)
        setProjectList(data);
      } , [projects])

    //   const handleNewProjectBtn = () => {
    //     router.push('/projects/new')
    //     // router.push(
    //     //   '/projects/new',
    //     // )
    //   }

      
    
    const ShowData = () => {
        if (isLoading) return <MySpinner />
        if (isError) return <ErrorComponent error={isError}/>
        return <ProjectsTable projects={projectList}/>
      }

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="text-center justify-center">
                <h4 data-testid="title">
                    Projects
                </h4>
                <Spacer y={5}/>
                <Card className="inline-block "
                    data-testid="projectCard" 
                    >
                    <CardHeader className="flex flex-row-reverse py-3">
                        <Button 
                            href="projects/new"
                            as={Link}
                            color="primary"
                            // showAnchorIcon
                            variant="solid"
                            data-testid="newProjectBtn"
                            >Add new project</Button>
                    </CardHeader>
                    <CardBody>
                        <ShowData/>
                    </CardBody>

                </Card> 
            </div>
        </section>
    );
};

export default Projects;
