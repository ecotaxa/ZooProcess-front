import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ArcticMap = () => {
  useEffect(() => {
    // Créer la carte
    const map = L.map('map').setView([89, 0], 4);

    // Ajouter la couche de tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ajouter les marqueurs
    const marker1 = L.marker([89, 2.45]).addTo(map);
    const marker2 = L.marker([88.7, 0.1]).addTo(map);

    // Ajouter des popups aux marqueurs
    marker1.bindPopup("Point 1: 89°N, 2.45°E");
    marker2.bindPopup("Point 2: 88.7°N, 0.1°E");

    // Nettoyage
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

export default ArcticMap;
