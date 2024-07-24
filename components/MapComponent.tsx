import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Input, Card, CardBody, Select, SelectItem } from '@nextui-org/react';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const startPoint = { lat: 48.8566, lng: 2.3522 };
  const endPoint = { lat: 51.5074, lng: -0.1278 };

  const [startLat, setStartLat] = useState(startPoint.lat);
  const [startLng, setStartLng] = useState(startPoint.lng);
  const [endLat, setEndLat] = useState(endPoint.lat);
  const [endLng, setEndLng] = useState(endPoint.lng);
  const [coordinateFormat, setCoordinateFormat] = useState('decimal');

  const positionIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    iconSize: [25, 41],
  });

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

  return (
    <Card>
      <CardBody>
        <MapContainer center={[(startLat + endLat) / 2, (startLng + endLng) / 2]} zoom={5} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[startLat, startLng]} icon={positionIcon}>
            <Popup>Start Position</Popup>
          </Marker>
          <Marker position={[endLat, endLng]} icon={positionIcon}>
            <Popup>End Position</Popup>
          </Marker>
          <Polyline positions={[[startLat, startLng], [endLat, endLng]]} color="red" />
        </MapContainer>
        <Select
          label="Coordinate Format"
          value={coordinateFormat}
          onChange={(e) => setCoordinateFormat(e.target.value)}
        >
          <SelectItem key="decimal" value="decimal">Decimal Degrees</SelectItem>
          <SelectItem key="dms" value="dms">Degrees, Minutes, Seconds</SelectItem>
        </Select>
        <Input 
          label="Start Latitude"
          value={coordinateFormat === 'decimal' ? startLat.toString() : convertToDMS(startLat)}
          onChange={(e) => setStartLat(coordinateFormat === 'decimal' ? parseFloat(e.target.value) : convertToDecimal(e.target.value))}
        />
        <Input 
          label="Start Longitude"
          value={coordinateFormat === 'decimal' ? startLng.toString() : convertToDMS(startLng)}
          onChange={(e) => setStartLng(coordinateFormat === 'decimal' ? parseFloat(e.target.value) : convertToDecimal(e.target.value))}
        />
        <Input 
          label="End Latitude"
          value={coordinateFormat === 'decimal' ? endLat.toString() : convertToDMS(endLat)}
          onChange={(e) => setEndLat(coordinateFormat === 'decimal' ? parseFloat(e.target.value) : convertToDecimal(e.target.value))}
        />
        <Input 
          label="End Longitude"
          value={coordinateFormat === 'decimal' ? endLng.toString() : convertToDMS(endLng)}
          onChange={(e) => setEndLng(coordinateFormat === 'decimal' ? parseFloat(e.target.value) : convertToDecimal(e.target.value))}
        />
      </CardBody>
    </Card>
  );
};

export default MapComponent;
