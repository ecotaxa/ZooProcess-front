import React from "react";
import {Textarea} from "@heroui/react";
import { Debug } from "./Debug";

export function MyTextArea(props) {
  // console.debug("MyTextArea: ", props);
  const [value, setValue] = React.useState(props.value);

  var handleChange = (value) => {

      setValue(value);
      if (props.onChange){
          props.onChange(props.name, value)
      }
  }

  let opts = {
      type: props.type,
      label: props.label,
      placeholder: props.placeholder,
  }
  if (props.required == true) { opts['isRequired'] = true}
  if (props.readonly) { opts['isReadOnly'] = true}
  if (props.helperText) { opts['errorMessage']=props.helperText }


  return (
    <>
      {/* <Debug params={[{props:props},{opts:opts}]} title={props.name}/> */}
      <Textarea
        {...opts}
        onValueChange= {handleChange}

        value={value}
      />
    </>
  );


}
