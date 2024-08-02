import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'proj4';
import 'proj4leaflet';

// Définition de la projection EPSG:3413
const crs = new (L as any).Proj.CRS(
  'EPSG:3413',
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
  {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
    origin: [-4194304, 4194304],
    bounds: L.bounds(
      [-4194304, -4194304],
      [4194304, 4194304]
    )
  }
);

// Composant pour initialiser la vue de la carte
const MapInitializer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.setView([90, 0], 3);
  }, [map]);
  return null;
};

const ArcticMap: React.FC = () => {
  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const today = "2024-08-01" //new Date("2023-06-01").toISOString().split('T')[0];

  return (
    <MapContainer
      center={[90, 0]}
      zoom={3}
      style={{ height: '600px', width: '100%' }}
      crs={crs}
      maxZoom={8}
      minZoom={0}
    >
      <MapInitializer />
      <TileLayer
        // url='https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}/{z}/{y}/{x}.jpg'
        url='https://map1.vis.earthdata.nasa.gov/wmts-arctic/OSM_Land_Mask/default/{time}/{tilematrixset}/{z}/{y}/{x}.png'
        attribution='Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
        maxZoom={8}
        minZoom={0}
        tileSize={512}
        time={today}
        tilematrixset="EPSG3413_250m"
      />
      <Marker position={[89, 2.45]}>
        <Popup>Point 1: 89°N, 2.45°E</Popup>
      </Marker>
      <Marker position={[88.7, 0.1]}>
        <Popup>Point 2: 88.7°N, 0.1°E</Popup>
      </Marker>
    </MapContainer>
  );
};

export default ArcticMap;
