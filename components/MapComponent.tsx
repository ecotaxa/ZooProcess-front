import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Input, Card, CardBody, Select, SelectItem, Button, Switch } from '@nextui-org/react';
import 'leaflet/dist/leaflet.css';

// polar projection
// npm install proj4 proj4leaflet
// npm i --save-dev @types/proj4leaflet
import 'proj4leaflet';
import { Debug } from './Debug';


interface MapComponentProps {
    initialStartCoords: [number, number];
    initialEndCoords?: [number, number];
    onCoordsChange: (startCoords: [number, number], endCoords?: [number, number]) => void;
  }
const MapComponent: React.FC<MapComponentProps> = ({ initialStartCoords, initialEndCoords, onCoordsChange }) => {
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

  const mapRef = useRef<L.Map | null>(null);
//   const [mapCenter, setMapCenter] = useState<[number, number]>([startLat, startLng]);
//   const [mapZoom, setMapZoom] = useState(5);
const hasScaled = useRef(false);

  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const BlueMarker = () => (
    <div style={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%', marginRight: '10px' }} />
  );
  
  const YellowMarker = () => (
    <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow', borderRadius: '50%', marginRight: '10px' }} />
  );


  const isValidCoordinate = (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
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
// const updateDecimalState = (
//     value: string,
//     setter: React.Dispatch<React.SetStateAction<number>>,
//     dmsSetter: React.Dispatch<React.SetStateAction<{ deg: number; min: number; sec: number; dir: string }>>,
//     isLongitude: boolean
//   ) => {
//     if (value === '' || value === '-' || value === '.' || value === '-.') {
//       setter(0);
//       return;
//     }
//     const numValue = parseFloat(value);
//     if (!isNaN(numValue)) {
//       setter(numValue);
//       const dms = convertToDMS(numValue, isLongitude);
//       dmsSetter(dms);
//     }
//   };
    //     if (value === '' || value === '-' || value === '.' || value === '-.' || !isNaN(parseFloat(value))) {
//       setter(parseFloat(value) || 0);
//       if (!isNaN(parseFloat(value))) {
//         const dms = convertToDMS(parseFloat(value), isLongitude);
//         dmsSetter(dms);
//       }
//     }
//   };

  const clearEndPoint = () => {
    setEndLat(undefined);
    setEndLng(undefined);
    setEndLatDMS({ deg: 0, min: 0, sec: 0, dir: 'N' });
    setEndLngDMS({ deg: 0, min: 0, sec: 0, dir: 'E' });
  };

  useEffect(() => {
    setStartLatDMS(convertToDMS(startLat, false));
    setStartLngDMS(convertToDMS(startLng, true));
    if (endLat !== undefined && endLng !== undefined) {
      setEndLatDMS(convertToDMS(endLat, false));
      setEndLngDMS(convertToDMS(endLng, true));
    }
  }, [startLat, startLng, endLat, endLng]);

//   useEffect(() => {
//     if (mapRef.current && isValidCoordinate(startLat, startLng)) {
//       const bounds = endLat !== undefined && endLng !== undefined && isValidCoordinate(endLat, endLng)
//         ? L.latLngBounds([[startLat, startLng], [endLat, endLng]])
//         : L.latLngBounds([[startLat, startLng]]);
      
//       const newCenter = bounds.getCenter();
//       const currentCenter = mapRef.current.getCenter();
      
//       if (newCenter.distanceTo(currentCenter) > 1000) {
//         mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
//         setMapCenter([newCenter.lat, newCenter.lng]);
//         setMapZoom(mapRef.current.getZoom());
//       }
//     }
//     onCoordsChange([startLat, startLng], endLat !== undefined && endLng !== undefined ? [endLat, endLng] : undefined);
//   }, [startLat, startLng, endLat, endLng, onCoordsChange]);
  
useEffect(() => {
    if (mapRef.current && isValidCoordinate(startLat, startLng) && !hasScaled.current) {
      const bounds = endLat !== undefined && endLng !== undefined && isValidCoordinate(endLat, endLng)
        ? L.latLngBounds([[startLat, startLng], [endLat, endLng]])
        : L.latLngBounds([[startLat, startLng]]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      hasScaled.current = true;
    }
    onCoordsChange([startLat, startLng], endLat !== undefined && endLng !== undefined ? [endLat, endLng] : undefined);
  }, [startLat, startLng, endLat, endLng, onCoordsChange]);

  useEffect(() => {
    setIsPolar(Math.abs(startLat) > 75 || (endLat !== undefined && Math.abs(endLat) > 75));
  }, [startLat, endLat]);

  const proj4 = require('proj4');

//   const polarCRS = L.CRS.EPSG3413; unknow
//   const polarCRS = L.CRS.EPSG3395; // World Mercator
//   const polarCRS = L.CRS.EPSG3857; satellite
//    const polarCRS = L.CRS.EPSG4326; satellite
//    const polarCRS = L.CRS.ESPG900913; 
// const polarCRS = L.CRS.Earth

const polarCRS = new L.Proj.CRS(
    'EPSG:3413',
    '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
    {
      resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1], // Adjust resolutions as needed
      origin: [-4194304, 4194304], // Top left corner of the projection
      bounds: L.bounds([-4194304, -4194304], [4194304, 4194304]), // Projection bounds
    }
  );

  return (
    <Card>
      <CardBody>
        <Debug params={isPolar} title='isPolar' />
        <MapContainer
          center={[startLat, startLng]}
          zoom={5}
          style={{ height: '400px', width: '100%' }}
          ref={mapRef}
          zoomControl={true}
          crs={isPolar ? polarCRS : L.CRS.EPSG3857}
        >
         
         {/* ... map layers and markers */}
  
          {/* <TileLayer
            url={isPolar ? 'https://map1.vis.earthdata.nasa.gov/wmts-arctic/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE=&TILEMATRIXSET=EPSG3413_250m&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            attribution={isPolar ? '&copy; NASA' : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
          /> */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
          {isValidCoordinate(startLat, startLng) && (
            <Marker position={[startLat, startLng]} icon={blueIcon}>
              <Popup>Start Position</Popup>
            </Marker>
          )}
          {isValidCoordinate(endLat ?? 0, endLng ?? 0) && endLat !== undefined && endLng !== undefined && (
            <Marker position={[endLat, endLng]} icon={yellowIcon}>
              <Popup>End Position</Popup>
            </Marker>
          )}
          {isValidCoordinate(startLat, startLng) && isValidCoordinate(endLat ?? 0, endLng ?? 0) && endLat !== undefined && endLng !== undefined && (
            <Polyline positions={[[startLat, startLng], [endLat, endLng]]} color="red" />
          )}
          {/* <MapEvents /> */}
        </MapContainer>
        <div style={{ marginTop: '20px' }}>
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
          
          <Switch
            checked={isPolar}
            onChange={(e) => setIsPolar(e.target.checked)}
            style={{ marginBottom: '20px' }}
          >
            Polar Projection
          </Switch>
          
          {coordinateFormat === 'decimal' ? (
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
          ) : (
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

            )}
            <Button onClick={clearEndPoint} style={{ marginTop: '20px' }}>Clear End Point</Button>
          </div>
        </CardBody>
      </Card>
    );
  };
  
  export default MapComponent;
  