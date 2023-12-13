"use client";

import { useDrives } from "@/app/api/drives";
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MySpinner } from "./mySpinner";
import { ErrorComponent } from "./ErrorComponent";


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
    onChange: object
}

const Drives = (props:FormItem) => {

    const { drives, isLoading, isError} = useDrives();    
    const [ driveList , setDriveList ] = useState(drives);

    useEffect( () => { 
        // console.log("drives have changed", drives);
        // const data = samples
        setDriveList(drives);
      } , [drives])

    if (isLoading) return <MySpinner />
    if (isError) return <ErrorComponent error={isError}/>

    // console.log("Drives: ", drives);

    // console.log("SELECT props:", props);
    let opt : any = {
        id: props.name,
        items: drives,
        label: props.label || "Drives",
        placeholder: props.placeholder || "Choose your folder",
        className:"max-w-xs",
    }

    // console.log("added props");
    if (props.value) { opt['defaultSelectedKeys'] = [props.value]; }
    if (props.required == true) { opt['isRequired'] = true; }


    return (
        <Select
            onChange={props.onChange}
            // defaultValue={props.value}
            // defaultSelectedKeys={[props.value]}
            {...opt}
        >
            {(item:Item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
        </Select>
    )

}



export default Drives;