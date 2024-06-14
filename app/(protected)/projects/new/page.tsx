"use client"

import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';

// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import { ProjectsTable } from 'src/sections/projects/projects-table';
import { MyForm } from '@/components/myForm';
// import { inputFormElements } from 'src/services/formElements';
import { useEffect, useState } from 'react';
import { projectForm } from '@/config/formElements';
import { useRouter } from 'next/navigation';

import { addProject } from '@/app/api/projects';
import { useDrives } from '@/app/api/drives';
import { MySpinner } from '@/components/mySpinner';
import { ErrorComponent } from '@/components/ErrorComponent';

import { da } from 'date-fns/locale';
import { SWRResponse } from 'swr';
import { Drive } from '@/app/api/network/zooprocess-api';
import { Debug } from '@/components/Debug';
 




// const testData = {
//     "project_id": null,
//     "name": "Zooscan_",
//     "thematic": null,
//     "acronym": "acronym",
//     "description": "dyfamed",
//     "ecotaxa_project_title":"ecotaxa_project_title",
//     "ecotaxa_project":1234
// }


let emptyProject = {
        // "project_id": null,
        "name": null, // "Zooscan_",
        "drive": null,
        "acronym": null,
        "description": null,
        "ecotaxa_project_title":null,
        "ecotaxa_project":null
    }

const updateProjectForm = (drive: SWRResponse) => {

    let form = projectForm

    // TODO update with drive

    return form
}



const NewProject = (params:any) => {
    const router = useRouter();
    
    console.log("NewProject params: ", params);

    // const { drives, isLoading, isError } = useDrives();
    // const [ driveList, setDrivesList ] = useState([drives]);

    // useEffect( () => { 
    //   console.log("drives has changed", drives);
    //   const data = updateProjectForm(drives)
    //   setDrivesList(data);
    // } , [drives]);

    let form : any = {}
    form['forms'] = projectForm; //driveList
    form['value'] = emptyProject;
    form['title'] = 'New Project';
    form['subtitle'] = 'Fill metadata about your new project';


    // const [stringifiedData,setData] = useState(JSON.stringify(testData, null, 2))
    const [stringifiedData, setData] = useState("")
    // var stringifiedData = "" ;


    // const prepareData = (data:any) => {
    //     const drive = convertionTable.filter((drive: Drive) => {  return drive.id == data.drive})
    //     console.log("prepareData: ")
    //     if ( drive.length && drive[0].name == undefined) { throw("No drive") }
    //     let newData = {
    //         name: data.name,
    //         drive:{
    //             name:drive[0].name
    //         },
    //         ecotaxa_project: data.ecotaxa_project,
    //         description: data.description,
    //         acronym: data.acronym
    //     };
    //     console.log("newData: " , newData);
    //     return newData;
    // }

    // onSubmit
    const onChange = (value:any) => {
        console.log("New project onChange:", value)

        // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
        // stringifiedData = JSON.stringify(value, null, 2);

        // POUR AFFICHAGE DEBUG
        // setData(JSON.stringify(value, null, 2))
        // console.log("App onChange:", stringifiedData);


        return addProject(value)
        .then((response) => {
            console.log("Go To the project page" )
            router.push(`${response.data.id}`)
        })
        .catch((error) => {
            return Promise.reject(error)
        })


    }

    const onCancel = () => {
        router.back()
        // router.push({
        //     pathname: '/projects/',
        //     // query: { pid: params.id },                                         
        // })
    }

    // const onSubmit = (data) => {
    //     addProject(data)
    // }

    // const updateDriveProject = (project:any, drives:Array<Drive>) => {
    //     // for 
    //     console.log(project)

    //     for (let iproject = 0 ; iproject < Object.keys(project).length ; iproject++ ){
    //         const section = project[iproject];
    //         console.log("section: ", iproject , " = ", section)
    //         for (let isection = 0 ; isection < Object.keys(section).length ; isection++ ){
    //             const elements = section[isection].section
    //             console.log("elements: ", isection , " = " , elements)
    //             for (let ielement = 0; ielement < Object.keys(elements).length ; ielement++ ){
    //                 console.log("key: ", ielement , " = " , elements[ielement].name)
    //                 if ( elements[ielement].name == 'drive' ) {
    //                     console.log("update drive", drives)
    //                     // project[iproject].section[isection].section[ielement].choice = drives;
    //                     elements[ielement].choice = drives;
    //                     break;
    //                 }
    //             }
    //         }
    //     }

    //     console.log("----------------------------------------")
    //     console.log(project)
    //     console.log("----------------------------------------")
    //     return project
    // }

    // interface IDrive {
    //     id: string
    //     name : string
    // }

    // let convertionTable : any = {}

    
    // const updateDrive = (drives: Array<Drive>) : any /*Array<IDrive>*/ => {

    //     // const {driveList, conversion} = Object.keys(drives).map((drive,index=0) => {
    //     //     console.log("drive: ", drive);
    //     //     return [{ id:drive.index, name:drive.name }, { id:drive.index,origid:drive.id} ]
    //     // })

    //     console.log("updateDrive: ", drives);

    //     const driveList 
    //     // const [driveList, conversion] 
    //     = drives.map((drive, index) => {
    //         console.log("drive: ", drive);
    //         // return { id:index, name:drive.name }, { id:index, origid:drive.id}
    //         // return { id:drive.index, name:drive.name };
    //         return { id:index+1, value:drive.name };
    //         // return { id:drive.index, name:drive.name };
    //     })

    //     const conversion //: Array<IDrive>
    //     = drives.map((drive, index:number) => {
    //         console.log("drive: ", drive);
    //         // return { id:index, name:drive.name }, { id:index, origid:drive.id}
    //         // return { id:drive.index, name:drive.name };
    //         return { id:index+1, driveid:drive.id, name:drive.name};
    //     })
        

    //     convertionTable = conversion
    //     console.log("convertionTable: ", convertionTable);
    //     return driveList
    // }
    

    // const ProjectForm = () => {
    //     // if (isLoading) return <MySpinner />
    //     // if (isError) return <ErrorComponent error={isError}/>

    //     // return ( <><h1>ProjectForm</h1></>)

    //     // const dataproject = emptyProject
    //     // form['value']= updateDriveProject ( emptyProject , drives )
    //     // let dataproject = driveList
    //     // let dataproject = projectForm
    //     // form['forms']= updateDriveProject (  dataproject , drives );
    //     // const driveList = updateDrive(drives)
    //     // console.log("driveList: ", driveList);
    //     // form['forms']= updateDriveProject (  dataproject , driveList );

    //     // console.log("+++++++++++++++++++++++++++++++")
    //     // console.log("form: ", form);
    //     // console.log("+++++++++++++++++++++++++++++++")

    //     return (
    //         <MyForm {...form} 
    //             onChange={onChange} 
    //             onCancel={onCancel}
    //         />
    //     )
    // }

    return (
        <>
        <Head>
            <title>
            Metadata | ZooProcess
            </title>
        </Head>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="text-center justify-center">
            <Stack spacing={3}>
            <h1>Metadata</h1>
                {/* <Typography variant="h4">
                    Metadata
                </Typography> */}
                {/* <ProjectForm/> */}
                <Debug params={stringifiedData} />
                <MyForm {...form} 
                    onChange={onChange} 
                    onCancel={onCancel}
                />
            </Stack>
            </div>
        </section>
        </>
    );
}


export default NewProject;