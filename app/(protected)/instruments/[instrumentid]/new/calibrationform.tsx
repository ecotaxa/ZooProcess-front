"use client";

import { addCalibration
    // , useInstrument
 } from "@/app/api/instruments"
import { ICalibration, ICalibrationForm, Instrument } from "@/app/api/network/interfaces"
// import { Calibration, ICalibrationForm, Instrument } from "@/app/api/network/zooprocess-api"
// import { ErrorComponent } from "@/components/ErrorComponent"
import { MyForm } from "@/components/myForm"
// import { MySpinner } from "@/components/mySpinner"
import { scannerCalibrationElements } from "@/config/formElements"
import { useRouter } from "next/navigation"
import { FC, useState } from "react"


export const forms = [
    // userFormElements
    scannerCalibrationElements
]


interface pageProps {
    params: {
        // instrumentid: string,
        instrument: Instrument,
        // onChange: (value:any)=>Promise<void>,
        // onCancel: ()=>void,
    }
}

const CalibrationForm: FC<pageProps> = ({ params }) => {

    console.debug("params: ", params);
    const {instrument} = params
    // const instrumentId = params.instrumentid;
    console.debug("~instrumentId: ", instrument.id)
    const router = useRouter()


    // const { instrument, isLoading, isError } = useInstrument(instrumentId)
    // const [ userInfo , setUserInfo ] = useState(user);
    const [stringifiedData, setData] = useState("")


    // useEffect(() => {
    //     setUserInfo(user)
    // }, [user])



    // const onChange = async (value:any) => {
    //     console.log("onChange: ", value)

    //     setData(JSON.stringify(value, null, 2))
    //     console.log("App onChange:", stringifiedData)

    //     // return addCalibration({instrumentId:instrumentId, data:value})
    //     try {
    //         const response = await addCalibration({instrumentId:instrument.id, data:value})
    //         console.log("Return to the instrument page")
    //         // router.back()
    //         router.push(`/instruments/${instrument.id}`)
    //         // params.onRefresh()
    //     } catch (error) {
    //         return await Promise.reject(error)
    //     }
    // }

    const onChange = async (value:any) => {

        console.log("onChange: ", value)

        setData(JSON.stringify(value, null, 2))
        console.log("App onChange:", stringifiedData)

        // params.onChange(value)
        addCalibration({instrumentId:instrument.id, data:value})
        .then(
            (response:any) => {
                console.log("response: ", response)
                console.log("Return to the instrument page")
                // router.back()
                router.push(`/instruments/${instrument.id}`)
                // params.onRefresh()
            },
            (error:any) => {
                console.log("error: ", error)
                // return await Promise.reject(error)
            }
        )

    }

    const onCancel = () => {
        router.back()
        // router.push({
        //     pathname: '/projects/[projectid]',
        //     query: { projectid: projectid },                                         
        // })
    }


    const formButtons = {
        submit:'Add'

    }



    const empty:ICalibrationForm = {
        instrumentId:instrument.id,
        frame: '',
        xOffset: 0,
        yOffset: 0,
        xSize: 0,
        ySize: 0
    }

    console.debug("empty: ", empty)


const formatData = (calibration:ICalibration) => {
    console.log("formatData(calibration =", calibration );


    const updatedForm = forms
    
    const sn = (instrument as Instrument).name
    

    const form : any = []
        form['forms']=updatedForm
        form['value']=calibration
        form['title']='Calibration' + " for " + sn
        form['subtitle']='Fill all the mandatory fields.'

    return form;
}

const showForm = (calibration:ICalibration|any) => {

        // if (isLoading) return <MySpinner />;
        // if (isError) return <ErrorComponent error={isError} />;
        // if (!calibration) return <ErrorComponent error="calibration not found" />

        // if ( ! user) return <ErrorComponent error={isError} />

        // else {
        const form = formatData(calibration)

        return (
            <MyForm
                {...form} 
                onChange={onChange}
                onCancel={onCancel}
                button={formButtons}
            />
        )
        // }
    }


    return (
        <>
            {/* <h1>Calibration for {instrumentId}</h1> */}
            {/* <h1>Calibration for {(instrument as Instrument).name|| "Loading..."}</h1> */}
            {showForm(empty)}
        </>
    );
}

export default CalibrationForm;
