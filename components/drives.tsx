"use client";

import { useDrives } from "@/app/api/drives";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MySpinner } from "./mySpinner";
import { ErrorComponent } from "./ErrorComponent";
// import { spec } from "node:test/reporters";


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
    choice: Array<Item>
    onChange: (name:string,value:string)=>{}
}

const Drives = (props:FormItem) => {

    const { drives, isLoading, isError} = useDrives();    
    // const [ driveList , setDriveList ] = useState(drives);
    const [value, setValue] = useState(
        props.value || 0
        );

    useEffect( () => { 
        // console.log("drives have changed", drives);
        // const data = samples
        // setDriveList(drives);
      } , [drives])

      
    if (isLoading) return <MySpinner />
    if (isError) return <ErrorComponent error={isError}/>


    const handleChange = (value : string /* event: SelectChangeEvent*/) => {
    // const handleChange = (event: any) => {

        // console.log("typeof event: ", typeof(event));

        // const value = event.target.value;
        console.log("handleChange: ", value)

        if (props.onChange){
            props.onChange(props.name, value)
        }
        setValue(value);
    }

    // console.log("Drives: ", drives);

    // console.log("SELECT props:", props);
    let opt : any = {
        id: props.name,
        items: drives,
        label: props.label || "Drives",
        placeholder: props.placeholder || "Choose your folder",
        className:"max-w-xs",
        // onSelectionChange:{handleChange}
    }

    // console.log("added props");
    // if (props.value) { opt['defaultSelectedKeys'] = [props.value]; }
    if (props.required == true) { opt['isRequired'] = true; }


    return (
        <Select
            // onChange={props.onChange}
            selectedKeys={value}
            // onChange={(event) => handleChange(event.target.value)}
            // onChange={handleChange}
            // defaultValue={props.value}
            // defaultSelectedKeys={[props.value]}
            onSelectionChange={handleChange}
            {...opt}
        >
            {(item:Item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
        </Select>
    )

}



export default Drives;