import AsyncInstrumentData from "@/app/api/data/AsyncInstrumentData";
import { ICalibration, ICalibrationForm, Instrument } from "@/app/api/network/interfaces";
import { useEffect, useState } from "react";
// import { getInstruments } from "@/app/api/network/zooprocess-api";

import { Debug } from "@/components/Debug"
// import Instruments from "./instruments";
import { Select, SelectItem } from "@heroui/react";


interface ScannerComponentProps {
    instrumentId?: string;
}

interface Item {
    id: string
    name: string
}

interface ItemS {
    id: string
    frame: string
}

interface IScanner {
    id: string
    settingsId?: string
}

interface FormItem {
    id: string
    name: string
    value: IScanner
    placeholder: string
    label: string
    required: boolean
    // choice: Array<Item>
    onChange: (name:string,value:IScanner)=>{}
}

// const ScannerComponent: React.FC<ScannerComponentProps> = (params) => {
// const ScannerComponent = (props:FormItem) => {
const ScannerComponent = (props:any) => {

    // const { instrumentId } = params;
    console.log("ScannerComponent props: ", props)
    const [scannerValues, setScannerValues] = useState(props.value || {});

    // const instruments = getInstruments();
    const instrumentList = AsyncInstrumentData(true) // getInstruments()  
    const [instruments, setInstruments] = useState<Array<Instrument>>([])

    const [settingsList, setSettingsList] = useState<Array<ICalibration>>([])
    const [settingDisabled, setSettingDisabled] = useState<boolean>(true)

    useEffect( ()=> {
        const fetchInstruments = async () => {
            const instrumentsData = await instrumentList  // wait the Promise return
            console.log("AsyncInstrumentComponent useEffect: ", instrumentsData)
            setInstruments(instrumentsData)
        }
        fetchInstruments()
    }, [])

    useEffect( ()=> {
        console.debug("scannerValues.id useEffect: ", scannerValues.id)
        console.debug("instruments: ", instruments)
        const instrumentSettings = instruments.find(instrument => instrument.id === scannerValues.id)?.ZooscanCalibration;
        console.debug("instrumentSettings: ", instrumentSettings)
        if ( instrumentSettings && instrumentSettings.length > 0 ) {
            const settingsWithNoArchive = instrumentSettings.filter(setting => setting.archived === false);
            setSettingsList(settingsWithNoArchive);
            setSettingDisabled(false);
        }

    }, [scannerValues.id, instruments])

    useEffect( ()=> {
        console.debug("ScannerComponent useEffect: ", props)
        if (props.value){
            setScannerValues(props.value)
            const instrumentSettings = instruments.find(instrument => instrument.id === props.value.id)?.ZooscanCalibration;
            if ( instrumentSettings && instrumentSettings.length > 0 ) {
                const settingsWithNoArchive = instrumentSettings.filter(setting => setting.archived === false);
                setSettingsList(settingsWithNoArchive);
                setSettingDisabled(false);
            }
        }

    }, [props])

    const handleChangeId = (value : string /* event: SelectChangeEvent*/) => {
        // const handleChange = (event: any) => {
    
            // console.log("typeof event: ", typeof(event));
    
            // const value = event.target.value;
            console.log("handleChange: ", value)
    
            // if (props.onChange){
            //     props.onChange(props.name, value)
            // }
            //console.log("setValue:", value)

            // let newValue = { ...scannerValues , scannerId: value };
            // let newValue = { ...scannerValues , id: value };
            let newValue = { id: value, settingsId : undefined };

            if (props.onChange){
                console.debug("id props.onChange: ", newValue)
                props.onChange(newValue)
            }

            const instrumentSettings = instruments.find(instrument => instrument.id === value)?.ZooscanCalibration;
            if ( instrumentSettings && instrumentSettings.length > 0 ) {
                const settingsWithNoArchive = instrumentSettings.filter(setting => setting.archived === false);
                setSettingsList(settingsWithNoArchive);
                setSettingDisabled(false);
            }
            
            setScannerValues(newValue);
    }
    
    const handleChangeSetting = (value: string /* event: SelectChangeEvent*/) => {
        // const handleChange = (event: any) => {

            // console.log("typeof event: ", typeof(event));

            // const value = event.target.value;
            console.log("handleChange: ", value)

            // if (props.onChange){
            //     props.onChange(props.name, value)
            // }

            let newValue = { ...scannerValues, settingsId: value };
            setScannerValues(newValue);

            if (props.onChange){
                console.debug("settingsId props.onChange: ", newValue)
                props.onChange(newValue)
            }
        }

    let optsIntruments : any = {
        id: props.name,
        items: instruments,
        label: props.label || "Instruments",
        placeholder: props.placeholder || "Choose your instrument",
        // className:"max-w-xs",
        className:"w-full",
        // onSelectionChange:{handleChange}
    }

    let optsSettings : any = {
        disabled: settingDisabled,
        id: props.name,
        items: settingsList,
        label: props.label || "Settings",
        placeholder: props.placeholder || "Choose your setting",
        // className:"max-w-xs",
        className:"w-full",
        // onSelectionChange:{handleChange}
    }

    // console.log("added props");
    // if (props.value) { optsIntruments['defaultSelectedKeys'] = [props.value.id]; }
    // if (props.required == true) { optsIntruments['isRequired'] = true; }
        
    const showSetting = () => {

        const setting = settingsList.find(setting => setting.id === scannerValues.settingsId);

        console.log("setting: ", settingsList)
        console.log("scannerValues: ", scannerValues)
        console.log("setting: ", setting)



        // return (
        //     <>
        //     <p>scanner id: {scannerValues.id ?? "" }</p>
        //     <p>setting id:{scannerValues.settingsId ?? "" }</p>
        //     <p>Setting List{ JSON.stringify(settingsList,null,2)}</p>
        //     <p>setting{ JSON.stringify(setting,null,2)}</p>
        //     <p>setting frame: {setting?.frame??""}</p>
        //     <p>xOffset:{setting?.xOffset??""}-yOffset:{setting?.yOffset??""}-xSize:{setting?.xSize??""}-ySize:{setting?.ySize??""}</p>
        //     </>
        // )
        return (
            // <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-4 gap-4 p-4 rounded-lg">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">X Offset</span>
                    <span>{setting?.xOffset ?? "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">Y Offset</span>
                    <span>{setting?.yOffset ?? "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">X Size</span>
                    <span>{setting?.xSize ?? "N/A"}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">Y Size</span>
                    <span>{setting?.ySize ?? "N/A"}</span>
                </div>
            </div>
        );
    }

    // return (
    //     <div>
    //         {/* Your component logic here */}
    //         <Debug params={instruments}/>
    //         {/* <p>Instrument ID: {instrumentId ?? "None"}</p> */}

    //         <Debug params={[{props:props},{opts:optsIntruments}]} title={props.name} />


    //         <Select
    //             onChange={(event) => handleChangeId(event.target.value)}
    //             {...optsIntruments}
    //             >
    //             {(item:Item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
    //         </Select>

    //         <Select
    //             onChange={(event) => handleChangeSetting(event.target.value)}
    //             {...optsSettings}
    //             >
    //             {(item:ItemS) => <SelectItem key={item.id}>{item.frame}</SelectItem>}
    //         </Select>

    //         {showSetting()}

    //         <ul>
    //             {instruments.map((instrument, index) => (
    //                 <li key={index}>{instrument.name}</li>
    //             ))}
    //         </ul>

    //     </div>
    // )


    return (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-2 p-2 rounded-lg">
                <Debug params={scannerValues.id} title="scannerValues.id" />
                <Debug params={scannerValues.settingsId} title="scannerValues.settingsId" />
                <Debug params={settingsList} title="settingsList" />
            </div>
            <div className="grid grid-cols-2 gap-2 p-2 rounded-lg">
            {/* <div className="flex flex-row gap-4 items-center mb-4"> */}
                <Select
                    onChange={(event) => handleChangeId(event.target.value)}
                    {...optsIntruments}
                    defaultSelectedKeys={[scannerValues.id]}
                >
                    {(item:Item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
                </Select>
    
                <Select
                    onChange={(event) => handleChangeSetting(event.target.value)}
                    {...optsSettings} 
                    defaultSelectedKeys={[scannerValues.settingsId]}
                >
                    {(item:ItemS) => <SelectItem key={item.id}>{item.frame}</SelectItem>}
                </Select>
            {/* </div> */}
    
            {/* <div className="flex items-center gap-2 mb-2">
                <input 
                    type="checkbox" 
                    id="showCalibration"
                    className="w-4 h-4"
                />
                <label htmlFor="showCalibration">Show Calibration Values</label>
            </div> */}
    
            {/* {scannerValues.settingsId && showSetting()} */}
            {showSetting()}
            </div>
        </div>
    )
    
}

export default ScannerComponent;
