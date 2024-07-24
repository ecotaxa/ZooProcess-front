import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Input, Card, CardBody, Select, SelectItem, Button } from '@nextui-org/react';
import 'leaflet/dist/leaflet.css';

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

  const [startLatDMS, setStartLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
  const [startLngDMS, setStartLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });
  const [endLatDMS, setEndLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
  const [endLngDMS, setEndLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });

  const mapRef = useRef<L.Map | null>(null);

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
    setter(prev => {
      const updated = { ...prev, [field]: field === 'dir' ? value : parseFloat(value) || 0 };
      const decimal = convertToDecimal(updated);
      decimalSetter(decimal);
      return updated;
    });
  };

  const updateDecimalState = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number>>,
    dmsSetter: React.Dispatch<React.SetStateAction<{ deg: number; min: number; sec: number; dir: string }>>,
    isLongitude: boolean
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setter(numValue);
      const dms = convertToDMS(numValue, isLongitude);
      dmsSetter(dms);
    }
  };

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

  useEffect(() => {
    if (mapRef.current && isValidCoordinate(startLat, startLng)) {
      const bounds = endLat !== undefined && endLng !== undefined && isValidCoordinate(endLat, endLng)
        ? L.latLngBounds([[startLat, startLng], [endLat, endLng]])
        : L.latLngBounds([[startLat, startLng]]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
    onCoordsChange([startLat, startLng], endLat !== undefined && endLng !== undefined ? [endLat, endLng] : undefined);
  }, [startLat, startLng, endLat, endLng, onCoordsChange]);

  return (
    <Card>
      <CardBody>
        <MapContainer
          center={[startLat, startLng]}
          zoom={5}
          style={{ height: '400px', width: '100%' }}
          ref={mapRef}
          zoomControl={true}
        >
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
          
          {coordinateFormat === 'decimal' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
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
                value={startLatDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLatDMS, setStartLat, false)}
              >
                <SelectItem key="N" value="N">North</SelectItem>
                <SelectItem key="S" value="S">South</SelectItem>
              </Select>
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
                value={startLngDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLngDMS, setStartLng, true)}
              >
                <SelectItem key="E" value="E">East</SelectItem>
                <SelectItem key="W" value="W">West</SelectItem>
              </Select>
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
                value={endLatDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>, false)}
              >
                <SelectItem key="N" value="N">North</SelectItem>
                <SelectItem key="S" value="S">South</SelectItem>
              </Select>
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
                value={endLngDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>, true)}
              >
                <SelectItem key="E" value="E">East</SelectItem>
                <SelectItem key="W" value="W">West</SelectItem>
              </Select>
            </div>
          )}
          <Button onClick={clearEndPoint} style={{ marginTop: '20px' }}>Clear End Point</Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default MapComponent;
