import React, { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'proj4';
import 'proj4leaflet';
// import ArcticMapLayers from './ArcticMapLayers';
import PlanisferLayers from './PlanisferLayers';

// Définition de la projection EPSG:3413
// const crs = new (L as any).Proj.CRS(
//   'EPSG:3413',
//   '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
//   {
//     resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
//     origin: [-4194304, 4194304],
//     bounds: L.bounds(
//       [-4194304, -4194304],
//       [4194304, 4194304]
//     )
//   }
// );


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

interface CoordsProps {
    start: [number,number];
    end: [number|undefined, number|undefined];
  }


  interface MapInitializerProps {
    lat:number;
    lng:number;
    zoom:number;
  }

// Composant pour initialiser la vue de la carte
const MapInitializer: React.FC<MapInitializerProps> = ({lat=0,lng=0,zoom=3})  => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map]);
  return null;
};


interface CoordsProps {
    start: [number,number];
    end: [number|undefined,number|undefined];
  }
const Planisfer: React.FC<CoordsProps> = ({start,end}) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 5);
    // const yesterdayString = '2024-07-24'
    const yesterdayString = yesterday.toISOString().split('T')[0];
  
    const currentMonthString = new Date().toISOString().slice(0, 7) + '-01';
  
    const crs = L.CRS.EPSG3857
    const mapRef = useRef<L.Map | null>(null);

    return (
    <>
    <div>{yesterdayString}</div>
      <MapContainer
        key='standard'
        center={[start[0], start[1]]} // [startLat, startLng]
        zoom={5}
        style={{ height: '600px', width: '100%' }}
        ref={mapRef}
        zoomControl={true}
        crs={crs}
        maxZoom={8}
        minZoom={0} // undefined
      >
        <MapInitializer lat={start[0]} lng={start[1]} zoom={5}/>
        <PlanisferLayers day={yesterdayString} monthString={currentMonthString} />
        <MapContainer />
        {/* <Marker position={[89, 2.45]} icon={yellowIcon}> */}
        <Marker position={[start[0], start[1]]} icon={blueIcon}>
          <Popup>Start: [{start[0]}, {start[1]}]</Popup>
        </Marker>
        {end && end[0] && end[1] && <Marker position={[end[0], end[1]]} icon={yellowIcon}>
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
  
  export default Planisfer;
