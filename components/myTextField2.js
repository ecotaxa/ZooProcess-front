import React, { useState } from "react";

import {   TextField, InputAdornment } from "@mui/material"
import { Textarea } from "@nextui-org/input";
import {Input} from "@nextui-org/react";

export function MyTextField(props) {

    const [hasError, setHasError] = useState(false)

    // console.log("MyTextField: ", props);

    var field_props = {}



    var handleChange = (value) => {

        console.log("handleChange: ", value)
        var error = false

        if (props.type === 'number') {
            console.log("handleChange number");
            if (props.maxValue){
                if (props.maxValue < value) {

                    field_props.value = props.maxValue
                    error = true
                    // return
                }
            } 
            if (props.minValue !== undefined ){
                if (props.minValue > value) { 

                    field_props.value = props.minValue
                    error = true
                }
            } 
        } else {
            if ( props.type === 'text' ) {
                console.log("handleChange text");

                if (value.length < props.minLength) {
                    error = true
                    // return
                }

                if ( props.regex ){
                    const regex = new RegExp(props.regex);
                    const test = regex.test(value)
                    if (test === false) {
                        error = true
                        return
                    }
                }
            }
        } 
        
        if (!error) {
            if (props.onChange){
                props.onChange(props.name, value)
            }
        }
        setHasError(error)
    }


    // const field_keys = ['xs', 'sm', 'fullWidth', 'variant', 'name', 'type', 'label',
    //     'required', 'placeholder', 'disabled', 
    //     'value',
    //     'error'
    //  ]

 
    // field_keys.forEach(key => {
    //                 field_props[key] = props[key]
    // });

    let opt = {
        type: props.type,
        defaultValue: props.value,
        label: props.label,
        placeholder: props.placeholder,
        onValueChange: handleChange
        // onChange: handleChange
    }
    if (props.required == true) { opt['isRequired'] = true}
    if (props.prefix) { opt['startContent'] = props.prefix }
    if (props.endAdornment?.text) { opt['endContent'] = props.endAdornment.text}
    if (props.readonly) { opt['isReadOnly'] = true}
    if (props.helperText) { opt['errorMessage']=props.helperText }

    field_props['helperText'] = ''

    // console.log("opt: ", opt);

    // if ( field_props['value'] == null ){
    //     field_props['value'] = ""
    // }


    if (props.shrink){
        field_props['InputLabelProps']={ shrink: true }
    }



    return (
        <Input 
            {...opt}
            isInvalid={hasError}
            // onChange={props.onChange}
        />       
    )

    // const MUI_Text = () => {
    //     <TextField {...field_props} 
    //             onChange={event => handleChange(event.target.value)}
    //             onFocus={handleFocus}

    //             InputLabelProps={shrinked()}
    //             InputProps={adornment()}
    //             error={hasError}
    //             helperText={hasError ? (props.helperText ? props.helperText : "Error - not an acceptable value") : '' }
    //         />
    // }



    // return (

    //         <TextField {...field_props} 
    //             onChange={event => handleChange(event.target.value)}
    //             onFocus={handleFocus}
    //             InputLabelProps={shrinked()}
    //             InputProps={adornment()}
    //             error={hasError}
    //             helperText={hasError ? (props.helperText ? props.helperText : "Error - not an acceptable value") : '' }
    //         />
            
    // );


  }

//   export default myTextField