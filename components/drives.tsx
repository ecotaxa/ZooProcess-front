"use client";

// import { useDrives } from "@/app/api/drives";
import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
// import { MySpinner } from "./mySpinner";
// import { ErrorComponent } from "./ErrorComponent";
// import { getDrives } from "@/app/api/data/drive";
// import { useDrives } from "@/app/api/drives";
// import { Debug } from "./Debug";
// import { spec } from "node:test/reporters";
import AsyncDriveData from '@/app/api/data/AsyncDriveData'
import { Drive } from "@/app/api/network/interfaces";


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

    //console.log("Drives props: ",props);

    // const { drives, isLoading, isError} = useDrives();  
    // const drives = getDrives()
    const drivelist = AsyncDriveData();
    const [ drives , setDrives ] = useState<Drive[]>([]);

    
    // const [ driveList , setDriveList ] = useState(drives);
    const [value, setValue] = useState(props.value || 0);

    useEffect(() => {
        const fetchDrives = async () => {
            const drivesData = await drivelist  // wait the Promise return
            console.log("AsyncDriveContent useEffect: ", drivesData)
            setDrives(drivesData)
        }
        fetchDrives()
    // }, [drives])
    }, [])
// manage user selection
  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

    // just for log
    useEffect( () => { 
        console.log("drives have changed:", drives);
        // const data = samples
        // setDriveList(drives);
      } , [drives])

      
    // if (isLoading) return <MySpinner />
    // if (isError) return <ErrorComponent error={isError}/>


    const handleChange = (value : string /* event: SelectChangeEvent*/) => {
    // const handleChange = (event: any) => {

        // console.log("typeof event: ", typeof(event));

        // const value = event.target.value;
        console.log("handleChange: ", value)

        if (props.onChange){
            props.onChange(props.name, value)
        }
        //console.log("setValue:", value)
        setValue(value);
    }

    // console.log("Drives: ", drives);

    // console.log("SELECT props:", props);
    let opts : any = {
        id: props.name,
        items: drives,
        label: props.label || "Drives",
        placeholder: props.placeholder || "Choose your folder",
        className:"max-w-xs",
        // onSelectionChange:{handleChange}
    }

    // console.log("added props");
    if (props.value) { opts['defaultSelectedKeys'] = [props.value]; }
    if (props.required == true) { opts['isRequired'] = true; }


    return (
        <>
        {/* <Debug params={[{props:props},{opts:opts},{hasError:isError}]} title={props.name} /> */}

        <Select
            // onChange={props.onChange}
            // selectedKeys={value}
            onChange={(event) => handleChange(event.target.value)}
            // onChange={handleChange}
            // defaultValue={props.value}
            // defaultSelectedKeys={[props.value]}
            // onSelectionChange={handleChange}
            {...opts}
        >
            {(item:Item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
        </Select>
        </>
    )

}



export default Drives;