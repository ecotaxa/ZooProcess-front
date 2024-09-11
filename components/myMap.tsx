import { useCallback, useEffect, useState } from "react";
import { Debug } from "./Debug";
import MapComponent from "./MapComponent";



interface myMapProps {
    startLat: number
    startLng:number,
    endLat?: number,
    endLng?: number
}


export function MyMap(props:any) {

    console.log("myMap props: ", props)
    const [value, setValue] = useState<myMapProps>(props.value);
    const [start, setStart] = useState<[number,number]|undefined>(undefined);
    const [end, setEnd] = useState<[number,number]|undefined>(undefined);

    const handleChange = useCallback( (start:[number,number], end:[number,number]|undefined) => {
        
        console.log("handleChange start: ", start)

        if (start) {
            var value : myMapProps = { startLat:start[0], startLng:start[1] }
            if (end){
                value.endLat = end[0]
                value.endLng = end[1]
            }
            
            setValue(value);
            if (props.onChange){
                props.onChange(props.name, value)
            }
        }
    }, [])


     let opts = {}

     useEffect(() => {
        console.log("useEffect value.startLat: ", value)
        if ( value && 'startLat' in value && value.startLat !== undefined && value.startLng !== undefined) {
            setStart([value.startLat, value.startLng])
            if (value.endLat && value.endLng){
                setEnd([value.endLat, value.endLng])
            }
        }
    
    },[])


   // const start: [number,number] = [props.startLat, props.startLng]
   // const end: [number,number]|undefined = props.endLat ? [props.endLat, props.endLng] : undefined

    return (
        <>
        MAAAPPPP
        <Debug params={[{props:props},{opts:opts},{value}]} title={props.name}/>
        {/* start : {start} */}
        {/* end : {end && end} */}
        <MapComponent start={start} end={end} onChange={handleChange} />
        </>
    )

}

export default MyMap;