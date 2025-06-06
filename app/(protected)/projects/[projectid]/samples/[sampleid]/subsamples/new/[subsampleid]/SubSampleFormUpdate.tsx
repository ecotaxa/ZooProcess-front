"use client"


import { FC } from "react";


import { MyForm } from '@/components/myForm';
import { fraction_inputFormElments } from '@/config/formElements';

import { useRouter } from 'next/navigation';

import { IMetadata, SubSample } from '@/app/api/network/interfaces';

 





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

        subsampleid: string
        subsample: SubSample
        onCancel: () => void
        onChange: (value:any) => void
    // }
}

const SubSampleForm : FC<pageProps> = (params ) => {
// const SubSampleForm =  ( params: pageProps) => {

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

    // const projectId = params.projectid;
    const subsampleid =  params.subsampleid
    const subsample =  params.subsample
    console.log("NewSample params projectid: ", projectid);
    console.log("NewSample params sampleid: ", sampleid);
    console.log("NewSample params subsampleid: ", subsampleid);
    






  

    const prepareData = (data:any) => {

        let newData = {
            ...data,
            sampleId: sampleid
        }
        console.log("newData: ", newData);
        return newData;
    }


    const onChange = async (value:any) => {
        params.onChange(value)
        console.log("App onChange:", value)
        // setData(JSON.stringify(value, null, 2))
        
        const data = {
            name: `${projectid}_${value.sample_id}`,
            metadataModelId: "6565df171af7a84541c48b20",
            data:value,
        }

        console.log("updatedData: ", data);
        
        // on ne veut pas d'update des data (non permis)
        // return updateSubSample({
        //     projectId: projectid, 
        //     sampleId: sampleid,
        //     subSampleId: subsampleid,
        //     data
        // })
        // return data
        params.onChange && params.onChange(value)
        return data
    }



   



    const formButtons = {
        submit:'Next'
    }

    type DataReturn = Map<string,any>




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
            "fraction_id":subsample.fraction_id,
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




        const form = formatData(subsample)

        return (
            <MyForm 
                {...form} 
                project={projectid}
                sample={sampleid}
                onChange={onChange}
                onCancel={params.onCancel}
                button={formButtons}
            />
        )
    }


    return (
        <>
            {showForm(subsample)}
        </>
    );
}


export default SubSampleForm;
