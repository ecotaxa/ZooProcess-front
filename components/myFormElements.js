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
// import { DateTimeField, LocalizationProvider, deDE } from "@mui/x-date-pickers";
// import {  DateTimePicker, LocalizationProvider, deDE } from "@mui/x-date-pickers";


export function FormElements(props) {

    // console.log("props.tag:",props.tag)

    // if (props.onChange){
    //     const onChange = props.onChange
    // }

    switch ( props.tag ){
        case "TextField":
            return <MyTextField {...props} key={props.name}
                onChange={props.onChange}/>
        case "Select":
            return <MySelect {...props}  key={props.name}
                onChange={props.onChange}/>
        case "DateField":
            <MyDatePicker {...props}  key={props.name}
                onChange={props.onChange}/>
        case "TextArea":
            return <TextareaAutosize {...props}   key={props.name}
                onChange={props.onChange}/>
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
