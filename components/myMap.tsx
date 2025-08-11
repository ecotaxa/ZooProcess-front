import { useCallback, useEffect, useState } from 'react';
import { Debug } from './Debug';
import MapComponent from './MapComponent';

interface myMapProps {
  startLat: number;
  startLng: number;
  endLat?: number;
  endLng?: number;
}

export function MyMap(props: any) {
  console.log('myMap props: ', props);
  // const [value, setValue] = useState<myMapProps>(props.value);

  const [value, setValue] = useState<string | myMapProps | null>(props.value);
  const [start, setStart] = useState<[number, number] | undefined>(undefined);
  const [end, setEnd] = useState<[number, number] | undefined>(undefined);
  // console.log("MyMap useEffect[] value.startLat: ", value)
  // console.debug("typeof value:", typeof value)
  // //if ( value && typeof value === 'object' && 'startLat' in value && value.startLat !== undefined && value.startLng !== undefined) {
  // // if ( value && 'startLat' in value && value.startLat !== undefined && value.startLng !== undefined) {
  // if ( props.value ){
  //     console.debug("MyMap useEffect[] value: ", value)
  //     if ( typeof value === 'string') {
  //         const coords = JSON.parse(value)
  //         console.debug("Set the value")
  //         setStart([coords.startLat, coords.startLng])
  //         if (coords.endLat && coords.endLng){
  //             setEnd([coords.endLat, coords.endLng])
  //         }
  //     }
  // }

  const handleChange = useCallback((start: [number, number], end: [number, number] | undefined) => {
    console.log('handleChange start: ', start);

    if (start) {
      var value: myMapProps = { startLat: start[0], startLng: start[1] };
      if (end) {
        value.endLat = end[0];
        value.endLng = end[1];
      }

      // setValue(value);
      const json = JSON.stringify(value);
      setValue(json);
      if (props.onChange) {
        props.onChange(props.name, value);
      }
    }
  }, []);

  // useEffect( () => {
  //     console.debug("MyMap useEffect[")
  //     setValue(props.value)
  // },[])

  let opts = {};

  useEffect(() => {
    console.log('MyMap useEffect[] value.startLat: ', value);
    console.debug('typeof value:', typeof value);
    //if ( value && typeof value === 'object' && 'startLat' in value && value.startLat !== undefined && value.startLng !== undefined) {
    // if ( value && 'startLat' in value && value.startLat !== undefined && value.startLng !== undefined) {
    if (value) {
      console.debug('MyMap useEffect[] value: ', value);
      if (typeof value === 'string') {
        const coords = JSON.parse(value);
        console.debug('Set the value');
        setStart([coords.startLat, coords.startLng]);
        if (coords.endLat && coords.endLng) {
          setEnd([coords.endLat, coords.endLng]);
        }
      } else {
        console.error('props.value is not a string:', props.value);
        setStart([value.startLat, value.startLng]);
        if (value.endLat && value.endLng) {
          setEnd([value.endLat, value.endLng]);
        } else {
          setEnd(undefined);
        }
      }
    }
  }, [props]);

  // const start: [number,number] = [props.startLat, props.startLng]
  // const end: [number,number]|undefined = props.endLat ? [props.endLat, props.endLng] : undefined

  return (
    <>
      MAAAPPPP
      <Debug params={[{ props: props }, { opts: opts }, { value }]} title={props.name} />
      {/* <div>{start} == {end}</div> */}
      {/* start : {start && start}
        end : {end && end} */}
      <MapComponent start={start} end={end} onChange={handleChange} />
    </>
  );
}

export default MyMap;
