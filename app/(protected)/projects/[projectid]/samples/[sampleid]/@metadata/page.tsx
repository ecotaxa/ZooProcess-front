"use client"

import Head from 'next/head';

import { updateSample, useSample } from "@/app/api/samples";
import { ErrorComponent } from "@/components/ErrorComponent";
import { MySpinner } from "@/components/mySpinner";
import { inputFormElements, projectForm } from "@/config/formElements";
import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';

// import { Project as IProject } from '@/app/api/network/zooprocess-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { MyForm } from '@/components/myForm';
import {  IMetadata } from '@/app/api/network/zooprocess-api';

interface pageProps {
    // params: {
      projectid: string,
      sampleid: string
    // }
  }

const Metadata: FC<pageProps> = (params) => {
  const router = useRouter();

  const projectId = params.projectid;
  const sampleId = params.sampleid;
  console.log("Metadata params: ", params);
  console.log("Metadata params projectid: ", params.projectid);

  const { sample, isLoading, isError } = useSample(projectId, sampleId)
  // const [ sampleList, setSampleList ] = useState(project)


  type MetadataType = {
    id: String
    name: string
    type: String
    value: String
    sample_id: String
  }

  type MetadataModel = {
    id: string
    description: String
    name: String
    value:String
  }

  type Sample = {
    id: string
    metadata: Array<MetadataType>
    metadataModel: MetadataModel
    name: string
    projectID: string
    subsample: Array<any>
  }

  type DataReturn = Map<string, any>

  const fillSample = (sample: Sample) : DataReturn => { 
        console.log("fillSample: ", sample);
        
        let form: any = {}

        sample.metadata.forEach((element:MetadataType) => {
        // sample.metadata.forEach((element:Metadata) => {
          if ( element.type == 'number'){
            form[element.name] = Number(element.value)
          } else {
            form[element.name] = element.value
          }

          if ( element.type == 'object'){
            console.log("OBJECT FOUND")
          }

        });

      return form;
    }

  //   const forms = [
  //     // sampleid_formElements, 
  //     inputFormElements, 
  //     // inputFormElements_tow_type_vertical, 
  //     // fraction_inputFormElments
  // ]

    const initForm = () => {
      let localform : any = {}
      localform['forms'] = [inputFormElements]; //driveList
      localform['value'] = {};
      localform['title'] = 'Update Sample';
      localform['subtitle'] = 'Modify your sample metadata';

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

  const SampleForm = () => {
    if (isLoading) return <MySpinner />
    if (isError) return <ErrorComponent error={isError}/>
    // return <SamplesTable projectId={projectId} samples={sampleList}/>
    
    //const projectMetadata = 
    console.log("Sample: ", sample)

    form = { 
      ...form,
      value: fillSample(sample),
      project: projectId,
      sample: sampleId
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

      // const v = { ...value, project: projectId, sample: sampleId }

      return updateSample( { projectId, sampleId , data: value } );
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
        <h1>{sampleId}</h1>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

        <div className="text-center justify-center">
            <Stack spacing={3}>
            <h1>Metadata</h1>
                <SampleForm/>
            </Stack>
            </div>
        </section>
        </>
    );

}




export default Metadata;
