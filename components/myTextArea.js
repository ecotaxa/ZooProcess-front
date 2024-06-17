import React from "react";
import {Textarea} from "@nextui-org/react";
import { Debug } from "./Debug";

export function MyTextArea(props) {

    // console.log("MyTextArea: ", props);

    const [value, setValue] = React.useState(props.value);



//   return (
//     <Textarea  
//         onChange={props.onChange}
//         isInvalid={false}
//         isRequired
//         // variant="bordered"
//         label={props.label}
//         placeholder={props.placeholder}
//         defaultValue={props.defaultValue}
//         // errorMessage="The description should be at least 255 characters long."
//         className="max-w-xs"
//     />)

var handleChange = (value) => {

    // console.log("MyTextArea setValue: ", value);

    setValue(value);
    if (props.onChange){
        props.onChange(props.name, value)
    }
}

let opts = {
    type: props.type,
    // defaultValue: props.value,
    label: props.label,
    placeholder: props.placeholder,
    // onChange: handleChange
}
if (props.required == true) { opts['isRequired'] = true}
// if (props.prefix) { opt['startContent'] = props.prefix }
// if (props.endAdornment?.text) { opt['endContent'] = props.endAdornment.text}
if (props.readonly) { opts['isReadOnly'] = true}
if (props.helperText) { opts['errorMessage']=props.helperText }


return (
    <>
      <Debug params={[{props:props},{opts:opts}]} title={props.name}/>

      <Textarea
        {...opts}
        onValueChange= {handleChange}

        value={value}
      />
    </>
  );

//   return (
//     // <div className="w-full flex flex-col gap-2 max-w-[240px]">
//       <Textarea
//         // variant="underlined"
//         // label="Description"
//         // labelPlacement="outside"
//         // placeholder="Enter your description"


//         onValueChange= {handleChange}

//         value={value}
//         // onValueChange={setValue}
//       />
//       {/* <p className="text-default-500 text-small">Textarea value: {value}</p> */}
//     {/* </div> */}
//   );
}
