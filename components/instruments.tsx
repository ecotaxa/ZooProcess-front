"use client";

import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { Instrument } from "@/app/api/network/interfaces";
import AsyncInstrumentData from "@/app/api/data/AsyncInstrumentData";
import { Debug } from "./Debug";


interface Item {
    id: string
    name: string
}

interface FormItem {
    id: string
    name: string
    value: string
    placeholder: string
    label: string
    required: boolean
    onChange: (name:string,value:string)=>{}
}

const Instruments = (props:FormItem) => {
    //console.debug("Instruments props: ",props);
    const instrumentList = AsyncInstrumentData() // getInstruments()  
    const [instruments, setInstruments] = useState<Array<Instrument>>([])

    const [value, setValue] = useState(props.value || 0);



    useEffect( ()=> {
        const fetchInstruments = async () => {
            const instrumentsData = await instrumentList  // wait the Promise return
            console.log("AsyncInstrumentComponent useEffect: ", instrumentsData)
            setInstruments(instrumentsData)
        }
        fetchInstruments()
    }, [])
      
    // manage user selection
    useEffect(() => {
        if (props.value !== undefined) {
          setValue(props.value);
        }
      }, [props.value]);
    

    useEffect( ()=> {
        console.log("instruments have changed:", instruments);
    }, [instruments])

    const handleChange = (value : string /* event: SelectChangeEvent*/) => {
        console.log("handleChange: ", value)

        if (props.onChange){
            props.onChange(props.name, value)
        }
        //console.debug("setValue:", value)
        setValue(value);
    }

    // console.debug("Instruments: ", drives);
    // console.debug("SELECT props:", props);
    let opts : any = {
        id: props.name,
        items: instruments,
        label: props.label || "Instruments",
        placeholder: props.placeholder || "Choose your instrument",
        className:"max-w-xs",
    }

    // console.debug("added props");
    if (props.value) { opts['defaultSelectedKeys'] = [props.value]; }
    if (props.required == true) { opts['isRequired'] = true; }


    return (

        <>
        {/* <Debug params={[{props:props},{opts:opts},{hasError:isError}]} title={props.name} /> */}
        <Debug params={[{props:props},{opts:opts}]} title={props.name} />

        <Select
            onChange={(event) => handleChange(event.target.value)}
            {...opts}
        >
            {(item:Item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
        </Select>
        </>
    )

}



export default Instruments;
