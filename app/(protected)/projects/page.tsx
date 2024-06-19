"use client";

import { useProjects } from '@/app/api/projects';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MySpinner } from '@/components/mySpinner'
import { ErrorComponent } from '@/components/ErrorComponent'
import { ProjectsTableNextUI as ProjectsTable } from '@/components/projects-table'
import { Button, Card, CardBody, CardFooter, CardHeader, Link, Spacer } from '@nextui-org/react';
import { Project, Sample, Samples, SubSample } from '@/app/api/network/zooprocess-api';
// import { auth } from '@/auth';

// import { Projects } from "@/app/api/network/zooprocess-api"


// const castArray = (value:Array<any>) => Array.isArray(value) ? value : [value];

const ProjectsPage = () => {

    const formatData = (data:any) => {
        const projects = data.map( (project:Project) => {
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

            // const subsampleids = project.samples?.flatMap( 
            //     (sample:Sample) => {
            //         const subsamplesids = sample.subsample?.map( (subsample:SubSample) => subsample.id )
            //     }
            // )
            // console.log("subsampleids: ", subsampleids);
            // const nbscans = subsampleids?.length || 0;

            const nbscans = project.samples?.flatMap( sample => sample.subsample?.map( (sub:SubSample) => sub.scan.length || 0 ) ).reduce( (a,b) => a + b, 0) || 0;
            console.log("nbscans: ", nbscans);

            // ici les colonnes qui m'interresse pour mon tableau
            return {
                id: project.id,
                name: project.name,
                drive: project.drive.name,
                sample:project.samples?.length || 0,
                scan: nbscans,
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

    // const session = auth()
    // console.log("project pages globalThis.token :", globalThis.token)


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

export default ProjectsPage;
