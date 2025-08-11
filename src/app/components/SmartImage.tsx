import { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void; // facultatif
}

export function SmartImage({ src, alt, onClick, onLoad }: Readonly<SmartImageProps>) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      //   className="relative inline-block w-[200px] h-[200px] border bg-gray-100 rounded overflow-hidden"
      className="relative w-[120px] h-[120px] flex items-center justify-center bg-gray-100 border rounded overflow-hidden"
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
          <div className="w-6 h-6 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => console.error('load error')}
        className={`transition-opacity duration-300 object-contain w-full h-full ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
