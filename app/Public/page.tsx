import MapComponent from '@/components/MapComponent';
import { useState } from 'react';

const PublicPage: React.FC = () => {
  const [startCoords, setStartCoords] = useState<[number, number]>([88.8566, 2.3522]);
  const [endCoords, setEndCoords] = useState<[number, number]>([81.5074, -0.1278]);

  const handleCoordsChange = (
    newStartCoords: [number, number],
    newEndCoords?: [number, number]
  ) => {
    setStartCoords(newStartCoords);
    if (newEndCoords) setEndCoords(newEndCoords);
    // You can perform additional actions with the updated coordinates here
  };

  return (
    <div>
      <h1>Map Coordinates</h1>
      <MapComponent start={startCoords} end={endCoords} onChange={handleCoordsChange} />
      <p>Start Coordinates: {startCoords.join(', ')}</p>
      <p>End Coordinates: {endCoords.join(', ')}</p>
    </div>
  );
};

export default PublicPage;
