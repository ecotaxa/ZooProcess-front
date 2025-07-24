import React, { useEffect, useState } from 'react';

// import {   TextField, InputAdornment } from "@mui/material"
// import { Textarea } from "@heroui/input";

import { Input } from '@heroui/react';
// import { Debug } from "./Debug";
import { Debug } from '@/components/Debug';
import { setConstantValue } from 'typescript';

export function MyTextField(props) {
  const [value, setValue] = React.useState(props.value);

  var handleChange = value => {
    console.log('handleChange: ', value);
    var error = false;

    if (props.type === 'number') {
      console.log('handleChange number');
      if (props.maxValue) {
        if (props.maxValue < value) {
          // field_props.value = props.maxValue
          error = true;
          // return
        }
      }
      if (props.minValue !== undefined) {
        if (props.minValue > value) {
          // field_props.value = props.minValue
          error = true;
        }
      }
    } else {
      if (props.type === 'text') {
        console.log('handleChange text');

        if (value.length < props.minLength) {
          error = true;
          // return
        }

        if (props.regex) {
          const regex = new RegExp(props.regex);
          const test = regex.test(value);
          if (test === false) {
            error = true;
            return;
          }
        }
      }
    }

    setValue(value);
    if (!error) {
      if (props.onChange) {
        props.onChange(props.name, value);
      }
    }
    setHasError(error);
  };

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
    onValueChange: handleChange,
    isDisabled: props.disabled,
    // onChange: handleChange
  };
  if (props.required == true) {
    opt['isRequired'] = true;
  }
  if (props.prefix) {
    opt['startContent'] = props.prefix;
  }
  if (props.endAdornment?.text) {
    opt['endContent'] = props.endAdornment.text;
  }
  if (props.readonly) {
    opt['isReadOnly'] = true;
  }
  if (props.disabled) {
    opt['isReadOnly'] = true;
  }

  // if (props.fn2 && props.project) {
  if (props.fn2) {
    // opt['TOTOT'] = 'TOTO'

    // console.log("props: ", props)

    // console.log("props.fn2.params:", props.fn2.params)
    // console.log("props.project:", props.project)
    // console.log("props.sample:", props.sample)
    // console.log("props['project']:", props['project'])

    // try {
    //     const json = JSON.parse(props.fn2.params)
    //     console.log("json:",json)
    // }
    // catch(e){
    //     console.log("json error:",e)
    // }

    // console.log("slice(-1): ",props.fn2.params.slice(0,-1))
    // console.log("slice(1): ",props.fn2.params.slice(1).slice(0,-1))

    const params = props.fn2.params.slice(1).slice(0, -1).split(',');
    // console.log("params: ",params)

    // const param = { project: props.project }
    let param = {};
    params.forEach(element => {
      if ((!element) in props) {
        throw `params error in fn2. ${element} don't exist`;
      }
      param[element] = props[element];
    });
    // console.log("param:", param)

    const prefix = new Function(props.fn2.params, props.fn2.func);
    opt['prefix'] = prefix(param); // ("Toto");
    opt['startContent'] = prefix(param);
  }

  // if (props.helperText) { opt['errorMessage'] = props.helperText }

  // setOpts(opt);
  const [hasError, setHasError] = useState(false);
  const [opts, setOpts] = useState(opt);

  useEffect(() => {
    console.log('useEffect hasError', hasError);
    if (hasError) {
      if (props.helperText) {
        opt['errorMessage'] = props.helperText;
      }
    } else {
      //if (props.helperText) {
      delete opt.errorMessage;
    }
    setOpts(opt);
  }, [hasError]);

  // console.log("MyTextField: ", props);

  // var field_props = {}

  // field_props['helperText'] = ''

  // console.log("opt: ", opt);

  // if ( field_props['value'] == null ){
  //     field_props['value'] = ""
  // }

  // if (props.shrink){
  //     field_props['InputLabelProps']={ shrink: true }
  // }

  return (
    <>
      <Debug params={[{ props: props }, { opts: opts }, { hasError: hasError }]} />
      <Input
        {...opts}
        isInvalid={hasError}
        value={value}
        // onChange={props.onChange}
      />
    </>
  );

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
