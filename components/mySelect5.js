import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

export function MySelect(props){

    console.log("putain")
    const [value, setValue] = useState(
            props.value || 0
        );


    const handleChange = (value  /* event: SelectChangeEvent*/) => {
    // const handleChange = (event) => {
        // console.log("typeof event: ", typeof(event));
        // const value = event.target.value;
        console.log("handleChange: ", value)

        if (props.onChange){
            props.onChange(props.name, value)
        }
        setValue(value);
    }

    let opt = {
        id: props.name,
        items: props.choice,
        label: props.label,
        placeholder: props.placeholder,
        className:"max-w-xs",
    }

    // if (props.value) { opt['defaultSelectedKeys'] = [props.value]; }
    if (props.required == true) { opt['isRequired'] = true; }

    // console.log("OPT:" , opt);

    return (
        <Select
            selectedKeys={value}
            // onChange={(event) => handleChange(event.target.value)}
            // onChange={handleChange}
            onSelectionChange={handleChange}
            {...opt}
        >
            {(item) => <SelectItem key={item.id}>{item.value}</SelectItem>}
        </Select>
    )

}
