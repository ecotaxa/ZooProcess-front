import React, { useState } from "react";
// import PropTypes from "prop-types";

// import {  FormControl, InputLabel, FormHelperText, TextField, InputAdornment, Input } from "@mui/material"
import {   TextField, InputAdornment } from "@mui/material"

export function MyTextField(props) {
    // let state = {
    //   selected: null,
    //   hasError: false
    // };
    // const [selected, setSelected] = useState(false)
    const [hasError, setHasError] = useState(false)

    // const [typeField, setType] = useState(props.type); 

    // if (props.onChange){
    //     onChange = props.onChange
    // }

    // console.log("props",props)

    // var form_props = {}
    // var label_props = {}
    var field_props = {}

    // const form_keys = ['name', 'label' ] //[ 'label', 'variant', 'required', 'type', 'fullWidth', 'placeholder']
    // const label_keys = [ 'required' ]
    const field_keys = ['xs', 'sm', 'fullWidth', 'variant', 'name', 'type', 'label',
        'required', 'placeholder', 'disabled', 
        'value',
        'error'
        //, 'minLength'
        // 'limitMin',
        //   'maxValue','minValue',
        //   'endAdornment'
    ]

    // var helper = 'helperText'

    // var filterdprop = props
    // filterdprop['placeholder'] = undefined
    // filterdprop = props.keys().filter(prop => {if(prop !== "placeholder") return props[prop]})
    // 'tag', 
    // missing class : 'fullWidth'
    // en trop : 'helperText', 
    // arg : , 'placeholder'

    // Copy the interrested keys
    field_keys.forEach(key => {
        // if (key == 'value') {
        //     field_props[key] = ""
        // }
        // else
        //     {
                    field_props[key] = props[key]
            // }
    });

    field_props['helperText'] = ''

    if ( field_props['value'] == null ){
        field_props['value'] = ""
    }

    // endAdornment:{pos:'end', text:'m'}
    // if (props.endAdornment) {
    //     // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
    //     field_props['endAdornment']='endAdornment={<InputAdornment position="'+props.endAdornment.pos+'">'+props.endAdornment.text+'</InputAdornment>}'
    // }

    if (props.shrink){
        // InputLabelProps:'{{ shrink: true }}'
        field_props['InputLabelProps']={ shrink: true }
    }

    // 'label',
    // no need : , 'name', 'helperText'
    // missing class :  MuiTextField-root
    // field_keys.forEach(key => {
    //     form_props[key] = props[key]        
    // });

    // form_props['hiddenLabel'] = false

    // 'label', 'name', , 'label' , 'hintText'
    // missing class : Mui-required
    // missing : id=":rh:-label"
    // label_keys.forEach(key => {
    //     form_props[key] = props[key]        
    // });

    // const hasError = false
    var handleChange = (value) => {
    //   setState({ selected: value });
    //   setSelected(value)
        var error = false

        if (props.type === 'number') {

            if (props.maxValue){
                if (props.maxValue < value) {
                    // console.log("Error - value greather than max")
                    // if (props.limitMax) { value = limitMax}
                    field_props.value = props.maxValue
                    // setHasError(true)
                    error = true
                    // field_props['error']=true
                    return
                }
            } 
            if (props.minValue !== undefined ){
                if (props.minValue > value) { 
                    // console.log("Error - value lower than min")
                    // if (props.limitMin) { value = limitMin}
                    field_props.value = props.minValue
                    // setHasError(true)
                    error = true
                    // field_props['error']=true
                    //return
                }
            } 
        } else {
            if ( props.type === 'text' ) {

                if (value.length < props.minLength) {
                    // console.log("minLength")
                    // setHasError(true)
                    error = true
                    return
                }

                if ( props.regex ){
                    // console.log(props.regex)
                    const regex = new RegExp(props.regex);
                    const test = regex.test(value)
                    // console.log("test:",test)
                    if (test === false) {
                        // setHasError(true)
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

    // console.log("filterdprop",field_props);
    // console.log("form_props",form_props);
  
    // const handleClick = () => {
    //   this.setState({ hasError: false });
    //   set
    //   if (!state.selected) {
    //     setState({ hasError: true });
    //   }
    // }
  
    // const handleSelect = (event) => {
    //     console.log(event)
    // }

    const handleFocus = (event) => {
        console.log(event.currentTarget.name)
        // setHasError(false)
        // if (!selected) {
        //     setHasError(true);
        // }
      }

    // const { classes } = props;
    // const { selected, hasError } = state;
    
    // <FormControl className={classes.formControl} error={hasError}>
    //             <InputLabel {...label_keys} htmlFor="name" shrink>{props.name}</InputLabel>

    // const type = props.type

    const shrinked = () => {
        if (props.shrink){
            return { shrink: true }
        }
        return {}
    }

    const adornment = () => {
        if (props.endAdornment === undefined) return {}
        if (props.endAdornment.pos && props.endAdornment.text) {

            if (props.endAdornment.pos === 'end')
                // return '{<InputAdornment position="'+props.endAdornment.pos+'">'+props.endAdornment.text+'</InputAdornment>}'
                return { endAdornment: <InputAdornment position='end'>{props.endAdornment.text}</InputAdornment> }
            else if (props.endAdornment.pos === 'start')
                return { startAdornment: <InputAdornment position='start'>{props.endAdornment.text}</InputAdornment> }
            else 
                console.warning("Unknow endAdornment.pos value")
        }
        return {}
    }

    return (
        // <FormControl  error={hasError} {...form_props} autoComplete="off" >
        //   {/* <InputLabel htmlFor="name">{props.name}</InputLabel> */}
        //    {/* <InputLabel {...label_keys} htmlFor="name" shrink></InputLabel> */}
            // <TextField {...props}
            <TextField {...field_props} 
            // <Input {...field_props} InputLabelProps={{ shrink: true }}
                onChange={event => handleChange(event.target.value)}
                onFocus={handleFocus}
                // {typeField} === "date" && }
                // InputLabelProps={{ shrink: true }}  - à mettre pour date seul
                InputLabelProps={shrinked()}
                // endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                // endAdornment={props.endAdornment && "<InputAdornment position='"+props.endAdornment.pos+"'>"+props.endAdornment.text+"</InputAdornment>"}
                // endAdornment={props.endAdornment && <InputAdornment position='end'>Kg</InputAdornment>}
                // InputProps={ props.endAdornment && { startAdornment: <InputAdornment position='end'>Kg</InputAdornment> } }
                // InputProps={ props.endAdornment && { endAdornment: <InputAdornment position={props.endAdornment.pos}>{props.endAdornment.text}</InputAdornment> } }
                InputProps={adornment()}
                error={hasError}
                helperText={hasError ? (props.helperText ? props.helperText : "Error - not an acceptable value") : '' }
            />
            
            // {hasError && <FormHelperText>This is required!</FormHelperText>}
        // </FormControl>
    );
    // onSelect={handleSelect}

  }

//   export default myTextField
