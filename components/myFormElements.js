// import { TextField, Select, MenuItem } from "@mui/material"
// import { TextField } from "@mui/material"
// import { FormControl } from "@mui/material"
import { MySelect } from "./mySelect"
import { MyTextField } from "./myTextField"
// import SimpleSelect from "./SimpleSelect"
  
// import dayjs from "dayjs";
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TextField, InputAdornment } from "@mui/material"
// import { DatePicker } from "@mui/x-date-pickers"
import { MyDatePicker } from "./myDatePicker"
import { TextareaAutosize } from "@mui/material"
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/react";
// import { DateTimeField, LocalizationProvider, deDE } from "@mui/x-date-pickers";
// import {  DateTimePicker, LocalizationProvider, deDE } from "@mui/x-date-pickers";

import {MyInput}from "@/components/mySelect4.js"

export function FormElements(props) {

    // console.log("props.tag:",props.tag)

    // if (props.onChange){
    //     const onChange = props.onChange
    // }
    const mui = false;

    switch ( props.tag ){
        case "TextField":
            if (mui ){ //|| props.minLength){
                return (<MyTextField {...props} key={props.name}
                    onChange={props.onChange}/>)
            } else {

                let opt = {
                    type: props.type,
                    value: props.value,
                    label: props.label,
                    placeholder: props.placeholder,
                }
                if (props.required == true) { opt['isRequired'] = true}
                if (props.prefix) { opt['startContent'] = props.prefix }
                if (props.endAdornment?.text) { opt['endContent'] = props.endAdornment.text}

                console.log("opt: ", opt);

                return (
                    <Input 
                        {...opt}
                        onChange={props.onChange}
                    />
                    // <Input 
                    //     isRequired={true}
                    //     //value={props.value}
                    //     type={props.type} 
                    //     label={props.label} 
                    //     placeholder={props.placeholder} 
                    //     endContent={props.endAdornment?.text || ""}
                    //     startContent="Zooscan_"
                    //     onChange={props.onChange}
                    //     //minLength={props.minLength}
                    // />
                )
            }
        case "Select":
            if (true) {
                return (<MySelect {...props}  key={props.name}
                onChange={props.onChange}/>)
            } else {
                if (true){

                    return(
                        <MyInput  
                            props
                        /> 
                    )

                }else{
                console.log("SELECT props:", props);
                return (
                    <Select
                    isRequired
                    items={props.choice}
                    label={props.name}
                    placeholder={props.placeholder}
                    className="max-w-xs"
                    onChange={props.onChange}
                  >
                    {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
                  </Select>
                )
            }}
        case "DateField":
            <MyDatePicker {...props}  key={props.name}
                onChange={props.onChange}/>
        case "TextArea":
            if (mui){
                return (
                <TextareaAutosize {...props}   key={props.name}
                    onChange={props.onChange}
                />)
            } else {
                return (
                <Textarea  onChange={props.onChange}
                    isInvalid={false}
                    isRequired
                    // variant="bordered"
                    label={props.label}
                    placeholder={props.placeholder}
                    defaultValue={props.defaultValue}
                    // errorMessage="The description should be at least 255 characters long."
                    className="max-w-xs"
                />)
            }
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
