// import { addCalibration, calibrationUpdate, useInstrument } from "@/app/api/instruments"
// import { Calibration, CalibrationForm, Instrument } from "@/app/api/network/zooprocess-api"
import { calibrationUpdate } from "@/app/api/instruments"
import { Calibration } from "@/app/api/network/interfaces"
// import { ErrorComponent } from "@/components/ErrorComponent"
import { MyForm } from "@/components/myForm"
// import { MySpinner } from "@/components/mySpinner"
import { scannerCalibrationElements } from "@/config/formElements"
import { useRouter } from "next/navigation"
import { FC, 
    // useEffect, 
    useState } from "react"


export const forms = [
    // userFormElements
    scannerCalibrationElements
]


interface pageProps {
    params: {
        instrumentid: string
        calibration: Calibration
    }
}

const UpdateCalibrationForm: FC<pageProps> = ({ params }) => {

    console.debug("params: ", params);
    // const instrumentId = params.instrumentid;
    const calibration = params.calibration;
    // const instrumentId = calibration.instrumentId;
    // console.debug("~instrumentId: ", instrumentId)
    console.debug("~calibration: ", calibration)
    const router = useRouter()


    // const [formData, setFormData] = useState(params);

//   useEffect(() => {
//     setFormData(params);
//   }, [params]);

    // const { instrument, isLoading, isError } = useInstrument(instrumentId)
    // // const [ userInfo , setUserInfo ] = useState(user);
    const [stringifiedData, setData] = useState("")


    // useEffect(() => {
    //     setUserInfo(user)
    // }, [user])



    
    const onChange = (value:any) => {
        console.log("onChange: ", value)

        setData(JSON.stringify(value, null, 2))
        console.log("App onChange:", stringifiedData)

        return calibrationUpdate({data:value})
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



    // const empty:CalibrationForm = {
    //     instrumentId:instrumentId,
    //     frame: '',
    //     xOffset: 0,
    //     yOffset: 0,
    //     xSize: 0,
    //     ySize: 0
    // }

    // console.debug("empty: ", empty)


const formatData = (calibration:Calibration) => {
    console.log("formatData(calibration =", calibration );


    const updatedForm = forms
    
    // const sn = (instrument as Instrument).name
    

    const form : any = []
        form['forms']=updatedForm
        form['value']=calibration
        form['title']='Calibration' //+ " for " + sn
        form['subtitle']='Fill all the mandatory fields.'

        console.debug("form: ", form)

    return form;
}

const showForm = (calibration:Calibration|any) => {

        // if (isLoading) return <MySpinner />;
        // if (isError) return <ErrorComponent error={isError} />;
        // if (!calibration) return <ErrorComponent error="calibration not found" />

        // if ( ! user) return <ErrorComponent error={isError} />

        // else {
        const form = formatData(calibration)
        console.debug("showForm form: ", form)

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
            {showForm(calibration)}
        </>
    );
}

export default UpdateCalibrationForm;

