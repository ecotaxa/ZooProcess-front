"use client"

import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { FC } from "react";

// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import { ProjectsTable } from 'src/sections/projects/projects-table';
import { MyForm } from '@/components/myForm';
import { inputFormElements } from '@/config/formElements';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addSample } from '@/app/api/samples';
import { Debug } from '@/Components/Debug';
 




const testData = {
    //"sample_name":"dyfamed_wp2_2023_biotom_sn001",
    "sample_id": "dyfamed_wp2_2023_biotom_sn001",
    "scientific_program": "ZooProcess",
    "latitude_ns": 1,
    "station_id": "dyfamed",
    "bottom_depth": "2400",
    "sampling_date": "2022-11-13T00:13:40.000Z",
    // "sampling_date": "2023-10-09T09:13:40.000Z",
    "Latitude_degree": "43",
    "longitude_degree": "7",
    "latitude_minute": "25",
    "longitude_minute": "51",
    "longitude_ew": 1,
    "tow_type": "1",
    "net_sampling_type": "WP2",
    "net_mesh": "200",
    "net_opening_surface": "0.25",
    "minimum_depth": "1",
    "maximum_depth": "1",
    "quality_flag_for_depth_measurement": "2",
    "ship_speed": "99999",
    "cable_speed": "99999",
    "cable_length": "99999",
    "cable_angle_from_vertical": "45",
    "sampling_duration": "5"
}

const forms = [
    // sampleid_formElements, 
    inputFormElements, 
    // inputFormElements_tow_type_vertical, 
    // fraction_inputFormElments
]

interface pageProps {
    // params: {
        projectid: string
    // }
}

const NewSample : FC<pageProps> = (params) => {

    const router = useRouter()
    console.log("NewSample params: ", params);
    console.log("NewSample params projectid: ", params.params.projectid);
    // console.log("NewSample params projectid: ", params.projectid);

    // const projectid = router.query.projectid //as string
    const projectId = params.params.projectid;
    // const projectId = params.projectid;

    const emptyData = {
        "scientific_program": "ZooProcess",
    }

    const form : any = []
        form['forms']=forms
        form['value']=testData//emptyData
        form['title']='Sample metadata'
        form['subtitle']='Fill all the mandatory fields.'



    // const [stringifiedData,setData] = useState(JSON.stringify(testData, null, 2))
    const [stringifiedData,setData] = useState("")
    // var stringifiedData = "" ;

    const prepareData = (data:any) => {

        let newData = {
            ...data,
            projectId:projectId
        }
        console.log("newData: " , newData);
        return newData;
    }

    const onChange = (value:any) => {
        console.log("App onChange:", value)
        // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
        // stringifiedData = JSON.stringify(value, null, 2);

        setData(JSON.stringify(value, null, 2))
        console.log("App onChange:", stringifiedData)

        // const newData = prepareData(value)

        const data = {
            name:value.sample_id, //"Sample XXXX",
            metadataModelId:"6565df171af7a84541c48b20",
            data:value,
        }

        console.log("newData: ", data);
        try {

            console.log("----- projectId : ",projectId);
            // console.log("----- params.projectid : ",params.projectid);
            // console.log("----- params : ",params);
            // console.log("----- params.params : ",params.params);

            // addSample(projectId, data)
            addSample({
                projectId, // : params.params.projectid, 
                data
            })

        }
        catch (e:any){
            console.log(e);
            
        }
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
        <Head>
            <title>
            New Sample Metadata | ZooProcess
            </title>
        </Head>
        <Debug params={params}/>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

            <div className="text-center justify-center">
                <Stack spacing={3}>
                    <Typography variant="h4">
                    Sample Metadata to project {projectId}
                    </Typography>
                    <MyForm 
                        {...form} 
                        project={projectId}
                        onChange={onChange} 
                        onCancel={onCancel}/>
                </Stack>
            </div>
        </section>
        </>
    );
}


export default NewSample;
