import React, { useEffect, useState } from "react";

import {Input} from "@nextui-org/react";
import { Debug } from "@/components/Debug";

export function MyTextField(props) {

    const [value, setValue] = React.useState(props.value);

    let handleChange = (value) => {

        console.log("handleChange: ", value)
        let error = false

        if (props.type === 'number') {
            console.log("handleChange number");
            if (props.maxValue){
                if (props.maxValue < value) {
                    error = true
                }
            } 

            if (props.minValue !== undefined ){
                if (props.minValue > value) { 
                    error = true
                }
            } 
        } else {
            if ( props.type === 'text' ) {
                console.log("handleChange text");

                if (value.length < props.minLength) {
                    error = true
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
        
        setValue(value)
        if (!error) {
            if (props.onChange){
                props.onChange(props.name, value)
            }
        }
        setHasError(error)
    }

    let opt = {
        type: props.type,
        defaultValue: props.value,
        label: props.label,
        placeholder: props.placeholder,
        onValueChange: handleChange,
        isDisabled: props.disabled
    }
    if (props.required == true) { opt['isRequired'] = true}
    if (props.prefix) { opt['startContent'] = props.prefix }
    if (props.endAdornment?.text) { opt['endContent'] = props.endAdornment.text}
    if (props.readonly) { opt['isReadOnly'] = true}
    if (props.disabled) { opt['isReadOnly'] = true}

    if (props.fn2) {
        const params = props.fn2.params.slice(1).slice(0,-1).split(',')

        let param = {}
        params.forEach(element => {
            if (  ! element in props ){
                throw (`params error in fn2. ${element} don't exist`)
            }
            param[element] = props[element]
        });

        const prefix = new Function( props.fn2.params , props.fn2.func );
        opt['prefix'] = prefix(param) 
        opt['startContent'] = prefix(param)
    }
    
    const [hasError, setHasError] = useState(false);
    const [opts, setOpts] = useState(opt);

    useEffect(()=>{
        console.log("useEffect hasError", hasError);
        if ( hasError ){
            if (props.helperText) { opt['errorMessage'] = props.helperText }
        } else {
            delete opt.errorMessage;
        }
        setOpts(opt);
    },[hasError]);

    return (
        <>
        <Debug params={[{props:props},{opts:opts},{hasError:hasError}]} title={props.name} />
        <Input 
            {...opts}
            isInvalid={hasError}
            value={value}
        />       
        </>
    )

  }

