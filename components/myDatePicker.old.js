import {  DateTimePicker, LocalizationProvider, deDE } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


export function MyDatePicker(props){

    dayjs.extend(utc)
    dayjs.extend(timezone)

    const today = dayjs();
    const yesterday = dayjs().subtract(1, 'day');
    const todayStartOfTheDay = today.startOf('day');
    const todayAtNoon = dayjs().set('hour', 12).startOf('hour');
    const todayAt9AM = dayjs().set('hour', 9).startOf('hour');
    const tomorrow = dayjs().add(1,'day')

    // const defaultValue = dayjs('2022-04-17T15:30');
    const defaultValue = null; //today;
    // const [value,setValue] = useState(props.value ? props.value : defaultValue)
    const [value, setValue] = useState( dayjs(props.value)) // ? props.value : null)
    
    // if (value === '') {
    //         props.value ? props.value : defaultValue
    // }

    // return (
    // <LocalizationProvider
    // localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
    // >

    // <DatePicker {...props}
    //     views={['year', 'day', 'hours', 'minutes']}
    //     openTo="year"
    //     orientation="landscape"
    //     // value={value}
    //     // onChange={(newValue) => setValue(newValue)}
    //     />
    // </LocalizationProvider>
    // )

    const onChange = (event) => {

        console.log("onChange",event)

        if (event.$d === "Invalid Date" || event.$d == "Invalid Date") {
            console.log("date is invalid")
            return //value
        }

        // const r = dayjs('Thu Oct 12 2017 11:40:54 GMT+0200 (Central European Summer Time)')
        const date = dayjs(event)

        console.log('date',date.toString())
        console.log("$d",event.$d)
        console.log('ISO',date.toISOString())
        console.log('YYYYMMDDHHmm',date.format('YYYYMMDDHHmm'))
        console.log('UTC',dayjs.utc(event.$d))

        // setValue(date.format('YYYYMMDDHHmm'))
        // setValue(event.$d)
        const utcDate = dayjs.utc(event.$d)
        setValue(utcDate)

        // props.onChange(value)
        // props.onChange(props.name, value) marche pas setValue est asynchrone
        // props.onChange(props.name, date.format('YYYYMMDDHHmm'))
        props.onChange(props.name, utcDate)

        // return value //
    }



    return (
        // <MyDatePicker {...props} onChange={props.onChange}/>
        // <DateTimeField {...props} onChange={props.onChange}/>
        // <MyTextField
        <LocalizationProvider
            //  localeText={{ clearButtonLabel: 'Empty', todayButtonLabel: 'Now', dateAdapter:''}}
            //  localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
            //  dateAdapter={}
            localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
            dateAdapter={AdapterDayjs}
            >
            <DateTimePicker
                {...props} 
                // onChange={props.onChange} 
                onChange={onChange} 
                onAccept={onChange}
                views={['year', 'day', 'hours', 'minutes']}
                openTo="year"
                format="YYYY/MM/DD HH:mm"
                defaultValue={defaultValue}
                // maxDateTime={tomorrow}
                disableFuture
                timezone="system"
                value={value}
                // orientation="landscape"
            />
        </LocalizationProvider>

        )

}
