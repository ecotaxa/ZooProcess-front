"use client"

import Head from 'next/head';
// import { Box, Container, Stack, Typography } from '@mui/material';
import { FC } from "react";

// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import { ProjectsTable } from 'src/sections/projects/projects-table';
import { MyForm } from '@/components/myForm';
import { inputFormElements } from '@/config/formElements';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addSample } from '@/app/api/samples';
import { Debug } from '@/components/Debug';
import { debug } from '@/config/settings';
 






const forms = [
    // sampleid_formElements, 
    inputFormElements, 
    // inputFormElements_tow_type_vertical, 
    // fraction_inputFormElments
]

// interface pageProps {
//     params: {
//         projectid: string
//     }
// }

// const NewSample : FC<pageProps> = (params) => {
const NewSample = ({projectid}:{projectid: string}) => {

    const router = useRouter()
    // const projectid = {params}
    // console.log("NewSample params: ", params);
    // console.log("NewSample params projectid: ", params.params.projectid);
    console.log("NewSample params projectid: ", projectid);
    // console.log("NewSample params projectid: ", params.projectid);

    // const projectid = router.query.projectid //as string
    // const projectId = params.params.projectid;
    // const projectId = params.projectid;

    const emptyData = {
        "scientific_program": "ZooProcess",
    }

    const form : any = []
        form['forms']=forms
        form['value']= emptyData //debug ? subsampleTestData : emptyData
        form['title']='Sample metadata'
        form['subtitle']='Fill all the mandatory fields.'



    // const [stringifiedData,setData] = useState(JSON.stringify(testData, null, 2))
    const [stringifiedData, setData] = useState("")
    // var stringifiedData = "" ;

    const prepareData = (data:any) => {

        let newData = {
            ...data,
            projectId: projectid
        }
        console.log("newData: ", newData);
        return newData;
    }

    const onChange = (value:any) => {

        const changeValue = (value:Map<string,string>) : Map<string,string> => {

            if ("sample_id" in value.keys && "project" in value.keys){
                const project = value.get("project") || ""
                const sample_id = value.get("sample_id") || ""
                value.set("sample_id", project + sample_id)
            }

            return value

        }

        console.log("App onChange:", value)
        // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
        // stringifiedData = JSON.stringify(value, null, 2);

        setData(JSON.stringify(value, null, 2))
        console.log("App onChange:", stringifiedData)

        // const newData = prepareData(value)

        const data = {
            name: `${projectid}_${value.sample_id}`, //"Sample XXXX",
            metadataModelId: "6565df171af7a84541c48b20",
            data:value,
        }

        console.log("newData: ", data);
        // try {

            console.log("----- projectId : ", projectid);
            console.log("----- name : ", data.name);
            // console.log("----- params.projectid : ",params.projectid);
            // console.log("----- params : ",params);
            // console.log("----- params.params : ",params.params);

            // addSample(projectId, data)
            return addSample({
                projectId: projectid, // : params.params.projectid, 
                data
            })

        // }
        // catch (e:any){
        //     console.log(e);
            
        // }
    }

    const onCancel = () => {
        router.back()
        // router.push({
        //     pathname: '/projects/[projectid]',
        //     query: { projectid: projectid },                                         
        // })
    }

    return (
        <>
        {/* <Head>
            <title>
            New Sample Metadata | ZooProcess
            </title>
        </Head> */}
        {/* <Debug params={params}/> */}
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

            <div className="text-center justify-center">
                {/* <Stack spacing={3}> */}
                    {/* <Typography variant="h4"> */}
                    {/* <h4>Sample Metadata to project {params.projectid}</h4> */}
                    <h4>Sample Metadata to project {projectid}</h4>
                    {/* </Typography> */}
                    <MyForm 
                        {...form} 
                        project={projectid}
                        onChange={onChange} 
                        onCancel={onCancel}/>
                {/* </Stack> */}
            </div>
        </section>
        </>
    );
}


export default NewSample;
