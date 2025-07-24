import React, { useEffect, useState } from 'react';

import { Input } from '@heroui/react';
import { Debug } from '@/components/Debug';

export function MyTextField(props) {
  let initValue = props.value;
  if (props.myValues) {
    console.log('props.myValues', props.myValues);
    if (props.myValues[props.name]) {
      console.log('props.myValues[props.name]', props.myValues[props.name]);
      initValue = props.myValues[props.name];
    }
  }
  console.log('initValue', initValue);

  const [value, setValue] = React.useState(props.value);
  // const [value, setValue] = React.useState(props.value.myValues[props.name]|props.value);
  // const [value, setValue] = React.useState(initValue);

  let handleChange = value => {
    // if(props.disabled==true) {
    //     console.log("CASSOSSSSSSSS")
    //     return
    // }

    console.log('handleChange: ', value);
    let error = false;

    // if (props.update){
    //     console.log("need to update", props.name)
    //     updateValue(props.update, props.maxValue, value)
    // }

    if (props.type === 'number') {
      console.log('handleChange number');
      if (props.maxValue) {
        if (props.maxValue < value) {
          error = true;
        }
      }

      if (props.minValue !== undefined) {
        if (props.minValue > value) {
          error = true;
        }
      }
    } else {
      if (props.type === 'text') {
        console.log('handleChange text');

        if (value.length < props.minLength) {
          error = true;
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
      if (!props.update) {
        if (props.disabled == false) {
          if (props.onChange) {
            props.onChange(props.name, value);
          }
        } else {
          console.log('props.disabled == true');
        }
      } else {
        console.log('props.update');
      }
    }
    setHasError(error);
  };

  // const updateValue = (update, myValues, value) => {
  //     //if (props.fn2) {
  //       console.log("updateValue(update)  : ", update );
  //       console.log("updateValue(myValues): ", myValues );
  //       console.log("updateValue(value)   : ", value );

  //       const params = update.params.slice(1).slice(0,-1).split(',')

  //       let param = {}
  //       params.forEach(element => {
  //         console.log("element: ", element);
  //           if (  ! element in props ){
  //               throw (`params error in update. ${element} don't exist`)
  //           }
  //           param[element] = myValues[element]
  //           console.log("myValues[element]: ", myValues[element]);
  //       });

  //       console.log("updateValue(param)   : ", param );

  //       const prefix = new Function( update.params , update.func );
  //       // opt['prefix'] = prefix(param)  // mui/material ?
  //       // opt['startContent'] = prefix(param) // NextUI
  //       const v = prefix(param)

  //       console.log("updateValue(v)   : ", v );
  //       return v
  //     //}
  // }

  // if ( props.update ){
  //     console.debug("Element", props.name, "to update PRESENT")

  //     const valueUpdated = updateValue(props.update, props.myValues, props.value)
  //     // console.debug("opts: ", opts);
  //     console.debug("FORM VALUE for ", props.name, " = ", valueUpdated, " <= ", props.value );
  //     // formitem['value'] = valueUpdated
  //     // formitem['onChange'](valueUpdated)
  //     // props.onChangeElement(formitem.name,valueUpdated)
  //     // let copiedValues = myValues
  //     // copiedValues[formitem.name] = valueUpdated
  //     // setMyValues(copiedValues)
  //     // setValeur({ name: formitem.name, value: valueUpdated })
  //     // setValue(valueUpdated)
  //     // props.value = valueUpdated
  // }

  // if ( props.update ){
  //     setValue(props.myValues[props.name]) // infinite loop
  // }

  let opt = {
    type: props.type,
    defaultValue: props.value,
    label: props.label,
    placeholder: props.placeholder,
    // onValueChange: (v) => handleChange(v),
    onValueChange: handleChange,
    isDisabled: props.disabled,
  };

  // if (!props['disabled'] || props.disabled == false){
  //     console.log("props.disabled == false")
  //     opt['onValueChange'] = handleChange
  //     // opt['onValueChange'] = () => {handleChange()} // la saisie ne fonctionne plus
  //     // opt['onValueChange'] = (v) => {handleChange(v)}
  // }
  // else {
  //     console.log("************************************************")
  //     console.log("props.disabled", props.disabled)
  // }

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

  if (props.fn2) {
    const params = props.fn2.params.slice(1).slice(0, -1).split(',');

    let param = {};
    params.forEach(element => {
      if ((!element) in props) {
        throw `params error in fn2. ${element} don't exist`;
      }
      param[element] = props[element];
    });

    const prefix = new Function(props.fn2.params, props.fn2.func);
    opt['prefix'] = prefix(param);
    opt['startContent'] = prefix(param);
  }

  const [hasError, setHasError] = useState(false);
  const [opts, setOpts] = useState(opt);

  useEffect(() => {
    console.log('useEffect hasError', hasError);
    if (hasError) {
      if (props.helperText) {
        opt['errorMessage'] = props.helperText;
      }
    } else {
      delete opt.errorMessage;
    }
    setOpts(opt);
  }, [hasError]);

  return (
    <>
      <Debug
        params={[{ props: props }, { opts: opts }, { hasError: hasError }]}
        title={props.name}
      />

      <Input {...opts} isInvalid={hasError} value={value} />
    </>
  );
}
