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

  // New state variables for DMS inputs
  const [startLatDMS, setStartLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
  const [startLngDMS, setStartLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });
  const [endLatDMS, setEndLatDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'N' });
  const [endLngDMS, setEndLngDMS] = useState({ deg: 0, min: 0, sec: 0, dir: 'E' });

  const mapRef = useRef<L.Map | null>(null);
  const hasScaled = useRef(false);

  const positionIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    iconSize: [25, 41],
  });

  const isValidCoordinate = (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  const convertToDMS = (decimal: number): { deg: number; min: number; sec: number } => {
    const deg = Math.floor(Math.abs(decimal));
    const min = Math.floor((Math.abs(decimal) - deg) * 60);
    const sec = ((Math.abs(decimal) - deg - min / 60) * 3600).toFixed(2);
    return { deg, min, sec: parseFloat(sec) };
  };

  const convertToDecimal = (dms: { deg: number; min: number; sec: number; dir: string }): number => {
    let decimal = dms.deg + dms.min / 60 + dms.sec / 3600;
    if (dms.dir === 'S' || dms.dir === 'W') {
      decimal = -decimal;
    }
    return decimal;
  };

  const updateDMSState = (
    value: string,
    field: 'deg' | 'min' | 'sec' | 'dir',
    setter: React.Dispatch<React.SetStateAction<{ deg: number; min: number; sec: number; dir: string }>>,
    decimalSetter: React.Dispatch<React.SetStateAction<number>>
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
    dmsSetter: React.Dispatch<React.SetStateAction<{ deg: number; min: number; sec: number; dir: string }>>
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setter(numValue);
      const dms = convertToDMS(numValue);
      dmsSetter(prev => ({ ...dms, dir: numValue >= 0 ? prev.dir : (prev.dir === 'N' ? 'S' : 'W') }));
    }
  };

  const clearEndPoint = () => {
    setEndLat(undefined);
    setEndLng(undefined);
    setEndLatDMS({ deg: 0, min: 0, sec: 0, dir: 'N' });
    setEndLngDMS({ deg: 0, min: 0, sec: 0, dir: 'E' });
    hasScaled.current = false;
  };

  useEffect(() => {
    if (mapRef.current && isValidCoordinate(startLat, startLng) && !hasScaled.current) {
      const bounds = endLat !== undefined && endLng !== undefined
        ? L.latLngBounds([[startLat, startLng], [endLat, endLng]])
        : L.latLngBounds([[startLat, startLng]]);
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
      hasScaled.current = true;
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
            <Marker position={[startLat, startLng]} icon={positionIcon}>
              <Popup>Start Position</Popup>
            </Marker>
          )}
          {isValidCoordinate(endLat ?? 0, endLng ?? 0) && endLat !== undefined && endLng !== undefined && (
            <Marker position={[endLat, endLng]} icon={positionIcon}>
              <Popup>End Position</Popup>
            </Marker>
          )}
          {isValidCoordinate(startLat, startLng) && isValidCoordinate(endLat ?? 0, endLng ?? 0) && endLat !== undefined && endLng !== undefined && (
            <Polyline positions={[[startLat, startLng], [endLat, endLng]]} color="red" />
          )}
        </MapContainer>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr',
          gridTemplateRows: 'auto auto auto',
          gap: '10px',
          alignItems: 'flex-end'
        }}>
          <Select
            label="Coordinate Format"
            value={coordinateFormat}
            onChange={(e) => setCoordinateFormat(e.target.value as 'decimal' | 'dms')}
            defaultSelectedKeys={["decimal"]}
            style={{ width: '300px', gridColumn: '1 / -1' }}
          >
            <SelectItem key="decimal" value="decimal">Decimal Degrees</SelectItem>
            <SelectItem key="dms" value="dms">Degrees, Minutes, Seconds</SelectItem>
          </Select>
          
          {coordinateFormat === 'decimal' ? (
            <>
              <Input
                label="Start Latitude"
                value={startLat.toString()}
                onChange={(e) => updateDecimalState(e.target.value, setStartLat, setStartLatDMS)}
              />
              <Input
                label="Start Longitude"
                value={startLng.toString()}
                onChange={(e) => updateDecimalState(e.target.value, setStartLng, setStartLngDMS)}
              />
            </>
          ) : (
            <>
              <Input
                label="Start Latitude Degrees"
                value={startLatDMS.deg.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'deg', setStartLatDMS, setStartLat)}
              />
              <Input
                label="Minutes"
                value={startLatDMS.min.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'min', setStartLatDMS, setStartLat)}
              />
              <Input
                label="Seconds"
                value={startLatDMS.sec.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'sec', setStartLatDMS, setStartLat)}
              />
              <Select
                value={startLatDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLatDMS, setStartLat)}
              >
                <SelectItem key="N" value="N">N</SelectItem>
                <SelectItem key="S" value="S">S</SelectItem>
              </Select>
              <Input
                label="Start Longitude Degrees"
                value={startLngDMS.deg.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'deg', setStartLngDMS, setStartLng)}
              />
              <Input
                label="Minutes"
                value={startLngDMS.min.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'min', setStartLngDMS, setStartLng)}
              />
              <Input
                label="Seconds"
                value={startLngDMS.sec.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'sec', setStartLngDMS, setStartLng)}
              />
              <Select
                value={startLngDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setStartLngDMS, setStartLng)}
              >
                <SelectItem key="E" value="E">E</SelectItem>
                <SelectItem key="W" value="W">W</SelectItem>
              </Select>
            </>
          )}

          <Button onClick={clearEndPoint} style={{ gridColumn: '1 / -1' }}>Clear End Point</Button>

          {coordinateFormat === 'decimal' ? (
            <>
              <Input
                label="End Latitude"
                value={endLat !== undefined ? endLat.toString() : ''}
                onChange={(e) => updateDecimalState(e.target.value, setEndLat as React.Dispatch<React.SetStateAction<number>>, setEndLatDMS)}
              />
              <Input
                label="End Longitude"
                value={endLng !== undefined ? endLng.toString() : ''}
                onChange={(e) => updateDecimalState(e.target.value, setEndLng as React.Dispatch<React.SetStateAction<number>>, setEndLngDMS)}
              />
            </>
          ) : (
            <>
              <Input
                label="End Latitude Degrees"
                value={endLatDMS.deg.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'deg', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>)}
              />
              <Input
                label="Minutes"
                value={endLatDMS.min.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'min', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>)}
              />
              <Input
                label="Seconds"
                value={endLatDMS.sec.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'sec', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>)}
              />
              <Select
                value={endLatDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setEndLatDMS, setEndLat as React.Dispatch<React.SetStateAction<number>>)}
              >
                <SelectItem key="N" value="N">N</SelectItem>
                <SelectItem key="S" value="S">S</SelectItem>
              </Select>
              <Input
                label="End Longitude Degrees"
                value={endLngDMS.deg.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'deg', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>)}
              />
              <Input
                label="Minutes"
                value={endLngDMS.min.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'min', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>)}
              />
              <Input
                label="Seconds"
                value={endLngDMS.sec.toString()}
                onChange={(e) => updateDMSState(e.target.value, 'sec', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>)}
              />
              <Select
                value={endLngDMS.dir}
                onChange={(e) => updateDMSState(e.target.value, 'dir', setEndLngDMS, setEndLng as React.Dispatch<React.SetStateAction<number>>)}
              >
                <SelectItem key="E" value="E">E</SelectItem>
                <SelectItem key="W" value="W">W</SelectItem>
              </Select>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MapComponent;
