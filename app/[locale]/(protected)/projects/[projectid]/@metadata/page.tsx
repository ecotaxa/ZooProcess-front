"use client"

import Head from 'next/head';

import { updateProject } from "@/app/api/projects";
import { projectForm } from "@/config/formElements";
import { FC, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { MyForm } from '@/components/myForm';
import { Debug } from '@/components/Debug';
import { Project } from '@/app/api/network/interfaces';

import { useTranslations } from 'next-intl' ;

interface pageProps {
      project: Project
  }

const Metadata : FC<pageProps> = (params) => {
  const router = useRouter();

  console.log("Metadata params: ", params);
  const [ projectData, setProject ] = useState(params.project)

  function isEmpty(obj:Object) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
  
    return true
  }



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

          "scanningOptions": project.scanningOptions || "",
          "serial": project.instrument?.id || 0,
          "scanner":{ id:project.instrument?.id || 0, "settingsId": project.scanningOptions || undefined}

      }


      return proj;
    }

    let emptyProject = {
      // "project_id": null,
      "name": null, // "Zooscan_",
      "drive": null,
      "acronym": null,
      "description": null,
      "ecotaxa_project_title":null,
      "ecotaxa_project":null
    }

    const initForm = () => {
      let localform : any = {}
      localform['forms'] = projectForm;
      localform['value'] = emptyProject;
      localform['title'] = 'Update Project';
      localform['subtitle'] = 'Modify your project metadata';

      return localform
    }

    let form = initForm()

   

  const ProjectForm = () => {

    const data = {
      ...params.project,
      projectData
    }

    const id = params.project.id
    console.log("projectMetadata: ", data);

    form = { 
      ...form, 
      value:fillProject(data),
      project:{id} // outside id for the update query :(
    }


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
    const project = updateProject(value);

    return project
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
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

          <div className="text-center justify-center">
            <h1>Metadata</h1>

            <ProjectForm/>
          </div>
        </section>
            <Debug params={params.project} title='project' pre={true}/>
            <Debug params={projectData} title='projectData' pre={true}/>
      </>
    );

}



export default Metadata;
