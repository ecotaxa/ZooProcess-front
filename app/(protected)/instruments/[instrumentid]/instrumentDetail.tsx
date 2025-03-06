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
    const [refreshData, setRefreshData] = useState(0);

    const triggerRefresh = () => {
        console.debug("refreshTrigger",refreshTrigger)
        setRefreshTrigger(prev => prev + 1);
    };

    const handleRefresh = () => {
      setRefreshData(prev => prev + 1);
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
}
catch(error) {
  console.error("Error - updateInstrument", error)
  return Promise.reject(error)  
}

}


const onCancel = () => {
  console.debug("Cancel calibration form")
  router.back()
}


  const InstrumentForm = () => {

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

  const AddButton = (instrument: any) => {
 
    console.debug("AddButton", instrument)

    if ( instrument === null ) {
      return (
        <Button disabled>Add new setting</Button>
      )
    }

    const filteredArray = instrument.ZooscanCalibration.filter((item:any) => !item.archived);
    // const permit2addCalibration = filteredArray.length < 3;
    const noFilteredArray = instrument.ZooscanCalibration
    console.debug("noFilteredArray", noFilteredArray)
    console.debug("filteredArray", filteredArray)

    // limit to 3: because choice are LARGE, NARROW or OTHER
    // but need to remove already used cases when add a new one
    if( filteredArray.length >= 3 ) {
      return (
        // <Button disabled>Add new calibration {noFilteredArray.length}</Button>
        <Button disabled>Add new setting</Button>
      )
    } 

    return (
    <div className="flex justify-center">
      <Button
        href={`/instruments/${instrument.id}/new`}
        as={Link}
        color="primary"
        data-testid="newBtn"
      >
        Add new setting
      </Button>
    </div>
    )
  }

    return (
        <>
        <h1>{instrument.id}</h1>
          <div className="text-center justify-center">
            <h1>Instrument</h1>
                <InstrumentForm />
                <Card className="inline-block" data-testid="calibrationCard">
                <CardHeader className="flex flex-row-reverse py-3">
                    {AddButton(instrument)}
                </CardHeader>
                 <CardBody>
                {instrument 
                  && 'id' in instrument 
                  && <CalibrationTable 
                        calibrations={instrument.ZooscanCalibration} 
                        instrument={{
                          id: instrument.id,
                            model: instrument.model,
                            name: instrument.name,
                            sn: instrument.sn
                        }} 
                        refreshTrigger={refreshTrigger} />}
                </CardBody>                
                </Card>
          </div>
    </>

    )
}

export default InstrumentDetail;
