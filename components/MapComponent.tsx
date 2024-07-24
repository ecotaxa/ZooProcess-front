import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Input, Card, CardBody } from '@nextui-org/react';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
//   const [startPosition, setStartPosition] = useState<[number, number]>([0, 0]);
//   const [endPosition, setEndPosition] = useState<[number, number]>([0, 0]);

  const [startPosition, setStartPosition] = useState([48.8566, 2.3522]); // Paris coordinates
  const [endPosition, setEndPosition] = useState([51.5074, -0.1278]); // London coordinates
  

  const startPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [lat, lng] = e.target.value.split(',').map(Number);
    setStartPosition([lat, lng]);
  };

  const endPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [lat, lng] = e.target.value.split(',').map(Number);
    setEndPosition([lat, lng]);
  };

  const positionIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    iconSize: [25, 41],
  });

  return (
    <Card>
      <CardBody>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {startPosition[0] !== 0 && startPosition[1] !== 0 && (
            <Marker position={startPosition} icon={positionIcon}>
              <Popup>Start Position</Popup>
            </Marker>
          )}
          {endPosition[0] !== 0 && endPosition[1] !== 0 && (
            <Marker position={endPosition} icon={positionIcon}>
              <Popup>End Position</Popup>
            </Marker>
          )}
          {startPosition[0] !== 0 && startPosition[1] !== 0 && endPosition[0] !== 0 && endPosition[1] !== 0 && (
            <Polyline positions={[startPosition, endPosition]} color="red" />
          )}
        </MapContainer>
        <Input 
          label="Start Position"
          fullWidth
          value={startPosition.join(',')} 
          onChange={startPositionChange}
          placeholder="Enter start position (lat,lng)"
        />
        <Input 
          label="End Position"
          fullWidth
          value={endPosition.join(',')} 
          onChange={endPositionChange}
          placeholder="Enter end position (lat,lng)"
        />
      </CardBody>
    </Card>
  );
};

export default MapComponent;
