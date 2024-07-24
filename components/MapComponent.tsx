import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Input, Card, CardBody } from '@nextui-org/react';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const startPoint = { lat: 48.8566, lng: 2.3522 };
  const endPoint = { lat: 51.5074, lng: -0.1278 };

  const [startLat, setStartLat] = useState(startPoint.lat);
  const [startLng, setStartLng] = useState(startPoint.lng);
  const [endLat, setEndLat] = useState(endPoint.lat);
  const [endLng, setEndLng] = useState(endPoint.lng);

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
        <Input 
        label="Start Latitude"
        type="number"
        value={startLat.toString()} 
        onChange={(e) => setStartLat(parseFloat(e.target.value))}
        />
        <Input 
        label="Start Longitude"
        type="number"
        value={startLng.toString()} 
        onChange={(e) => setStartLng(parseFloat(e.target.value))}
        />
        <Input 
            label="End Lati   tude"
            type="number"
            value={endLat.toString()} 
            onChange={(e) => setEndLat(parseFloat(e.target.value))}
        />
        <Input 
        label="End Longitude"
        type="number"
        value={endLng.toString()} 
        onChange={(e) => setEndLng(parseFloat(e.target.value))}
        />

      </CardBody>
    </Card>
  );
};

export default MapComponent;
