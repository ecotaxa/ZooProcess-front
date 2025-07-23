"use client"

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

interface MapComponentProps {
  start?: [number, number];
  end?: [number, number];
  onChange: (startCoords: [number, number], endCoords?: [number, number]) => void;
}

// Chargement dynamique sans SSR
// const MapComponentClient = dynamic(() => import('./MapComponentClient'), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//       <p>Loading map...</p>
//     </div>
//   )
// });
const MapComponentClient = dynamic(() => import('./MapComponentClient'), {
  ssr: false
});

// Le wrapper
// const MapComponent: React.FC<MapComponentProps> = (props) => {
//   return <MapComponentClient {...props} />;
// };
// Le wrapper avec traductions (même nom d'export)
const MapComponent = (props: any) => {
  const t = useTranslations('MapComponent');
  
  const DynamicMap = dynamic(() => import('./MapComponentClient'), {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <p>{t('Loading')}</p>
      </div>
    )
  });

  return <DynamicMap {...props} />;
};

export default MapComponent;
