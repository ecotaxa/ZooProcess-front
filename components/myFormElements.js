// import { TextField, Select, MenuItem } from "@mui/material"
// import { TextField } from "@mui/material"
// import { FormControl } from "@mui/material"
// import { MySelect } from "./mySelect" // MUI
import { MySelect } from "./mySelect5"
import { MyInputSelect } from "./myInputSelect"
import { MyTextField } from "./myTextField2"
import { MyTextArea } from "./myTextArea"
// import { DisbledField } from "./DisabledField"
// import SimpleSelect from "./SimpleSelect"
  
// import dayjs from "dayjs";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TextField, InputAdornment } from "@mui/material"
// import { DatePicker } from "@mui/x-date-pickers"
import { MyDatePicker } from "./myDatePicker.old"
// import { TextareaAutosize } from "@mui/material"
// import { Input, Textarea } from "@nextui-org/input";
// import { Select, SelectItem } from "@nextui-org/react";
// import { DateTimeField, LocalizationProvider, deDE } from "@mui/x-date-pickers";
// import {  DateTimePicker, LocalizationProvider, deDE } from "@mui/x-date-pickers";

// import {MyInput}from "@/components/mySelect4.js"
import Drives from "./drives";
import Instruments from "./instruments";
import { Input } from "@nextui-org/input"
// import MapComponent from "./MapComponent"
import MyMap from "./myMap"
import ScannerComponent from "./Scanner"
import { MyScanner } from "./myScanner"
// import { useCallback } from "react"
// import { Input } from "postcss"

export function FormElements(props) {

    // console.log("props.tag:",props.tag)

    // if (props.onChange){
    //     const onChange = props.onChange
    // }
    const mui = false;

    switch ( props.tag ){

        case "DisabledField":

        // let opts = {}
        // if (props.update){
        //     opts.onChange = props.onChange
        // }
        let propsUpdated = {...props}
        if ( props.myValues ){
            console.log("props.myValues:",props.myValues)
            if (props.myValues[props.name]){
                propsUpdated.value = props.myValues[props.name] //|| props.value
            }
            else{
                console.debug("props.myValues[props.name] is undefined")
            }
        }
        else {
            console.debug("props.myValues is undefined")
        }


        let opt = {}
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

        const params = props.fn2.params.slice(1).slice(0,-1).split(',')
        // console.log("params: ",params)

        // const param = { project: props.project }
        let param = {}
        params.forEach(element => {
            if (  ! element in props ){
                throw (`params error in fn2. ${element} don't exist`)
            }
            param[element] = props[element]
        });
        // console.log("param:", param)


        const prefix = new Function( props.fn2.params , props.fn2.func );
        opt['startContent'] = prefix(param)
    }



            // propsUpdated.value = props.myValues[props.name] || props.value
        // return (<MyTextField {...props} key={props.name}
        //     project={props.project}
        //     sample={props.sample}
        //     subsample={props.subsample}
        //     onChange={(n,v) => props.onChange(n,v) }/>)

        return (
            <>
                {/* DisabledField */}
                {/* {JSON.stringify( props) } */}
                {/* {JSON.stringify( propsUpdated) } */}

                {/* {JSON.stringify( props.myValues)} */}
                {/* {props.myValues[props.name]} */}
                <Input readOnly={true} value={props.myValues[props.name]} {...opt}/>
            </>

        )

        // return (<DisbledField {...propsUpdated} key={props.name}
        //         project={props.project}
        //         sample={props.sample}
        //         subsample={props.subsample}
        //         // {...opts}
        //     />)



        case "TextField":

            let opts = {}
            if (props.update){
                opts.onChange = props.onChange
            }

            // return (<MyTextField {...props} key={props.name}
            //     project={props.project}
            //     sample={props.sample}
            //     subsample={props.subsample}
            //     onChange={(n,v) => props.onChange(n,v) }/>)

            return (<MyTextField {...props} key={props.name}
                    project={props.project}
                    sample={props.sample}
                    subsample={props.subsample}
                    {...opts}
                />)
    

            // if (mui ){ //|| props.minLength){
            //     return (<MyTextField {...props} key={props.name}
            //         onChange={props.onChange}/>)
            // } else {

            //     let opt = {
            //         type: props.type,
            //         defaultValue: props.value,
            //         label: props.label,
            //         placeholder: props.placeholder,
            //         onValueChange: props.onChange
            //     }
            //     if (props.required == true) { opt['isRequired'] = true}
            //     if (props.prefix) { opt['startContent'] = props.prefix }
            //     if (props.endAdornment?.text) { opt['endContent'] = props.endAdornment.text}
            //     if (props.readonly) { opt['isReadOnly'] = true}

            //     // console.log("opt: ", opt);

            //     return (
            //         <Input 
            //             {...opt}
            //             onChange={props.onChange}
            //         />
            //         // <Input 
            //         //     isRequired={true}
            //         //     //value={props.value}
            //         //     type={props.type} 
            //         //     label={props.label} 
            //         //     placeholder={props.placeholder} 
            //         //     endContent={props.endAdornment?.text || ""}
            //         //     startContent="Zooscan_"
            //         //     onChange={props.onChange}
            //         //     //minLength={props.minLength}
            //         // />
            //     )
            // }
        case "Drives":
            return ( <Drives key={props.name}
                {...props}
                onChange={props.onChange}
            />)

        case "Instruments":
            return ( <Instruments key={props.name}
                {...props}
                onChange={props.onChange}
            />)

        case "Map":

                // const newprops =  { ...props, start:[43,5],end:[45,6]}

                // const newprops =  { ...props, value:{"start":[43,5], "end":[45,6]} }
                // const newprops =  { ...props, value:{"startLat":43,"startLng":5, "endLat":45,"endLng":6} }

            // const onCoordsChange = useCallback( (newCoords) => {
            //     console.log("newCoords: ", newCoords);
            //     props.onChange(props.name, newCoords)
            // }, [props.onChange])

            console.log("MAP props: ", props);

            // return ( <>Map component</> )
            return ( <MyMap key={props.name}
                {...props} 
                // start={[43,5]} end={[45,6]}
                // {...newprops}
                onChange={props.onChange}
                // onChange={onCoordsChange}
            />)

        case "Scanner":

            console.log("MAP props: ", props);

            // return ( <ScannerComponent key={props.name}
            return ( <MyScanner key={props.name}
                {...props} 
                onChange={props.onChange}
            />)

        case "Select":
                return (<MySelect {...props}  key={props.name}
                    onChange={props.onChange}/>)
            
            // if (mui) {
            //     return (<MySelect {...props}  key={props.name}
            //     onChange={props.onChange}/>)
            // } else {   
            //     // console.log("SELECT props:", props);
            //     let opt = {
            //         id: props.name,
            //         items: props.choice,
            //         label: props.label,
            //         placeholder: props.placeholder,
            //         className:"max-w-xs",
            //     }
            //     // console.log("")
            //     if (props.value) { opt['defaultSelectedKeys'] = [props.value]; }
            //     if (props.required == true) { opt['isRequired'] = true; }

            //     return (
            //         <Select
            //             onChange={props.onChange}
            //             // defaultValue={props.value}
            //             // defaultSelectedKeys={[props.value]}
            //             {...opt}
            //         >
            //             {(item) => <SelectItem key={item.id}>{item.value}</SelectItem>}
            //         </Select>
            //     )
            // }

        case "InputSelect":
            return (
                <MyInputSelect {...props}  key={props.name}
                    onChange={props.onChange}
                />
            )

        case "DateField":
            <MyDatePicker {...props}  key={props.name}
                onChange={props.onChange}/>

        case "TextArea":

            return (
                <MyTextArea 
                    {...props}   
                    key={props.name}
                    onChange={props.onChange}
                />
                )

            // if (mui){
            //     return (
            //     <TextareaAutosize {...props}   key={props.name}
            //         onChange={props.onChange}
            //     />)
            // } else {
            //     return (
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
            // }
        

        case "Empty":
            return (
                <div></div> 
            )
        
    }

    return (
        <div>
            <div>Issue on input field :</div>
            <div
                ><ul>
                    <li>Name:{props.name||"no name"} </li>
                    <li>Tag: {props.tag||"no tag"}</li>
                </ul> 
            </div>
            <div>{JSON.stringify(props)}</div>
        </div>
    )

    // if (props.tag === "TextField") {
    //     // -- return <TextField {...props}/>
    //     return <MyTextField {...props} onChange={props.onChange}/>

    //     // -- return (
    //     //     <FormControl>
    //     //         <TextField {...props}/>
    //     //     </FormControl>
    //     // )
    // }

    // if (props.tag === "Select") {
    //     // //return <Select {...props}/>
    //     // return (
    //     // <Select
    //     //     value={""}
    //     //     onChange={handleChange}
    //     //     displayEmpty
    //     //     inputProps={{ 'aria-label': 'Without label' }}
    //     //   >
    //     //   <MenuItem value="">
    //     //     <em>None</em>
    //     //   </MenuItem>
    //     //   {
    //     //     console.log(props.choice)
    //     //   }
    //     //   {
    //     //     props.choice.map( choix => 
    //     //         <MenuItem value={choix.id}>{choix.value}</MenuItem>
    //     //   )}
    //     // </Select>

    //     // )
    //     // var data = props
    //     // if ( props.value === '' ) { data.value = 0 }
    //     // data.value is read only ???
    //     return <MySelect {...props} onChange={props.onChange}/>
    //     // return <SimpleSelect {...props}/>
    // }

    // if (props.tag === "DateField") {

    //     return (
    //         <MyDatePicker {...props} onChange={props.onChange}/>
    //     )

    //     // return (
    //     // // <MyDatePicker {...props} onChange={props.onChange}/>
    //     // // <DateTimeField {...props} onChange={props.onChange}/>
    //     // // <MyTextField
    //     // <LocalizationProvider
    //     //     //  localeText={{ clearButtonLabel: 'Empty', todayButtonLabel: 'Now', dateAdapter:''}}
    //     //     //  localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
    //     //     //  dateAdapter={}
    //     //     localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
    //     //     dateAdapter={AdapterDayjs}
    //     //     >
    //     //     <DateTimePicker
    //     //     {...props} onChange={props.onChange} views={['year', 'day', 'hours', 'minutes']}
    //     //     openTo="year" dateAdapter={'fr'}
    //     //     format="YYYY/MM/DD HH:mm"
    //     //     defaultValue={dayjs('2022-04-17T15:30')}
    //     //     orientation="landscape"
    //     //     />
    //     // </LocalizationProvider>

    //     // )

    // }

//     <LocalizationProvider
//     localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
//     dateAdapter={AdapterDayjs}
//   >
//     <DateTimePicker defaultValue={defaultValue}/>
//   </LocalizationProvider>

}
