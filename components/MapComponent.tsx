import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Input, Card, CardBody, Select, SelectItem } from '@nextui-org/react';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
  const startPoint = { lat: 48.8566, lng: 2.3522 };
  const endPoint = { lat: 51.5074, lng: -0.1278 };

  const [startLat, setStartLat] = useState<number>(startPoint.lat);
  const [startLng, setStartLng] = useState<number>(startPoint.lng);
  const [endLat, setEndLat] = useState<number>(endPoint.lat);
  const [endLng, setEndLng] = useState<number>(endPoint.lng);
  const [coordinateFormat, setCoordinateFormat] = useState<'decimal' | 'dms'>('decimal');

  const mapRef = useRef<L.Map | null>(null);

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
    return `${degrees}° ${minutes}' ${seconds}"`;
  };

  const convertToDecimal = (dms: string): number => {
    const parts = dms.split(/[°'"]+/).map(part => parseFloat(part));
    return parts[0] + parts[1] / 60 + parts[2] / 3600;
  };

  const updateStartLat = (value: string): void => {
    const newLat = coordinateFormat === 'decimal' ? parseFloat(value) : convertToDecimal(value);
    if (isValidCoordinate(newLat, startLng)) {
      setStartLat(newLat);
    }
  };

  const updateStartLng = (value: string): void => {
    const newLng = coordinateFormat === 'decimal' ? parseFloat(value) : convertToDecimal(value);
    if (isValidCoordinate(startLat, newLng)) {
      setStartLng(newLng);
    }
  };

  const updateEndLat = (value: string): void => {
    const newLat = coordinateFormat === 'decimal' ? parseFloat(value) : convertToDecimal(value);
    if (isValidCoordinate(newLat, endLng)) {
      setEndLat(newLat);
    }
  };

  const updateEndLng = (value: string): void => {
    const newLng = coordinateFormat === 'decimal' ? parseFloat(value) : convertToDecimal(value);
    if (isValidCoordinate(endLat, newLng)) {
      setEndLng(newLng);
    }
  };

  useEffect(() => {
    if (mapRef.current && isValidCoordinate(startLat, startLng) && isValidCoordinate(endLat, endLng)) {
      const bounds = L.latLngBounds([
        [startLat, startLng],
        [endLat, endLng]
      ]);
      mapRef.current.fitBounds(bounds);
    }
  }, [startLat, startLng, endLat, endLng]);

  return (
    <Card>
      <CardBody>
        <MapContainer
          center={[(startLat + endLat) / 2, (startLng + endLng) / 2]}
          zoom={5}
          style={{ height: '400px', width: '100%' }}
          ref={mapRef}
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
          {isValidCoordinate(endLat, endLng) && (
            <Marker position={[endLat, endLng]} icon={positionIcon}>
              <Popup>End Position</Popup>
            </Marker>
          )}
          {isValidCoordinate(startLat, startLng) && isValidCoordinate(endLat, endLng) && (
            <Polyline positions={[[startLat, startLng], [endLat, endLng]]} color="red" />
          )}
        </MapContainer>
        <Select
          label="Coordinate Format"
          value={coordinateFormat}
          onChange={(e) => setCoordinateFormat(e.target.value as 'decimal' | 'dms')}
        >
          <SelectItem key="decimal" value="decimal">Decimal Degrees</SelectItem>
          <SelectItem key="dms" value="dms">Degrees, Minutes, Seconds</SelectItem>
        </Select>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input 
              label="Start Latitude"
              value={coordinateFormat === 'decimal' ? startLat.toString() : convertToDMS(startLat)}
              onChange={(e) => updateStartLat(e.target.value)}
            />
            <Input 
              label="Start Longitude"
              value={coordinateFormat === 'decimal' ? startLng.toString() : convertToDMS(startLng)}
              onChange={(e) => updateStartLng(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input 
              label="End Latitude"
              value={coordinateFormat === 'decimal' ? endLat.toString() : convertToDMS(endLat)}
              onChange={(e) => updateEndLat(e.target.value)}
            />
            <Input 
              label="End Longitude"
              value={coordinateFormat === 'decimal' ? endLng.toString() : convertToDMS(endLng)}
              onChange={(e) => updateEndLng(e.target.value)}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MapComponent;
