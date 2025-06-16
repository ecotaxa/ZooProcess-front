import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { Debug } from "@/components/Debug";

export function MyInputSelect(props){

    console.log("MySelect props: ", props);
    const [value, setValue] = useState(String(props.value) || 0 );


    const handleChange = (value  /* event: SelectChangeEvent*/) => {
        console.debug("handleChange: ", value)


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

    // console.debug("props.choice: ", props.choice)
    // console.debug("value: ", value)
    const choice = Object.keys(props.choice).map((key) => {
        // console.debug("key: ", key, " => ", props.choice[key])
        return { 
            'id': String(props.choice[key].id), 
            'value': props.choice[key].value
        }
    })

    // console.debug("Choice:", choice)

    let opt = {
        id: props.name,
        items: choice,
        label: props.label,
        placeholder: props.placeholder,
        className: "max-w-xs",
        isDisabled: props.disabled
    }

    if (props.required == true) { opt['isRequired'] = true; }
    return (
        <>
        <Debug params={[{props:props},{opt:opt}]}  title={props.name} />

        <Autocomplete
            selectedKeys={[value]}
            onChange={(event) => handleChange(event.target.value)}
            allowsCustomValue
            {...opt}
        >
            {(item) => <AutocompleteItem key={item.id}>{item.value}</AutocompleteItem>}
        </Autocomplete>
        </>
    )

}
