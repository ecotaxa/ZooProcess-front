import { useDrives } from "@/app/api/drives";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";


interface Item {
    id: string
    value: string
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



    console.log("SELECT props:", props);
    let opt : any = {
        id: props.name,
        items: props.choice,
        label: props.label || "Drives",
        placeholder: props.placeholder || "Choose your folder",
        className:"max-w-xs",
    }
    console.log("")
    if (props.value) { opt['defaultSelectedKeys'] = [props.value]; }
    if (props.required == true) { opt['isRequired'] = true; }

    return (
        <Select
            onChange={props.onChange}
            // defaultValue={props.value}
            // defaultSelectedKeys={[props.value]}
            {...opt}
        >
            {(item:Item) => <SelectItem key={item.id}>{item.value}</SelectItem>}
        </Select>
    )

}



export default Drives;