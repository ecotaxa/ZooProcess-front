"use client"

import Head from 'next/head';
import { Stack, Typography } from '@mui/material';
import { FC } from "react";

// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import { ProjectsTable } from 'src/sections/projects/projects-table';
import { MyForm } from '@/components/myForm';
import { fraction_inputFormElments } from '@/config/formElements';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { addSample } from '@/app/api/samples';
import { Debug } from '@/components/Debug';
import { addSubSample, useSubSample } from '@/app/api/subsamples';
import { Timeline_scan } from '@/components/timeline-scan';
// import { useUserMe } from '@/app/api/user';
import { MySpinner } from '@/components/mySpinner';
import { ErrorComponent } from '@/components/ErrorComponent';
import { useUserMe } from '@/app/api/user';
import { useProject } from '@/app/api/projects';
import { IMetadata, SubSample, User } from '@/app/api/network/zooprocess-api';
// import { useProject } from '@/app/api/projects';
// import { auth } from '@/auth';
 





const forms = [
    // sampleid_formElements, 
    // inputFormElements, 
    // inputFormElements_tow_type_vertical, 
    fraction_inputFormElments
]

interface pageProps {
    // params: {
        projectid: string
        sampleid: string
        subsampleid?: string
        onChange?: () => void
    // }
}

// const SubSampleForm : FC<pageProps> = (params ) => {
const SubSampleForm =  ( params: pageProps) => {

    const router = useRouter()
    
    console.debug("SubSampleForm params: ", params);
    // console.log("NewSample params projectid: ", params.projectid);
    // console.log("NewSample params sampleid: ", params.sampleid);
    // console.log("NewSample params projectid: ", params.projectid);

    // const projectid = router.query.projectid //as string
    // const projectid = params.params.projectid;
    // const sampleid = params.params.sampleid;
    const projectid = params.projectid;
    const sampleid = params.sampleid;
    const projectId = params.projectid;
    const subsampleid =  params.subsampleid
    console.log("NewSample params projectid: ", projectid);
    console.log("NewSample params sampleid: ", sampleid);
    console.log("NewSample params subsampleid: ", subsampleid);
    
    // const { projectid, sampleid } = params
    // const { user, isLoading: isLoadingUser, isError:isErrorUser } = useUserMe()
    // const { project, isLoading:l , isError:err } = useProject()
    const { subsample, isLoading, isError } = useSubSample(projectId, sampleid, subsampleid)

    // if (isError) {
    //     // Handle error
    //     return <div>Error loading user data</div>
    // }

    // if (isLoading) {
    //     // Show loading state
    //     return <div>Loading...</div>
    // }

 



    // const emptyData = {
    //     "scanning_operator":user.name, // "Seb"  // 
    // }

    // const updatedForm = forms

    // const form : any = []
    //     form['forms']=updatedForm
    //     form['value']=emptyData//testData//
    //     form['title']='Sub Sample metadata'
    //     form['subtitle']='Fill all the mandatory fields.'



    // const [stringifiedData,setData] = useState(JSON.stringify(testData, null, 2))
    const [stringifiedData, setData] = useState("")
    // var stringifiedData = "" ;

    const prepareData = (data:any) => {

        let newData = {
            ...data,
            sampleId: sampleid
        }
        console.log("newData: ", newData);
        return newData;
    }

    const onChange = (value:any) => {
        console.log("App onChange:", value)
        params.onChange && params.onChange()
        console.log("App onChange:", stringifiedData)
        return Promise.resolve() // le form attends une réponse pour gerer le bouton "submit", ici on ne change rien
    }

    // const onChange = (value:any) => {
    //     console.log("App onChange:", value)
    //     // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
    //     // stringifiedData = JSON.stringify(value, null, 2);

    //     setData(JSON.stringify(value, null, 2))
    //     console.log("App onChange:", stringifiedData)

    //     // const newData = prepareData(value)

    //     const data = {
    //         name: value.scan_id, //"Sample XXXX",
    //         metadataModelId: "", //"6565df171af7a84541c48b20",
    //         data: value,
    //     }

    //     console.log("newData: ", data);
    //     // try {

    //         console.log("----- projectId: ", projectid);
    //         console.log("----- sampleId: ", sampleid);
    //         // console.log("----- params.projectid : ",params.projectid);
    //         // console.log("----- params : ",params);
    //         // console.log("----- params.params : ",params.params);

    //         // addSample(projectId, data)
    //         return addSubSample({
    //             projectId: projectid, // : params.params.projectid,
    //             sampleId: sampleid, 
    //             data
    //         })
    //         .then((response) => {
    //             console.log("Go To the infos page" )
    //             // router.push(`${response.data.id}`)
    //             // const path = `/projects/${projectId}/samples/${sampleId}/subsamples/new/scan/${response.data.id}/preview`
    //             const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${response.data.id}`
    //             router.push(path)
    //         })
    //         .catch((error) => {
    //             return Promise.reject(error)
    //         })

    //     // }
    //     // catch (e:any){
    //     //     console.log(e);
            
    //     // }
    // }

    const onCancel = () => {
        router.back()
        // router.push({
        //     pathname: '/projects/[projectid]',
        //     query: { projectid: projectid },                                         
        // })
    }

    const formButtons = {
        // submit:'Scan'
        submit:'Next'
    }

    type DataReturn = Map<string,any>

    // type MetadataType = {
    //     id: String
    //     name: string
    //     type: String
    //     value: String
    //     sample_id: String
    //   }

    const fillSample = (sample:SubSample) : DataReturn => { 
          console.log("fillSample: ", sample);
          
          let form: any = {}
  
          sample.metadata.forEach((element:IMetadata) => {
            if ( element.type == 'number'){
              form[element.name] = Number(element.value)
            } else {
              form[element.name] = element.value
            }
          });
  
        return form;
      }

    const formatData = (subsample:SubSample|any) => {
        console.log("formatData() ");
        console.log("formatData() subsample: ", subsample);

        const data = {
            "scan_id":subsample.scan_id,
            "fraction_number":subsample.fraction_number,
            "fraction_id_suffix":subsample.fraction_id_suffix,
            "scanning_operator":subsample.user.name, // "Seb"  // 

            "fraction_min_mesh":subsample.fraction_min_mesh,
            "fraction_max_mesh":subsample.fraction_max_mesh,
            "spliting_ratio":subsample.spliting_ratio,
            "observation":subsample.observation,
        }
    
        console.log("formatData() data: ", data);

        const updatedForm = forms
    
        const form : any = []
            form['forms']=updatedForm
            // form['value']=data//testData//
            form['value']=fillSample(subsample)
            form['title']='Sub Sample metadata'
            form['subtitle']='Fill all the mandatory fields.'
    
        return form;
    }


    const showForm = (subsample:SubSample|any) => {

        if (isLoading) return <MySpinner />;
        if (isError) return <ErrorComponent error={isError} />;

        // if ( ! user) return <ErrorComponent error={isError} />

        // else {
        const form = formatData(subsample)

        return (
            <MyForm 
                {...form} 
                project={projectid}
                sample={sampleid}
                onChange={onChange}
                onCancel={onCancel}
                button={formButtons}
            />
        )
        // }
    }


    return (
        <>
            {showForm(subsample)}
        </>
    );
}


export default SubSampleForm;
