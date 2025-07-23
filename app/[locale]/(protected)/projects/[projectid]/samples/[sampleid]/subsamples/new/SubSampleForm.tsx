"use client"

import { FC } from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

import { MyForm } from '@/components/myForm';
import { fraction_inputFormElments } from '@/config/formElements';
import { Sample, User } from '@/app/api/network/interfaces';
import { CustomError, removeDigestFromError } from "@/app/api/digest";
import { addSubSample } from "@/app/api/data/subsamples";
 import { ValidationError } from "@/lib/errors";



// const testData = {
//     //"sample_name":"dyfamed_wp2_2023_biotom_sn001",
//     "sample_id": "dyfamed_wp2_2023_biotom_sn001",
//     "scientific_program": "ZooProcess",
//     "latitude_ns": 1,
//     "station_id": "dyfamed",
//     "bottom_depth": "2400",
//     "sampling_date": "2022-11-13T00:13:40.000Z",
//     // "sampling_date": "2023-10-09T09:13:40.000Z",
//     "Latitude_degree": "43",
//     "longitude_degree": "7",
//     "latitude_minute": "25",
//     "longitude_minute": "51",
//     "longitude_ew": 1,
//     "tow_type": "1",
//     "net_sampling_type": "WP2",
//     "net_mesh": "200",
//     "net_opening_surface": "0.25",
//     "minimum_depth": "1",
//     "maximum_depth": "1",
//     "quality_flag_for_depth_measurement": "2",
//     "ship_speed": "99999",
//     "cable_speed": "99999",
//     "cable_length": "99999",
//     "cable_angle_from_vertical": "45",
//     "sampling_duration": "5"
// }

const forms = [
    // sampleid_formElements, 
    // inputFormElements, 
    // inputFormElements_tow_type_vertical, 
    fraction_inputFormElments
]

interface pageProps {
        sample: Sample

        user: User
}

const SubSampleForm :  FC<pageProps> = ({sample, user})  => {


    const [formErrors, setFormErrors] = useState(null);

    const router = useRouter()
    
    console.debug("SubSampleForm params: ", {sample, user});

    const project = sample.project;
    const projectid = project.id;
    const sampleid = sample.id;


    console.log("NewSample params projectid: ", projectid);
    console.log("NewSample params sampleid: ", sampleid);



    async function handleChange(values:any, sampleId: string, projectId: string) {
        console.debug("SubSampleForm::handleChange()")
    try {
 
    
          const res = await addSubSample(projectId, sampleId, values);

      // succès : redirect
      const id = res.data.id;
      router.push(
        `/projects/${projectId}/samples/${sampleId}/subsamples/new/${id}?state=scanner`,
      );
    } catch (err:any) {

        // Add more detailed error logging
        // console.error("🔥 Full error details:", {
        //     message: err.message,
        //     payload: err.payload, // This should show validation details
        //     stack: err.stack
        // });
        console.error("🔥 Full error details:", err);

      if (err instanceof ValidationError) {
        // on garde les erreurs dans l'état pour les afficher
        console.error("❌ Validation Error payload:", err.payload);
        setFormErrors(err.payload?.errors || err.payload || { general: "Validation failed" });
 
        return;
      }
            setFormErrors({ general: err.message || "An unexpected error occurred" });
            console.error("🟩 onChange:", err);
    throw err
    }
  } 
 
    const onCancel = () => {
        router.back()
    }

    const formButtons = {
        submit:'Scan'
    }

    const formatData = (user:User|any) => {
        console.log("formatData() ");

        const emptyData = {
            "scanning_operator":user.name,
            "fraction_id":"",
            "fraction_id_suffix":""
        }
    
        const updatedForm = forms
    
        const form : any = []
            form['forms']=updatedForm
            form['value']=emptyData // testData
            form['title']='Sub Sample metadata'
            form['subtitle']='Fill all the mandatory fields.'
    
        return form;
    }


    const showForm = (use:User|any) => {
        const form = formatData(user)

        return (
            <MyForm 
                {...form} 
                project={project.name}
                sample={sample.name}

                onChange={(values: any) => handleChange(values, sampleid, projectid)}
                onCancel={onCancel}
                button={formButtons}
                errors={formErrors} // ← Pass the errors to MyForm

            />
        )
    }

    return (
        <>
            {showForm(user)}
        </>
    );
}

export default SubSampleForm;
