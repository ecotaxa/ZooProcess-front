import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
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

// Définition des icônes personnalisées
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

// Composant pour initialiser la vue de la carte
const MapInitializer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.setView([90, 0], 3);
  }, [map]);
  return null;
};

const ArcticMap: React.FC = () => {
  // Obtenir la date d'hier
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

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
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Blue Marble">
          <TileLayer
            url='https://map1.vis.earthdata.nasa.gov/wmts-arctic/BlueMarble_ShadedRelief_Bathymetry/default/{time}/{tilematrixset}/{z}/{y}/{x}.jpg'
            attribution='NASA Blue Marble, GIBS'
            maxZoom={8}
            minZoom={0}
            tileSize={512}
            time={yesterdayString}
            tilematrixset="EPSG3413_250m"
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked name="Land Surface Temperature">
          <TileLayer
            url='https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_Land_Surface_Temp_Day/default/{time}/{tilematrixset}/{z}/{y}/{x}.png'
            attribution='NASA MODIS Terra Land Surface Temperature, GIBS'
            maxZoom={8}
            minZoom={0}
            tileSize={512}
            time={yesterdayString}
            tilematrixset="EPSG3413_250m"
            opacity={0.7}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="MODIS Terra">
          <TileLayer
            url='https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}/{z}/{y}/{x}.jpg'
            attribution='NASA MODIS Terra, GIBS'
            maxZoom={8}
            minZoom={0}
            tileSize={512}
            time={yesterdayString}
            tilematrixset="EPSG3413_250m"
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Coastlines (Red)">
          <TileLayer
            url='https://map1.vis.earthdata.nasa.gov/wmts-arctic/Coastlines/default/{time}/{tilematrixset}/{z}/{y}/{x}.png'
            attribution='NASA Coastlines, GIBS'
            maxZoom={8}
            minZoom={0}
            tileSize={512}
            time={yesterdayString}
            tilematrixset="EPSG3413_250m"
            opacity={1}
            className="red-coastline"
          />
        </LayersControl.Overlay>
      </LayersControl>
      <Marker position={[89, 2.45]} icon={yellowIcon}>
        <Popup>Point 1: 89°N, 2.45°E</Popup>
      </Marker>
      <Marker position={[88.7, 0.1]} icon={blueIcon}>
        <Popup>Point 2: 88.7°N, 0.1°E</Popup>
      </Marker>
      <style>{`
        .red-coastline {
          filter: brightness(0) saturate(100%) invert(19%) sepia(92%) saturate(6618%) hue-rotate(357deg) brightness(97%) contrast(113%);
        }
      `}</style>
    </MapContainer>
  );
};

export default ArcticMap;
