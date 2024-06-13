"use client"

import Head from 'next/head';

import { updateProject, useProject } from "@/app/api/projects";
import { ErrorComponent } from "@/components/ErrorComponent";
import { MySpinner } from "@/components/mySpinner";
import { projectForm } from "@/config/formElements";
import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';

// import { Project as IProject } from '@/app/api/network/zooprocess-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { MyForm } from '@/components/myForm';
import { Debug } from '@/components/Debug';

interface pageProps {
    // params: {
      projectid: string
    // }
  }

const Metadata : FC<pageProps> = (params) => {
  const router = useRouter();

  const projectId = params.projectid ;
  console.log("Metadata params: ", params);
  console.log("Metadata params projectid: ", params.projectid);

  const { project, isLoading, isError } = useProject(projectId)
  // const [ sampleList, setSampleList ] = useState(project)

  const fillProject = (project:any) : any => { 
        console.log("fillProject: ", project);
        
      let proj = {
          "id":project.id,
          "name": project.name,
          "cdrive":project.drive,
          "drive": project.drive.id,
          "description": project.description || "",
          "acronym": project.acronym || "",
          "ecotaxa_project_title": project.ecotaxa?.name || "",
          "ecotaxa_project": project.ecotaxa?.projectId || "",
          "scanningOptions": project.scanningOptions || 0,
          "serial": project.instrument.id || 0,
          "xoffset_large": project.instrument.calibration.xOffset || 0,
          "yoffset_large": project.instrument.calibration.yOffset || 0,
          "xsize_large": project.instrument.calibration.xSize || 0,
          "ysize_large": project.instrument.calibration.ySize || 0,
      }

      // if (project.instrument.id) {
      // }

      return proj;
    }

    const initForm = () => {
      let localform : any = {}
      localform['forms'] = projectForm; //driveList
      localform['value'] = {};
      localform['title'] = 'Update Project';
      localform['subtitle'] = 'Modify your project metadata';

      // setForm(localform)
      return localform
    }

    let form = initForm()

  //   let emptyProject = {
  //     // "project_id": null,
  //     "name": null, // "Zooscan_",
  //     "drive": null,
  //     "acronym": null,
  //     "description": null,
  //     "ecotaxa_project_title":null,
  //     "ecotaxa_project":null
  // }

  const ProjectForm = () => {
    if (isLoading) return <MySpinner />
    if (isError) return <ErrorComponent error={isError}/>
    // return <SamplesTable projectId={projectId} samples={sampleList}/>
    
    //const projectMetadata = 

    form = { 
      ...form, 
      value:fillProject(project),
      project:{projectId}
    }
    // form['value'] = fillProject(project)
    // setForm(f)
    // form['value'] = projectMetadata;

    console.log("projectMetadata: ", form);

    return (
        <MyForm {...form} 
            onChange={onChange} 
            onCancel={onCancel}
        />
    )
  }

       
  // onSubmit
  const onChange = (value:any) => {
    console.log("Project metadata onChange:", value)
    // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
    // stringifiedData = JSON.stringify(value, null, 2);

    // POUR AFFICHAGE DEBUG
    // setData(JSON.stringify(value, null, 2))
    // console.log("App onChange:", stringifiedData)
    // console.log("App onChange:", JSON.stringify(value, null, 2));

    return updateProject(value);
  }

  
  const onCancel = () => {
      //router.back()
      // router.push({
      //     pathname: '/projects/',
      //     // query: { pid: params.id },                                         
      // })
  }



  return (
        <>
        <Head>
            <title>
            Metadata | ZooProcess
            </title>
        </Head>
        <h1>{projectId}</h1>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

          <div className="text-center justify-center">
            <Stack spacing={3}>
            <h1>Metadata</h1>
            <Debug params={project} title='project'/>
            <ProjectForm/>
            </Stack>
          </div>
        </section>
        </>
    );

}



export default Metadata;
