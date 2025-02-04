// "use client"

// import Head from 'next/head';
// import { FC } from "react";

// // import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// // import { ProjectsTable } from 'src/sections/projects/projects-table';
// import { MyForm } from '@/components/myForm';
// import { fraction_inputFormElments } from '@/config/formElements';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// // import { addSample } from '@/app/api/samples';
// import { Debug } from '@/components/Debug';
// import { addSubSample } from '@/app/api/subsamples';
// import { Timeline_scan } from '@/components/timeline-scan';
// // import { useUserMe } from '@/app/api/user';
// import { MySpinner } from '@/components/mySpinner';
// import { ErrorComponent } from '@/components/ErrorComponent';

// import { User } from '@/app/api/network/interfaces';

 




// // const testData = {
// //     //"sample_name":"dyfamed_wp2_2023_biotom_sn001",
// //     "sample_id": "dyfamed_wp2_2023_biotom_sn001",
// //     "scientific_program": "ZooProcess",
// //     "latitude_ns": 1,
// //     "station_id": "dyfamed",
// //     "bottom_depth": "2400",
// //     "sampling_date": "2022-11-13T00:13:40.000Z",
// //     // "sampling_date": "2023-10-09T09:13:40.000Z",
// //     "Latitude_degree": "43",
// //     "longitude_degree": "7",
// //     "latitude_minute": "25",
// //     "longitude_minute": "51",
// //     "longitude_ew": 1,
// //     "tow_type": "1",
// //     "net_sampling_type": "WP2",
// //     "net_mesh": "200",
// //     "net_opening_surface": "0.25",
// //     "minimum_depth": "1",
// //     "maximum_depth": "1",
// //     "quality_flag_for_depth_measurement": "2",
// //     "ship_speed": "99999",
// //     "cable_speed": "99999",
// //     "cable_length": "99999",
// //     "cable_angle_from_vertical": "45",
// //     "sampling_duration": "5"
// // }

// const forms = [
//     // sampleid_formElements, 
//     // inputFormElements, 
//     // inputFormElements_tow_type_vertical, 
//     fraction_inputFormElments
// ]

// interface pageProps {
//     // params: {
//         projectid: string
//         sampleid: string
//     // }
// }

// const NewSubSample : FC<pageProps> = (params ) => {

//     const router = useRouter()
    
//     // const { projectid, sampleid } = params
//     const { user, isLoading, isError } = useUserMe()
//     // const { project, isLoading:l , isError:err } = useProject()

//     // if (isError) {
//     //     // Handle error
//     //     return <div>Error loading user data</div>
//     // }

//     // if (isLoading) {
//     //     // Show loading state
//     //     return <div>Loading...</div>
//     // }

//     console.debug("NewSample params: ", params);
//     // console.log("NewSample params projectid: ", params.projectid);
//     // console.log("NewSample params sampleid: ", params.sampleid);
//     // console.log("NewSample params projectid: ", params.projectid);

//     // const projectid = router.query.projectid //as string
//     // const projectid = params.params.projectid;
//     // const sampleid = params.params.sampleid;
//     const projectid = params.projectid;
//     const sampleid = params.sampleid;    const projectId = params.projectid;

//     console.log("NewSample params projectid: ", projectid);
//     console.log("NewSample params sampleid: ", sampleid);

//     // const emptyData = {
//     //     "scanning_operator":user.name, // "Seb"  // 
//     // }

//     // const updatedForm = forms

//     // const form : any = []
//     //     form['forms']=updatedForm
//     //     form['value']=emptyData//testData//
//     //     form['title']='Sub Sample metadata'
//     //     form['subtitle']='Fill all the mandatory fields.'



//     // const [stringifiedData,setData] = useState(JSON.stringify(testData, null, 2))
//     const [stringifiedData, setData] = useState("")
//     // var stringifiedData = "" ;

//     const prepareData = (data:any) => {

//         let newData = {
//             ...data,
//             sampleId: sampleid
//         }
//         console.log("newData: ", newData);
//         return newData;
//     }

//     const onChange = (value:any) => {
//         console.log("App onChange:", value)
//         // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
//         // stringifiedData = JSON.stringify(value, null, 2);

//         setData(JSON.stringify(value, null, 2))
//         console.log("App onChange:", stringifiedData)

//         // const newData = prepareData(value)

//         const data = {
//             name: value.scan_id, //"Sample XXXX",
//             metadataModelId: "", //"6565df171af7a84541c48b20",
//             data: value,
//         }

//         console.log("newData: ", data);
//         // try {

//             console.log("----- projectId: ", projectid);
//             console.log("----- sampleId: ", sampleid);
//             // console.log("----- params.projectid : ",params.projectid);
//             // console.log("----- params : ",params);
//             // console.log("----- params.params : ",params.params);

//             // addSample(projectId, data)
//             return addSubSample({
//                 projectId: projectid, // : params.params.projectid,
//                 sampleId: sampleid, 
//                 data
//             })
//             .then((response) => {
//                 console.log("Go To the infos page" )
//                 // router.push(`${response.data.id}`)
//                 // const path = `/projects/${projectId}/samples/${sampleId}/subsamples/new/scan/${response.data.id}/preview`
//                 const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${response.data.id}`
//                 router.push(path)
//             })
//             .catch((error) => {
//                 return Promise.reject(error)
//             })

//         // }
//         // catch (e:any){
//         //     console.log(e);
            
//         // }
//     }

//     const onCancel = () => {
//         router.back()
//         // router.push({
//         //     pathname: '/projects/[projectid]',
//         //     query: { projectid: projectid },                                         
//         // })
//     }

//     const formButtons = {
//         submit:'Scan'
//     }

//     const formatData = (user:User|any) => {
//         console.log("formatData() ");

//         const emptyData = {
//             "scanning_operator":user.name, // "Seb"  // 
//         }
    
//         const updatedForm = forms
    
//         const form : any = []
//             form['forms']=updatedForm
//             form['value']=emptyData//testData//
//             form['title']='Sub Sample metadata'
//             form['subtitle']='Fill all the mandatory fields.'
    
//         return form;
//     }


//     const showForm = (use:User|any) => {

//         if (isLoading) return <MySpinner />;
//         if (isError) return <ErrorComponent error={isError} />;

//         // if ( ! user) return <ErrorComponent error={isError} />

//         // else {
//         const form = formatData(user)

//         return (
//             <MyForm 
//                 {...form} 
//                 project={projectid}
//                 sample={sampleid}
//                 onChange={onChange}
//                 onCancel={onCancel}
//                 button={formButtons}
//             />
//         )
//         // }
//     }


//     return (
//         <>
//         <Head>
//             <title>
//             New Sub Sample Metadata | ZooProcess
//             </title>
//         </Head>
//         <Debug params={params}/>
//         <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

//             <div className="text-center justify-center">

//                 {/* <Stack spacing={3}> */}
//                     {/* <Typography variant="h4"> */}
//                     <h4>
//                     Sub Sample Metadata to sample {sampleid} from project {projectid}
//                     </h4>
//                     {/* </Typography> */}
//                     <Timeline_scan current={0} />
//                     {/* <MyForm 
//                         {...form} 
//                         project={projectid}
//                         sample={sampleid}
//                         onChange={onChange} 
//                         onCancel={onCancel}
//                         button={formButtons}/> */}

//                         {showForm(user)}

//             </div>
//         </section>
//         </>
//     );
// }


// export default NewSubSample;
