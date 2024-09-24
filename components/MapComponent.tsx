import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Input, Card, CardBody, Select, SelectItem, Button, Switch, CardFooter } from '@nextui-org/react';
import 'leaflet/dist/leaflet.css';

// polar projection
// npm install proj4 proj4leaflet
// npm i --save-dev @types/proj4leaflet

import 'proj4';
import 'proj4leaflet';
import { Debug } from './Debug';
import AntarcticMap from './AntarcticMap';
import Planisfer from './Planisfer';
import ArcticMap from './ArcticMap';


interface MapComponentProps {
    start?: [number, number];
    end?: [number, number];
    onChange: (startCoords: [number, number], endCoords?: [number, number]) => void;
  }
const MapComponent: React.FC<MapComponentProps> = ({ start, end, onChange: onCoordsChange }) => {

    console.log("MapComponent start: ", start)
    console.log("MapComponent end: ", end)

    const [startLat, setStartLat] = useState<number | undefined>(start?.[0]);
    const [startLng, setStartLng] = useState<number | undefined>(start?.[1]);
    const [endLat, setEndLat] = useState<number | undefined>(end?.[0]);
    const [endLng, setEndLng] = useState<number | undefined>(end?.[1]);
    const [coordinateFormat, setCoordinateFormat] = useState<'decimal' | 'dms'>('decimal');
    const [isPolar, setIsPolar] = useState<boolean>(false);
    const [startLatDMS, setStartLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
    const [startLngDMS, setStartLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });
    const [endLatDMS, setEndLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
    const [endLngDMS, setEndLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });
    const hasScaled = useRef(false);

    console.log("startLat:",startLat)
    console.log("startLng:",startLng)

    const isValidCoordinate = (lat: number, lng: number): boolean => {
      return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    };

    useEffect( () => {
      console.debug("useEffect[]")
      if (start) {
        console.debug("<= setStartLat setStartLng")
        setStartLat(start[0]);
        setStartLng(start[1]);
        if (end) {
          console.debug("<= setEndLat setEndLng")
          setEndLat(end[0]);
          setEndLng(end[1]);
        }
      } else {
        console.debug("start is NULL")
      }
    },[start, end]);
    
    useEffect(() => {
     console.log ("useEffect startLat, endLat")
     if (startLat == undefined || startLng == undefined) setIsPolar(false)
      const shouldBePolar = startLat!== undefined && (Math.abs(startLat) > 75 || Math.abs(startLat) < -75) || (endLat !== undefined && (Math.abs(endLat) > 75 || Math.abs(endLat) < -75));
          setIsPolar(shouldBePolar);
      }, [startLat, endLat]);


    useEffect(() => {
      console.log("useEffect [startLat, startLng, endLat, endLng])")

      if (startLat !== undefined && startLng !== undefined) {
        setStartLatDMS(convertToDMS(startLat, false));
        setStartLngDMS(convertToDMS(startLng, true));
      }
        if (endLat !== undefined && endLng !== undefined) {
          setEndLatDMS(convertToDMS(endLat, false));
          setEndLngDMS(convertToDMS(endLng, true));
        }
      }, [startLat, startLng, endLat, endLng]);
          
      useEffect(() => {
        console.log("useEffect onCoordsChange")
        // if (mapRef.current && isValidCoordinate(startLat, startLng) && !hasScaled.current) {
        //   const bounds = endLat !== undefined && endLng !== undefined && isValidCoordinate(endLat, endLng)
        //     ? L.latLngBounds([[startLat, startLng], [endLat, endLng]])
        //     : L.latLngBounds([[startLat, startLng]]);
        //   mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        //   hasScaled.current = true;
        // }
        if (startLat !== undefined && startLng !== undefined){
          onCoordsChange([startLat, startLng], endLat !== undefined && endLng !== undefined ? [endLat, endLng] : undefined);
        }
      }, [startLat, startLng, endLat, endLng, onCoordsChange]);


    const BlueMarker = () => (
        <div style={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%', marginRight: '10px' }} />
      );
      
      const YellowMarker = () => (
        <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow', borderRadius: '50%', marginRight: '10px' }} />
      );
    
      const clearEndPoint = () => {
        setEndLat(undefined);
        setEndLng(undefined);
        setEndLatDMS({ deg: 0, min: 0, sec: 0, dir: 'N' });
        setEndLngDMS({ deg: 0, min: 0, sec: 0, dir: 'E' });
      };
      
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
                    value={startLat ? startLat.toString() : ''}
                    onChange={(e) => e.target.value && updateDecimalState(e.target.value, setStartLat as React.Dispatch<React.SetStateAction<number>>, setStartLatDMS, false)}
                  />
                  <Input
                    label="Start Longitude"
                    value={startLat ? startLng?.toString() : ''}
                    onChange={(e) => { e.target.value && updateDecimalState(e.target.value, setStartLng as React.Dispatch<React.SetStateAction<number>>, setStartLngDMS, true)}}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow', borderRadius: '50%', marginRight: '10px' }} /> */}
                    <YellowMarker />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                  <Input
                    label="End Latitude"  type='text'
                    value={endLat !== undefined ? endLat.toString() : ''}
                    onChange={(e) => updateDecimalState(e.target.value, setEndLat as React.Dispatch<React.SetStateAction<number>>, setEndLatDMS, false)}
                  />
                  <Input
                    label="End Longitude" type='text'
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
              <BlueMarker />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', width: '100%' }}>
              <Input
                  label="Start Lat Degrees"
                  value={startLatDMS.deg.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'deg', setStartLatDMS, setStartLat as React.Dispatch<React.SetStateAction<number>>, false)}
                />
                <Input
                  label="Minutes"
                  value={startLatDMS.min.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'min', setStartLatDMS, setStartLat as React.Dispatch<React.SetStateAction<number>>, false)}
                />
                <Input
                  label="Seconds"
                  value={startLatDMS.sec.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'sec', setStartLatDMS, setStartLat as React.Dispatch<React.SetStateAction<number>>, false)}
                />
                <Select
                    label="Hemispher"
                  selectedKeys={[startLatDMS.dir]}
                  onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLatDMS, setStartLat as React.Dispatch<React.SetStateAction<number>>, false)}
                >
                  <SelectItem key="N" value="N">North</SelectItem>
                  <SelectItem key="S" value="S">South</SelectItem>
                </Select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', width: '100%' }}>
                <Input
                  label="Start Lng Degrees"
                  value={startLngDMS.deg.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'deg', setStartLngDMS, setStartLng as React.Dispatch<React.SetStateAction<number>>, true)}
                />
                <Input
                  label="Minutes"
                  value={startLngDMS.min.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'min', setStartLngDMS, setStartLng as React.Dispatch<React.SetStateAction<number>>, true)}
                />
                <Input
                  label="Seconds"
                  value={startLngDMS.sec.toString()}
                  onChange={(e) => updateDMSState(e.target.value, 'sec', setStartLngDMS, setStartLng as React.Dispatch<React.SetStateAction<number>>, true)}
                  />
                  <Select
                  label="Position"
                  selectedKeys={[startLngDMS.dir]}
                    onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLngDMS, setStartLng as React.Dispatch<React.SetStateAction<number>>, true)}
                  >
                    <SelectItem key="E" value="E">East</SelectItem>
                    <SelectItem key="W" value="W">West</SelectItem>
                  </Select>
                  </div>
                  </div>
      
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <YellowMarker />
                
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
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
                    label="Hemispher"
                    selectedKeys={[endLatDMS.dir]}
                    onChange={(e) => updateDMSState(e.target.value, 'dir', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>, false)}
                  >
                    <SelectItem key="N" value="N">North</SelectItem>
                    <SelectItem key="S" value="S">South</SelectItem>
                  </Select>
                  </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
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
                  label="Position"
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
        )
    }

    const showArtic = (startLat: number, startLng: number, endLat?: number, endLng?: number) => {
        if (startLat > 75 || (endLat!= undefined && endLat > 75) ) {
            return (
                <>
                <h1>Carte de l'Arctique</h1>
                <ArcticMap start={[startLat,startLng]} end={[endLat,endLng]} />
              </>
            )
        } else {
            if (startLat < -75 || (endLat!= undefined && endLat < -75) )
          return  (
            <>
                <h1>Carte de l'Antarctique</h1>
                <AntarcticMap start={[startLat,startLng]} end={[endLat,endLng]} />
            </>
          )
          else 
           return 
            <Planisfer start={[startLat,startLng]} end={[endLat,endLng]} />
        }

    }

	return (
        <div className="w-screen max-w-none overflow-x-hidden px-6" >
         {/* <div> */}
        <Card className="w-full">
      <CardBody >
        {/* <div>
          COORDS 
          {startLat}, {startLng}, {endLat}, {endLng}
        </div> */}
        {/* <Timeline_scan current={0.5} />

        <Timeline_scan current={1} />
        <Timeline_scan current={1.5} /> */}
        
            {/* <MapComponent         
            initialStartCoords={startCoords}
            initialEndCoords={endCoords}
        onCoordsChange={handleCoordsChange}
            /> */}

        { isPolar == true && startLat && startLng ? 
            (
              showArtic(startLat, startLng, endLat, endLng)
            )
            :
            (
                <Planisfer start={[startLat,startLng]} end={[endLat,endLng]} />
            )
        }

		</CardBody>

        <CardFooter>

        <div style={{ marginTop: '20px' }}>

        {/* <Switch
            checked={isPolar}
            onChange={(e) => {
                setIsPolar(e.target.checked);
            }}
            style={{ marginBottom: '20px' }}
          >
            Polar Projection
          </Switch> */}

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
            <Button onClick={clearEndPoint} style={{ marginTop: '20px' }}>Clear End Point</Button>

            </div>
            
        </CardFooter>
        </Card>
        </div>
	);
  };
  
  export default MapComponent;
  