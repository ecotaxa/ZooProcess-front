import React from 'react';
import { TileLayer, LayersControl } from 'react-leaflet';

interface AntarcticMapLayersProps {
  yesterdayString: string;
  currentMonthString: string;
}

const AntarcticMapLayers: React.FC<AntarcticMapLayersProps> = ({
  yesterdayString,
  currentMonthString,
}) => {
  const tilematrixset = 'EPSG3031_250m';

  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Blue Marble">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/BlueMarble_ShadedRelief_Bathymetry/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.jpg`}
          attribution="NASA Blue Marble, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.BaseLayer>
      <LayersControl.Overlay checked name="Land/Water Map">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/MODIS_Terra_Land_Water_Mask/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution="NASA MODIS Terra Land Water Mask, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
          opacity={1}
          className="custom-land-water-map"
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="MODIS Terra True Color">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/MODIS_Terra_CorrectedReflectance_TrueColor/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.jpg`}
          attribution="NASA MODIS Terra True Color, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Sea Ice">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/MODIS_Terra_Sea_Ice/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution="NASA MODIS Terra Sea Ice, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Chlorophyll A">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/MODIS_Terra_Chlorophyll_A/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution="NASA MODIS Terra Chlorophyll A, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Sea Surface Temperature">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/MODIS_Terra_Sea_Surface_Temp_Day/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution="NASA MODIS Terra Sea Surface Temperature, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Ice Surface Temperature">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/MODIS_Terra_Ice_Surface_Temp_Day/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution="NASA MODIS Terra Ice Surface Temperature, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Bathymetry">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/GEBCO_2019_Bathymetry/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution="GEBCO Bathymetry, GIBS"
          maxZoom={8}
          minZoom={0}
          tileSize={512}
        />
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="Coastlines (Red)">
        <TileLayer
          url={`https://map1.vis.earthdata.nasa.gov/wmts-antarctic/Coastlines/default/${yesterdayString}/${tilematrixset}/{z}/{y}/{x}.png`}
          attribution="NASA Coastlines, GIBS"
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

export default AntarcticMapLayers;
