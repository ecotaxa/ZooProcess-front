"use client"

import Head from 'next/head';

// import { updateProject, useProject } from "@/app/api/projects";
import { ErrorComponent } from "@/components/ErrorComponent";
import { MySpinner } from "@/components/mySpinner";
import { scannerCalibrationElements, scannerForm, scanningOptions } from "@/config/formElements";
import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';

// import { Project as IProject } from '@/app/api/network/zooprocess-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { MyForm } from '@/components/myForm';
import { useInstrument } from '@/app/api/instruments';

interface pageProps {
    // params: {
        instrumentid: string
    // }
  }

const InstrumentPage : FC<pageProps> = (params) => {
  const router = useRouter();

  const instrumentId = params.params.instrumentid ;
  console.log("InstrumentPage params: ", params);
  console.log("InstrumentPage params instrumentid: ", params.params.instrumentid );

  const { instrument, isLoading, isError } = useInstrument(instrumentId)

  const fillInstrument = (instrument:any) : any => { 
        console.log("fillInstrument: ", instrument);
        
        let inst = {
            "id":instrument.id,
            "name": instrument.name,
            "model": instrument.model,
            "sn": instrument.sn,
            "xOffset": instrument.calibration.xOffset || 0,
            "yOffset": instrument.calibration.yOffset || 0,
            "xSize": instrument.calibration.xSize || 0,
            "ySize": instrument.calibration.ySize || 0,
      }

      return inst;
    }

    // const [form, setForm] = useState({})

    const initForm = () => {
      let localform : any = {}
      localform['forms'] = scannerForm;
      localform['value'] = {};
      localform['title'] = 'Update Instrument';
      localform['subtitle'] = 'Modify your instrument metadata';

      // setForm(localform)
      return localform
    }

    let form = initForm()



  const InstrumentForm = () => {
    if (isLoading) return <MySpinner />
    if (isError) return <ErrorComponent error={isError}/>
    
    //const projectMetadata = 

    form = { 
      ...form, 
      value:fillInstrument(instrument),
      instrument:{instrumentId}
    }
    // form['value'] = fillProject(project)
    // setForm(f)
    // form['value'] = projectMetadata;

    console.log("instrumentMetadata: ", form);

    // return <></>

    return (
        <MyForm {...form} 
            onChange={onChange} 
            onCancel={onCancel}
        />
    )
  }

       
  // onSubmit
  const onChange = (value:any) => {
    console.log("Instrument metadata onChange:", value)
    // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
    // stringifiedData = JSON.stringify(value, null, 2);

    // POUR AFFICHAGE DEBUG
    // setData(JSON.stringify(value, null, 2))
    // console.log("App onChange:", stringifiedData)
    // console.log("App onChange:", JSON.stringify(value, null, 2));

    return // TODO updateProject(value);
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
            Instrument | ZooProcess
            </title>
        </Head>
        <h1>{instrumentId}</h1>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

          <div className="text-center justify-center">
            <Stack spacing={3}>
            <h1>Instrument</h1>
                <InstrumentForm/>
            </Stack>
          </div>
        </section>
        </>
    );

}



export default InstrumentPage;
