import React from 'react';
import { TileLayer, LayersControl } from 'react-leaflet';

interface ArcticMapLayersProps {
  day: string;
  monthString: string;
}

const ArcticMapLayers: React.FC<ArcticMapLayersProps> = ({ day, monthString }) => {
  const tilematrixset = "EPSG3413_250m";

  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Blue Marble">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/BlueMarble_ShadedRelief_Bathymetry/default/${day}/${tilematrixset}/{z}/{y}/{x}.jpg`}
          attribution='NASA Blue Marble, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.BaseLayer>
      <LayersControl.Overlay name="Land Surface Temperature">
          <TileLayer
            url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_Land_Surface_Temp_Day/default/${day}/${tilematrixset}/{z}/{y}/{x}.png`}
            attribution='NASA MODIS Terra Land Surface Temperature, GIBS'
            maxZoom={8}
            minZoom={0}
            tileSize={512}
            opacity={0.7}
          />
      </LayersControl.Overlay>
      <LayersControl.Overlay  name="Land/Water Map">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_Land_Water_Mask/default/${day}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution='NASA MODIS Terra Land Water Mask, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
          // opacity={1}
          // className="custom-land-water-map"
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="MODIS Terra">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_CorrectedReflectance_TrueColor/default/${day}/${tilematrixset}/{z}/{y}/{x}.jpg`}
          attribution='NASA MODIS Terra, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
          opacity={1}
          />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Sea Ice">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_Sea_Ice/default/${day}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution='NASA MODIS Terra Sea Ice, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
          // opacity={1}

        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Chlorophyll A">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/MODIS_Terra_Chlorophyll_A/default/${day}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution='NASA MODIS Terra Chlorophyll A, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Sea Surface Currents">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/Oscar_Sea_Surface_Currents_Zonal/default/${monthString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution='NASA Oscar Sea Surface Currents, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Surface Wind Speed">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/MERRA2_Surface_Wind_Speed_Monthly/default/${monthString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution='NASA MERRA2 Surface Wind Speed, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Bathymetry">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/GEBCO_2019_Bathymetry/default/${day}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution='GEBCO Bathymetry, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="Coastlines (Red)">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-arctic/Coastlines/default/${day}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution='NASA Coastlines, GIBS'
          maxZoom={8}
          minZoom={0}
          tileSize={512}
          opacity={1}
          className="red-coastline"
        />
      </LayersControl.Overlay>
    </LayersControl>
  );
};

export default ArcticMapLayers;
