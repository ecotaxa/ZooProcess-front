import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Input, Label } from 'react-ui';

const MapComponent = () => {
  const [startPosition, setStartPosition] = useState([0, 0]);
  const [endPosition, setEndPosition] = useState([0, 0]);

  const startPositionChange = (e) => {
    setStartPosition([e.target.value.split(',')[0], e.target.value.split(',')[1]]);
  };

  const endPositionChange = (e) => {
    setEndPosition([e.target.value.split(',')[0], e.target.value.split(',')[1]]);
  };

  const positionIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    iconSize: [25, 41],
  });

  return (
    <div>
      <MapContainer center={[0, 0]} zoom={13} style={{ height: '100px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {startPosition && (
          <Marker position={startPosition} icon={positionIcon}>
            <Popup>Start Position</Popup>
          </Marker>
        )}
        {endPosition && (
          <Marker position={endPosition} icon={positionIcon}>
            <Popup>End Position</Popup>
          </Marker>
        )}
        {startPosition && endPosition && (
          <Polyline positions={[startPosition, endPosition]} color="red" />
        )}
      </MapContainer>
      <div>
        <Label>Start Position:</Label>
        <Input type="text" value={startPosition.join(',')} onChange={startPositionChange} />
      </div>
      <div>
        <Label>End Position:</Label>
        <Input type="text" value={endPosition.join(',')} onChange={endPositionChange} />
      </div>
    </div>
  );
};

export default MapComponent;
