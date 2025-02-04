"use client";

import { Instrument } from "@/app/api/network/interfaces";
import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { CalibrationTable } from "./calibration-table";
import { useState } from "react";
import { MyForm } from '@/components/myForm';

import {  
  // scannerCalibrationElements, 
    scannerForm, 
    //    scanningOptions 
} from "@/config/formElements";
import { useRouter } from "next/navigation";
import { updateInstrument } from "@/app/api/data/instrument";



interface pageProps {
  instrument: Instrument
}

const InstrumentDetail = ( params : pageProps
// const InstrumentDetail = ({ params }: { params: { instrument: Instrument
  //, onChange:()=>void , onCancel:()=>void}
) => {
    
    // const { instrument,onChange, onCancel } = params;
    const { instrument } = params;

  const router = useRouter();

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => {
        console.debug("refreshTrigger",refreshTrigger)
        setRefreshTrigger(prev => prev + 1);
    };

    const initForm = () => {
        let localform: any = {}
        localform['forms'] = scannerForm;
        localform['value'] = {};
        localform['title'] = 'Update Instrument';
        localform['subtitle'] = 'Modify your instrument metadata';
        return localform
      }

    let form = initForm()


  const fillInstrument = (instrument: any): any => { 
    let inst = {
        "id": instrument.id,
        "name": instrument.name,
        "model": instrument.model,
        "sn": instrument.sn,
    }
    return inst;
}

const onChange = (value:any) => {
  console.debug("onChange calibration form")

  const i = value as Instrument

try {
  return updateInstrument(i)
  // params.onChange()
}
catch(error) {
  console.error("Error - updateInstrument", error)
  return Promise.reject(error)  
}

}


const onCancel = () => {
  console.debug("Cancel calibration form")
  // params.onCancel()
  router.back()
}


  const InstrumentForm = () => {
    // if (isLoading) return <MySpinner />
    // if (isError) return <ErrorComponent error={isError}/>

    form = { 
      ...form, 
      value: fillInstrument(instrument),
      instrument: instrument.id,
      onChange,
      onCancel
    }

    return (
        <MyForm {...form} 
            onChange={onChange} 
            onCancel={onCancel}
        />
    )
  }

    return (
        <>
        <h1>{instrument.id}</h1>
        {/* <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"> */}
          <div className="text-center justify-center">
            {/* <Stack spacing={3}> */}
            <h1>Instrument</h1>
                <InstrumentForm />
                <Card className="inline-block" data-testid="calibrationCard">
                <CardHeader className="flex flex-row-reverse py-3">
                    <Button 
                        href={`/instruments/${instrument.id}/new`}
                        as={Link}
                        color="primary"
                        data-testid="newBtn"
                        >Add new calibration</Button>
                </CardHeader>
                 <CardBody>
                {instrument && 'id' in instrument && <CalibrationTable calibrations={instrument.ZooscanCalibration} instrument={{
                  id: instrument.id,
                    model: instrument.model,
                    name: instrument.name,
                    sn: instrument.sn
                }} refreshTrigger={refreshTrigger}/>}
                </CardBody>                
                </Card>
            {/* </Stack> */}
          </div>
        {/* </section> */}
    </>

    )
}

export default InstrumentDetail;