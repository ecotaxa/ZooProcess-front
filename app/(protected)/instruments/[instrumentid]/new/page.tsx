// "use client";
"use server";

// import { useUserByIdWithAuth } from "@/app/api/user";
import { Debug } from "@/components/Debug";
// import { ErrorComponent } from "@/components/ErrorComponent";
// import { MySpinner } from "@/components/mySpinner";
// import { userFormElements } from "@/config/formElements";
// import { Button } from "@heroui/button";
// import { User } from "next-auth";
// import { useRouter } from "next/navigation";
import { FC, 
    // useEffect, useState
     } from "react";

import CalibrationForm from './calibrationform'
import { get } from "http";
import { getInstrument } from "@/app/api/data/instrument";
import { addCalibration } from "@/app/api/instruments";
// import { useInstrument } from "@/app/api/instruments";
// import { Instrument } from "@/app/api/network/zooprocess-api";
// const fomr = [
//     userFormElements
// ]

interface pageProps {
    params: {
        instrumentid: string
    }
}

const NewInstrumentPage: FC<pageProps> = async ({ params }) => {

    // const router = useRouter();

    const instrumentid = params.instrumentid;
    // const { instrument, isLoading, isError } = useInstrument(instrumentid)
    const instrument = await getInstrument(instrumentid);

    console.debug("instrumentid:",instrumentid)

    // const { user, isLoading, isError } = useUserByIdWithAuth(userid);
    // const [ userInfo , setUserInfo ] = useState(user);
    

    // useEffect(() => {
    //     setUserInfo(user)
    // }, [user])



    // const onChange = (value:any) => {
    //     // console.log("onChange: ", value)

    //     // setData(JSON.stringify(value, null, 2))
    //     // console.log("App onChange:", stringifiedData)

    //     // return addCalibration({instrumentId:instrumentId, data:value})
    //     try {
    //         const response = addCalibration({instrumentId:instrument.id, data:value})
    //         .then(response => {
    //             console.log("Return to the instrument page")
    //             // router.back()
    //             // router.push(`/instruments/${instrument.id}`)
    //             // params.onRefresh()
    //             return Promise.resolve(response)
    //         })
    //         .catch(error => {
    //             return Promise.reject(error)
    //         })
    //     } catch (error) {
    //         return Promise.reject(error)
    //     }
    // }
    //     //     console.log("Return to the instrument page")
    //     //     // router.back()
    //     //     // router.push(`/instruments/${instrument.id}`)
    //     //     // params.onRefresh()
    //     //     return Promise.resolve(response)
    //     // } catch (error) {
    //     //     return Promise.reject(error)
    //     // }
    // // }

    // const onCancel = () => {
    //     // router.back()
    //     // router.push({
    //     //     pathname: '/projects/[projectid]',
    //     //     query: { projectid: projectid },                                         
    //     // })
    // }




    return (
        <>
        {/* <Head>
            <title>
            New Sub Sample Metadata | ZooProcess
            </title>
        </Head> */}
        {/* <Debug params={params}/> */}

            <div className="text-center justify-center">
                    <div>
                    {/* Calibration for {(instrument as Instrument).name|| "Loading..."} */}
                    </div>
                        {/* <CalibrationForm params={params} />  */}
                        <CalibrationForm params={{instrument}}/> 
                        {/* , onCancel, onChange}} />  */}
            </div>
        </>
    );
}
export default NewInstrumentPage;

