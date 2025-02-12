"use client";

import { calibrationUpdate
    //, useInstrument
     } from "@/app/api/instruments"
import { ICalibration, Instrument } from "@/app/api/network/interfaces"
// import { Instrument } from "@/app/api/network/zooprocess-api"
// import { ErrorComponent } from "@/components/ErrorComponent"
import { MyForm } from "@/components/myForm"
// import { MySpinner } from "@/components/mySpinner"
import { scannerCalibrationElements } from "@/config/formElements"
import { useRouter } from "next/navigation"
import { FC } from "react"

export const forms = [scannerCalibrationElements]

interface pageProps {
    params: {
        // instrumentid: string
        // calibrationid: string
        instrument: Instrument,
        calibration: ICalibration,
        onRefresh: () => void
    }
}

const UpdateCalibrationForm: FC<pageProps> = ({ params }) => {
    // const instrumentId = params.instrumentid;
    // const calibrationId = params.calibrationid;
    // const calibrationId = calibration.id
    const { instrument, calibration } = params
    const router = useRouter()

    // const { instrument, isLoading, isError } = useInstrument(instrumentId)
    
    const onChange = async (value:any) => {
        console.log("onChange: ", value)
        // try {
        //     const response = await calibrationUpdate({ data: value })
        //     console.log("Return to the instrument page")
        //     // router.back()
        //     router.push(`/instruments/${instrument.id}`)
        //     params.onRefresh()
        // } catch (error) {
        //     return await Promise.reject(error)
        // }

        // myForm gere la promise renvoyer
        return calibrationUpdate({ data: value })
    }

    const onCancel = () => {
        router.back()
    }

    const formButtons = {
        submit:'Update'
    }

    const formatData = (instrument:Instrument) => {
        const updatedForm = forms
        const myCalibration = instrument?.ZooscanCalibration?.find((cal:ICalibration) => cal.id == calibration.id);

        const form : any = []
        form['forms']=updatedForm
        form['value']=myCalibration
        form['title']='Calibration'
        form['subtitle']='Fill all the mandatory fields.'

        return form;
    }

    // const showForm = (instrument:Instrument| never[],calibrationId:string, isLoading:boolean,isError:boolean) =>  {
    const showForm = (instrument:Instrument| never[],calibration:ICalibration) =>  {
        // if (isLoading) {
        //     return <MySpinner />
        // }
        // if (isError) {
        //     return <ErrorComponent error={{ message: "Instrument not found" }} />
        // }
        const form = formatData(instrument as Instrument)

        return (
            <MyForm
                {...form} 
                onChange={onChange}
                onCancel={onCancel}
                button={formButtons}
            />    
        )
    }

    return (
        <>
            {/* {showForm(instrument,calibrationId,isLoading,isError)}     */}
            {showForm(instrument,calibration)}    
        </>
    );
}

export default UpdateCalibrationForm;
