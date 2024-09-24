import React from 'react';
import { TileLayer, LayersControl } from 'react-leaflet';

interface ArcticMapLayersProps {
  day: string;
  monthString: string;
}

const ArcticMapLayers: React.FC<ArcticMapLayersProps> = ({ day, monthString }) => {
  const tilematrixset = "EPSG3413_250m";

return (
    <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19.0}
    />
)

}

export default ArcticMapLayers;
