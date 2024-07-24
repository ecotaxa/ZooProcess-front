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

  const convertToDMS = (decimal: number): string => {
    const degrees = Math.floor(Math.abs(decimal));
    const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
    const seconds = ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = decimal >= 0 ? (degrees < 90 ? 'N' : 'E') : (degrees < 90 ? 'S' : 'W');
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  const convertToDecimal = (dms: string): number => {
    const parts = dms.split(/[^\d\w.]+/).filter(Boolean);
    let result = parseFloat(parts[0]) + parseFloat(parts[1]) / 60 + parseFloat(parts[2]) / 3600;
    if (parts[3] === 'S' || parts[3] === 'W') result *= -1;
    return result;
  };

  const updateCoordinate = (value: string, setter: React.Dispatch<React.SetStateAction<number>>, otherCoord: number, isLat: boolean): void => {
    if (coordinateFormat === 'decimal') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && isValidCoordinate(isLat ? numValue : otherCoord, isLat ? otherCoord : numValue)) {
        setter(numValue);
        hasScaled.current = false;
      }
    } else {
      const decimalValue = convertToDecimal(value);
      if (!isNaN(decimalValue) && isValidCoordinate(isLat ? decimalValue : otherCoord, isLat ? otherCoord : decimalValue)) {
        setter(decimalValue);
        hasScaled.current = false;
      }
    }
  };

  const updateStartLat = (value: string): void => updateCoordinate(value, setStartLat, startLng, true);
  const updateStartLng = (value: string): void => updateCoordinate(value, setStartLng, startLat, false);
  const updateEndLat = (value: string): void => updateCoordinate(value, setEndLat as React.Dispatch<React.SetStateAction<number>>, endLng ?? 0, true);
  const updateEndLng = (value: string): void => updateCoordinate(value, setEndLng as React.Dispatch<React.SetStateAction<number>>, endLat ?? 0, false);

  const clearEndPoint = () => {
    setEndLat(undefined);
    setEndLng(undefined);
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
          gridTemplateColumns: 'auto 1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '10px',
          alignItems: 'flex-end'
        }}>
          <Select
            label="Coordinate Format"
            value={coordinateFormat}
            onChange={(e) => setCoordinateFormat(e.target.value as 'decimal' | 'dms')}
            defaultSelectedKeys={["decimal"]}
            style={{ width: '300px' }}
          >
            <SelectItem key="decimal" value="decimal">Decimal Degrees</SelectItem>
            <SelectItem key="dms" value="dms">Degrees, Minutes, Seconds</SelectItem>
          </Select>
          <Input
            label="Start Latitude"
            type="text"
            value={coordinateFormat === 'decimal' ? startLat.toString() : convertToDMS(startLat)}
            onChange={(e) => updateStartLat(e.target.value)}
          />
          <Input
            label="Start Longitude"
            type="text"
            value={coordinateFormat === 'decimal' ? startLng.toString() : convertToDMS(startLng)}
            onChange={(e) => updateStartLng(e.target.value)}
          />
          <Button onClick={clearEndPoint}>Clear End Point</Button>
          <Input
            label="End Latitude"
            type="text"
            value={endLat !== undefined ? (coordinateFormat === 'decimal' ? endLat.toString() : convertToDMS(endLat)) : ''}
            onChange={(e) => updateEndLat(e.target.value)}
          />
          <Input
            label="End Longitude"
            type="text"
            value={endLng !== undefined ? (coordinateFormat === 'decimal' ? endLng.toString() : convertToDMS(endLng)) : ''}
            onChange={(e) => updateEndLng(e.target.value)}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default MapComponent;
