"use client"


import { title } from "@/components/primitives";
import { Timeline_scan } from "@/components/timeline-scan";
import { Card, CardBody, CardFooter, Input, Link, Select, SelectItem, Spinner, Switch } from "@nextui-org/react";

import ArcticMap from '@/components/ArcticMap';
import MapComponent from "@/components/MapComponent";
import Planisfer from "@/components/Planisfer";
import { useEffect, useRef, useState } from "react";


const startCoords :[number,number] = [43.3, 7.4]    
const endCoords :[number,number] = [41.4, 7.4]

function handleCoordsChange(start: [number,number], end :[number,number]|void){
    console.log("handleCoordsChange", start, end)
}

type Coord =  [number,number]

export default function AboutPage() {

    const initialStartCoords :Coord = [43.3, 7.1]
    const initialEndCoords :Coord = [41.3, 8.1]

    const [startLat, setStartLat] = useState<number>(initialStartCoords[0]);
    const [startLng, setStartLng] = useState<number>(initialStartCoords[1]);
    const [endLat, setEndLat] = useState<number | undefined>(initialEndCoords?.[0]);
    const [endLng, setEndLng] = useState<number | undefined>(initialEndCoords?.[1]);
    const [coordinateFormat, setCoordinateFormat] = useState<'decimal' | 'dms'>('decimal');
    const [isPolar, setIsPolar] = useState<boolean>(false);
    const [startLatDMS, setStartLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
    const [startLngDMS, setStartLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });
    const [endLatDMS, setEndLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
    const [endLngDMS, setEndLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });
    const hasScaled = useRef(false);


    useEffect(() => {
          const shouldBePolar = Math.abs(startLat) > 75 || (endLat !== undefined && Math.abs(endLat) > 75);
          setIsPolar(shouldBePolar);
      }, [startLat, endLat]);

      



    const BlueMarker = () => (
        <div style={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%', marginRight: '10px' }} />
      );
      
      const YellowMarker = () => (
        <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow', borderRadius: '50%', marginRight: '10px' }} />
      );
    
      const convertToDMS = (decimal: number, isLongitude: boolean): { deg: number; min: number; sec: number; dir: string } => {
        const absolute = Math.abs(decimal);
        const deg = Math.floor(absolute);
        const min = Math.floor((absolute - deg) * 60);
        const sec = parseFloat(((absolute - deg - min / 60) * 3600).toFixed(2));
        const dir = isLongitude ? (decimal >= 0 ? 'E' : 'W') : (decimal >= 0 ? 'N' : 'S');
        return { deg, min, sec, dir };
      };
    
      const convertToDecimal = (dms: { deg: number; min: number; sec: number; dir: string }): number => {
        let decimal = dms.deg + dms.min / 60 + dms.sec / 3600;
        if (dms.dir === 'S' || dms.dir === 'W') {
          decimal = -decimal;
        }
        return parseFloat(decimal.toFixed(6));
      };
    
      const updateDMSState = (
        value: string,
        field: 'deg' | 'min' | 'sec' | 'dir',
        setter: React.Dispatch<React.SetStateAction<{ deg: number; min: number; sec: number; dir: string }>>,
        decimalSetter: React.Dispatch<React.SetStateAction<number>>,
        isLongitude: boolean
      ) => {
        console.debug("updateDMSState")
        setter(prev => {
          const updated = { ...prev, [field]: field === 'dir' ? value : parseFloat(value) || 0 };
          const decimal = convertToDecimal(updated);
          decimalSetter(decimal);
          return updated;
        });
        console.debug("hasScaled.current = false")
        hasScaled.current = false;
      };
      
      const updateDecimalState = (
        value: string,
        setter: React.Dispatch<React.SetStateAction<number>>,
        dmsSetter: React.Dispatch<React.SetStateAction<{ deg: number; min: number; sec: number; dir: string }>>,
        isLongitude: boolean
      ) => {
        console.debug("updateDMSState")
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          setter(numValue);
          const dms = convertToDMS(numValue, isLongitude);
          dmsSetter(dms);
        }
        console.debug("hasScaled.current = false")
        hasScaled.current = false;
      };
      
    const DecimalFormatButton = () => {

        return (

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <div style={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%', marginRight: '10px' }} /> */}
                <BlueMarker />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                  <Input
                    label="Start Latitude"
                    value={startLat.toString()}
                    onChange={(e) => updateDecimalState(e.target.value, setStartLat, setStartLatDMS, false)}
                  />
                  <Input
                    label="Start Longitude"
                    value={startLng.toString()}
                    onChange={(e) => updateDecimalState(e.target.value, setStartLng, setStartLngDMS, true)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow', borderRadius: '50%', marginRight: '10px' }} /> */}
                    <YellowMarker />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                  <Input
                    label="End Latitude"
                    value={endLat !== undefined ? endLat.toString() : ''}
                    onChange={(e) => updateDecimalState(e.target.value, setEndLat as React.Dispatch<React.SetStateAction<number>>, setEndLatDMS, false)}
                  />
                  <Input
                    label="End Longitude"
                    value={endLng !== undefined ? endLng.toString() : ''}
                    onChange={(e) => updateDecimalState(e.target.value, setEndLng as React.Dispatch<React.SetStateAction<number>>, setEndLngDMS, true)}
                  />
                </div>
              </div>
            </div>
        )
    }

    const DMSButton = () => {

        return (

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>

              {/* <div style={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%', marginRight: '10px' }} /> */}
              <BlueMarker />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', width: '100%' }}>
          {/* Start Latitude DMS inputs */}
              <Input
                  label="Start Lat Degrees"
                  value={startLatDMS.deg.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'deg', setStartLatDMS, setStartLat, false)}
                />
                <Input
                  label="Minutes"
                  value={startLatDMS.min.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'min', setStartLatDMS, setStartLat, false)}
                />
                <Input
                  label="Seconds"
                  value={startLatDMS.sec.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'sec', setStartLatDMS, setStartLat, false)}
                />
                <Select
                  selectedKeys={[startLatDMS.dir]}
                  onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLatDMS, setStartLat, false)}
                >
                  <SelectItem key="N" value="N">North</SelectItem>
                  <SelectItem key="S" value="S">South</SelectItem>
                </Select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* <div style={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%', marginRight: '10px' }} /> */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', width: '100%' }}>
          {/* Start Longitude DMS inputs */}
                <Input
                  label="Start Lng Degrees"
                  value={startLngDMS.deg.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'deg', setStartLngDMS, setStartLng, true)}
                />
                <Input
                  label="Minutes"
                  value={startLngDMS.min.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'min', setStartLngDMS, setStartLng, true)}
                />
                <Input
                  label="Seconds"
                  value={startLngDMS.sec.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'sec', setStartLngDMS, setStartLng, true)}
                  />
                  <Select
                    selectedKeys={[startLngDMS.dir]}
                    onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLngDMS, setStartLng, true)}
                  >
                    <SelectItem key="E" value="E">East</SelectItem>
                    <SelectItem key="W" value="W">West</SelectItem>
                  </Select>
                  </div>
                  </div>
                  {/* </div> */}
      
      
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <YellowMarker />
                
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
            {/* End Latitude DMS inputs */}
                  <Input
                    label="End Lat Degrees"
                    value={endLatDMS.deg.toString()}
                    onChange={(e) => updateDMSState(e.target.value, 'deg', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>, false)}
                  />
                  <Input
                    label="Minutes"
                    value={endLatDMS.min.toString()}
                    onChange={(e) => updateDMSState(e.target.value, 'min', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>, false)}
                  />
                  <Input
                    label="Seconds"
                    value={endLatDMS.sec.toString()}
                    onChange={(e) => updateDMSState(e.target.value, 'sec', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>, false)}
                  />
                  <Select
                    selectedKeys={[endLatDMS.dir]}
                    onChange={(e) => updateDMSState(e.target.value, 'dir', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>, false)}
                  >
                    <SelectItem key="N" value="N">North</SelectItem>
                    <SelectItem key="S" value="S">South</SelectItem>
                  </Select>
                  </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
      
                  {/* End Longitude DMS inputs */}
                  <Input
                    label="End Lng Degrees"
                    value={endLngDMS.deg.toString()}
                    onChange={(e) => updateDMSState(e.target.value, 'deg', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>, true)}
                  />
                  <Input
                    label="Minutes"
                    value={endLngDMS.min.toString()}
                    onChange={(e) => updateDMSState(e.target.value, 'min', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>, true)}
                  />
                  <Input
                    label="Seconds"
                    value={endLngDMS.sec.toString()}
                    onChange={(e) => updateDMSState(e.target.value, 'sec', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>, true)}
/>
                  <Select
                    selectedKeys={[endLngDMS.dir]}
                    onChange={(e) => updateDMSState(e.target.value, 'dir', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>, true)}
                  >
                    <SelectItem key="E" value="E">East</SelectItem>
                    <SelectItem key="W" value="W">West</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          // </div>
          
        )
    }

	return (
        <div>
        <Card>
      <CardBody>

        {/* <Timeline_scan current={0.5} />

        <Timeline_scan current={1} />
        <Timeline_scan current={1.5} /> */}
        
            {/* <MapComponent         
            initialStartCoords={startCoords}
            initialEndCoords={endCoords}
        onCoordsChange={handleCoordsChange}
            /> */}

        { isPolar === true ? 
            (
                <>
                <h1>Carte de l'Arctique</h1>
                <ArcticMap />
                </>
            )
            :
            (
                <Planisfer/>
            )
        }

		</CardBody>

        <CardFooter>

        <div style={{ marginTop: '20px' }}>

        <Switch
            checked={isPolar}
            onChange={(e) => {
                setIsPolar(e.target.checked);
            }}
            style={{ marginBottom: '20px' }}
          >
            Polar Projection
          </Switch>

        <Select
            label="Coordinate Format"
            value={coordinateFormat}
            onChange={(e) => setCoordinateFormat(e.target.value as 'decimal' | 'dms')}
            defaultSelectedKeys={["decimal"]}
            style={{ width: '300px', marginBottom: '20px' }}
          >
            <SelectItem key="decimal" value="decimal">Decimal Degrees</SelectItem>
            <SelectItem key="dms" value="dms">Degrees, Minutes, Seconds</SelectItem>
          </Select>

            {
                coordinateFormat === 'decimal' ? 
                    DecimalFormatButton() 
                    : DMSButton()

            }
            </div>
            
        </CardFooter>
        </Card>
        </div>
	);
}


// 	<h1 className={title()}>About</h1>
		// 	<Spinner/>
		// 	<div className="flex flex-col gap-4">
        //     <Link href={"/blog/123"} className="bg-green-400 w-fit rounded-lg p-4">
        //         Single param
        //     </Link>
        //     <Link href={"blog/a/b"} className="bg-blue-400 w-fit rounded-lg p-4">
        //         Multiple Params
        //     </Link>
        //     <Link href={"blog"} className="bg-amber-400 w-fit rounded-lg p-4">
        //         Optional
        //     </Link>
        //  </div>