import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { Debug } from "@/Components/Debug";

export function MySelect(props){

    console.log("MySelect props: ", props);
    const [value, setValue] = useState(String(props.value) || 0 );


    const handleChange = (value  /* event: SelectChangeEvent*/) => {
    // const handleChange = (event) => {
        // console.log("typeof event: ", typeof(event));
        // const value = event.target.value;
        console.log("handleChange: ", value)


        if ( value != "" ){
            setValue(value);
            if (props.onChange){
                props.onChange(props.name, value)
            }
            } else {
            setValue(0)
            if (props.onChange){
                props.onChange(props.name, 0)
            }
        }
    }

    console.log("props.choice: ", props.choice)
    console.log("value: ", value)
    const choice = Object.keys(props.choice).map((key) => {
        console.log("key: ", key, " => ", props.choice[key])
        return { 
            'id': String(props.choice[key].id), 
            'value': props.choice[key].value
        }
    })

    console.log("Choice:", choice)

    let opt = {
        id: props.name,
        // items: props.choice,
        items: choice,
        label: props.label,
        placeholder: props.placeholder,
        className: "max-w-xs",
    }

    // if (props.value) { opt['defaultSelectedKeys'] = [props.value]; }
    if (props.required == true) { opt['isRequired'] = true; }

    // if (value) { opt['selectedKeys'] = [value] }

    // console.log("OPT:" , opt);

    return (
        <>
        <Debug params={[{props:props},{opt:opt}]} />
        <Select
            // selectedKeys={[String(value)]}
            selectedKeys={[value]}
            onChange={(event) => handleChange(event.target.value)}
            // onChange={handleChange}
            // onSelectionChange={handleChange}
            // items= {choice}
            {...opt}
        >
            {(item) => <SelectItem key={item.id}>{item.value}</SelectItem>}
        </Select>
        </>
    )

}
