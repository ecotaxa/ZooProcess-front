import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'proj4';
import 'proj4leaflet';
import AntarcticMapLayers from './AntarcticMapLayers';

const crs = new (L as any).Proj.CRS(
  'EPSG:3031',
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
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

  const blackIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  

interface MapInitializerProps {
    lat:number;
    lng:number;
    zoom:number;
  }

// Composant pour initialiser la vue de la carte
const MapInitializer: React.FC<MapInitializerProps> = ({lat=-90,lng=0,zoom=0}) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map,lat,lng,zoom]);
  return null;
};

interface CoordsProps {
    start: [number,number];
    end: [number|undefined,number|undefined];
  }

const AntarcticMap: React.FC<CoordsProps> = ({start,end}) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const currentMonthString = new Date().toISOString().slice(0, 7) + '-01';

  return (
    <>
    <div>{yesterdayString}</div>
    <MapContainer
        center={[start[0], start[1]]}
        zoom={1}
      style={{ height: '600px', width: '100%' }}
      crs={crs}
      maxZoom={8}
      minZoom={0}
    >
      <AntarcticMapLayers yesterdayString={yesterdayString} currentMonthString={currentMonthString} />
      <MapInitializer lat={start[0]} lng={start[1]} zoom={0}/>


      <Marker position={[-90, 0]} icon={blackIcon}>
          <Popup>North Pole</Popup>
        </Marker>

        {/* <Marker position={[89, 2.45]} icon={yellowIcon}> */}
        <Marker position={[start[0], start[1]]} icon={yellowIcon}>
          <Popup>Start: [{start[0]}, {start[1]}]</Popup>
        </Marker>
        {end && end[0] && end[1] && <Marker position={[end[0], end[1]]} icon={blueIcon}>
          <Popup>End: [{end[0]}, {end[1]}]</Popup>
        </Marker>}

      <style>{`
        .red-coastline {
          filter: brightness(0) saturate(100%) invert(19%) sepia(92%) saturate(6618%) hue-rotate(357deg) brightness(97%) contrast(113%);
        }
        .custom-land-water-map {
          filter: contrast(200%) brightness(150%) sepia(100%) hue-rotate(20deg) saturate(1000%);
        }
      `}</style>
    </MapContainer>
    </>
  );
};

export default AntarcticMap;
