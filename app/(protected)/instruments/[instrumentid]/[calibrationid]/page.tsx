"use server";


// import { useUserByIdWithAuth } from "@/app/api/user";
import { Debug } from "@/components/Debug";
// import { ErrorComponent } from "@/components/ErrorComponent";
// import { MySpinner } from "@/components/mySpinner";
// import { userFormElements } from "@/config/formElements";
// import { Button } from "@nextui-org/button";
// import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

// import { useInstrument } from "@/app/api/instruments";
// import { Calibration, Instrument } from "@/app/api/network/zooprocess-api";
import UpdateCalibrationForm from "./calibrationform_update";
// import { ca, tr } from "date-fns/locale";
// import { startOptimizedAppearAnimation } from "framer-motion";
// import { setErrorMap } from "zod";
import { ICalibration, Instrument } from "@/app/api/network/interfaces";
import { getCalibration, getInstrument } from "@/app/api/data/instrument";
// const fomr = [
//     userFormElements
// ]

interface pageProps {
    params: {
        instrumentid: string
        calibrationid: string
        // instrument: Instrument,
        // calibration: Calibration,
    }
}

const UpdateCalibrationPage: FC<pageProps> = async ({ params }) => {
    // const router = useRouter();

    // const { instrument, calibration } = params

    // const instrumentid = params.instrumentid;
    // const { instrument, isLoading, isError } = useInstrument(instrumentid)
    const instrument = await getInstrument(params.instrumentid);
    const calibration = await getCalibration(instrument, params.calibrationid);

    // const calibrationid = params.calibrationid;
    // const [calibration, setCalibration] = useState<Calibration|undefined>(undefined);

    // const [error, setError] = useState<any>(undefined);

    // const [param, setParam] = useState<any>({});

    // const [refreshTrigger, setRefreshTrigger] = useState(0);


    // const triggerRefresh = () => {
    //     console.debug("refreshTrigger",refreshTrigger)
    //     setRefreshTrigger(prev => prev + 1);
    // };
    // useEffect(() => {
    //     if (refreshTrigger > 0) {
    //       // Refetch the instrument data or perform any other refresh logic
    //       console.debug("Refreshing data...");
    //       router.refresh(); // Assuming you're using a query library that provides a refetch function
    //     }
    //   }, [refreshTrigger]);



    // console.debug("instrumentid:", instrument.id)

    // useEffect(() => {
    //     console.debug("instrument: ", instrument)
    //     console.debug("instrument.ZooscanCalibration: ", (instrument as Instrument)?.ZooscanCalibration)
    //     console.debug("calibrationid: ", calibrationid)
    //     const cal = (instrument as Instrument)?.ZooscanCalibration?.find((calibration) => {
    //         console.debug("calibration.id: test ", calibration.id , "?" , calibrationid)
    //         console.debug("typeof calibration.id: ", typeof calibration.id)
    //         console.debug("typeof calibrationid: ", typeof calibrationid)
    //         console.debug("calibration.id == calibrationid: ", calibration.id == calibrationid)
    //         console.debug("calibration.id === calibrationid: ", calibration.id === calibrationid)
    //         return calibration.id == calibrationid
    //     });
    //     console.debug("cal: ", cal)
    //     if (cal !== undefined) {
    //         setCalibration(cal);    

    //         const p = {
    //             instrumentid: instrumentid,
    //             calibration: calibration as Calibration,
    //         }

    //         setParam(p)

    //     } else {
    //         console.debug("calibration not found")
    //         console.debug("calibration: ", calibration)
    //         console.debug("instrument: ", instrument)
    //         // console.debug("instrument.ZooscanCalibration: ", instrument?.ZooscanCalibration)
    //         setError(true)
    //     }
    // }, [instrument])


//     const showForm = (instrument:Instrument| never[],isLoading:boolean,isError:boolean) =>  {
//         console.debug("showForm")
//         if (isLoading) {
//             return <MySpinner />
//         }
//         if (isError) {
//             return <ErrorComponent error={{ message: "Instrument not found" }} />
//         }
//         // if (error) {
//         //     return <ErrorComponent error={{ message
        
//         console.debug("instrument: ", instrument)
//         console.debug("instrument.ZooscanCalibration: ", (instrument as Instrument)?.ZooscanCalibration)
//         console.debug("calibrationid: ", calibrationid)
//         const cal = (instrument as Instrument)?.ZooscanCalibration?.find((calibration) => {
//             console.debug("calibration.id: test ", calibration.id , "?" , calibrationid)
//             console.debug("typeof calibration.id: ", typeof calibration.id)
//             console.debug("typeof calibrationid: ", typeof calibrationid)
//             console.debug("calibration.id == calibrationid: ", calibration.id == calibrationid)
//             console.debug("calibration.id === calibrationid: ", calibration.id === calibrationid)
//             return calibration.id == calibrationid
//         });
//         console.debug("cal: ", cal)
//         if (cal !== undefined) {
//             setCalibration(cal);    

//             const param = {
//                 instrumentid: instrumentid,
//                 calibration: calibration as Calibration,
//             }



//         return (
//             <UpdateCalibrationForm params={param} />
//         )
//     }
// }

    const updatedParams = {
        // ...params,
        calibration,
        instrument,
        // onRefresh: triggerRefresh
    }

    return (
        <>
        <Debug params={params}/>
            {/* { isLoading && <MySpinner /> }
            { isError && <ErrorComponent error={{ message: "Instrument not found" }} /> }
            { error && <ErrorComponent error={{ message: "Calibration not found" }} /> }
            <div className="text-center justify-center">
                <div>{JSON.stringify(calibration)}</div>
                    <div>
                    </div>
                        {calibration && <UpdateCalibrationForm  params={param} />}

            </div> */}

            {/* { showForm(instrument,isLoading,isError) } */}

            <UpdateCalibrationForm  params={updatedParams} />
        </>
    );

}

export default UpdateCalibrationPage;

