// import { Spinner } from '@heroui/react';

// import { isTiff, pathToSessionStorage, pathToRealStorage } from '@/lib/gateway';
// import { converttiff2jpg } from '@/app/api/convert';
// import { REAL_FOLDER } from '@/constants';

import { type RefObject, useRef, useState } from 'react';

export function MyImage(props: Readonly<{ src: string; alt: string; legend: string }>) {
  const [isPortrait, setIsPortrait] = useState(false);
  // const [processedImage, setProcessedImage] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [windowSize, setWindowSize] = useState({
  //   width: typeof window !== 'undefined' ? window.innerWidth : 0,
  //   height: typeof window !== 'undefined' ? window.innerHeight : 0,
  // });
  const containerRef: RefObject<HTMLDivElement | null> = useRef(null);

  // const placeholder = '/images/placeholder-image.jpg';

  // const changeToJpgExtension = path => {
  //   return path.replace(/\.tif?$/i, '.jpg');
  // };

  // useEffect(() => {
  //   console.debug('MyImage useEffect');
  //   if (props.src && isTiff(props.src)) {
  //     setIsLoading(true);
  //     setError(null);
  //
  //     // Create a daily folder path
  //     const today = new Date();
  //     const dateFolder = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  //     const uploadFolder = `/uploads/${dateFolder}`;
  //
  //     // Extract the filename
  //     const filename = props.src.split('/').pop();
  //     const jpgFilename = filename.replace(/\.tiff?$/i, '.jpg');
  //
  //     // Fix: Ensure path has proper separator between folder and filename
  //     // Add trailing slash to REAL_FOLDER if it doesn't have one
  //     const realFolder = REAL_FOLDER || '';
  //     const normalizedRealFolder = realFolder.endsWith('/') ? realFolder : `${realFolder}/`;
  //
  //     // Create the destination path
  //     const destPath = `${normalizedRealFolder}${uploadFolder.substring(1)}/${jpgFilename}`;
  //     const webPath = `${uploadFolder}/${jpgFilename}`;
  //
  //     const data = {
  //       src: pathToRealStorage(props.src),
  //       dst: destPath,
  //     };
  //
  //     console.debug('MyImage() | data :', data);
  //     converttiff2jpg(data)
  //       .then(response => {
  //         console.debug('converttiff2jpg return', response);
  //         return response;
  //       })
  //       .then(p => {
  //         console.log('response imageUrl', p);
  //         return p;
  //       })
  //       .then(imageUrl => pathToSessionStorage(imageUrl.replace(/"/g, ''), ''))
  //       .then(p => {
  //         console.log('pathToSessionStorage =>', p);
  //         return p;
  //       })
  //       .then(path => {
  //         console.debug('------------------------------------------------');
  //         console.debug('MyImage() | sessionPath :', path);
  //         return path;
  //       })
  //       .then(sessionPath => sessionPath.replace(/^\/+/, '/'))
  //       .then(i => {
  //         console.log('normalizedPath', i);
  //         return i;
  //       })
  //       .then(normalizedPath => {
  //         setProcessedImage(normalizedPath);
  //         setIsLoading(false);
  //       })
  //
  //       .catch(e => {
  //         console.error('CATCH MyImage Error converting TIFF to JPG:', e);
  //         setProcessedImage('/images/404.jpg');
  //         setError('Failed to convert image');
  //         setIsLoading(false);
  //       });
  //   } else if (props.src) {
  //     console.debug('MyImage() | props.src :', props.src);
  //     setProcessedImage(pathToSessionStorage(props.src));
  //     setIsLoading(false);
  //     setError(null);
  //   } else {
  //     // Not a TIFF, just use the original
  //     console.debug('Not a TIFF, using original');
  //     setProcessedImage(placeholder);
  //     setIsLoading(false);
  //     setError(null);
  //   }
  // }, [props.src]);

  const handleLoad = (e: { target: any }) => {
    const img = e.target;
    const isPortraitOrientation = img.naturalHeight > img.naturalWidth;
    setIsPortrait(isPortraitOrientation);

    // Force la taille du conteneur après le chargement de l'image
    if (containerRef.current) {
      if (isPortraitOrientation) {
        const container = containerRef.current;
        const aspectRatio = img.naturalWidth / img.naturalHeight;

        // Calculer la taille optimale pour éviter les espaces blancs
        const containerWidth = Math.min(window.innerHeight * 0.7, img.naturalHeight);
        const containerHeight = containerWidth * aspectRatio;

        container.style.width = `${containerWidth}px`;
        container.style.height = `${containerHeight}px`;
      }
    }
  };

  // let newProps = { ...props };
  // newProps.src = placeholder;
  // if (props.src !== undefined) {
  //   newProps.src = processedImage || pathToSessionStorage(props.src);
  // }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Conteneur principal centré horizontalement */}
      <div
        className="flex justify-center items-center w-full"
        style={{ height: isPortrait ? 'auto' : '70vh' }}
      >
        {/* Conteneur de l'image avec rotation */}
        <div
          ref={containerRef}
          className={`
                     relative border border-slate-200
                     ${isPortrait ? 'transform rotate-90' : ''}
                     transition-transform duration-300
                 `}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/*{isLoading && (*/}
          {/*  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">*/}
          {/*    <Spinner color="primary" size="lg" />*/}
          {/*  </div>*/}
          {/*)}*/}

          <img
            src={props.src}
            alt={props.alt ?? 'Image'}
            onLoad={handleLoad}
            className="max-w-full max-h-full object-contain"
          />

          {/*{error && (*/}
          {/*  <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-sm text-center">*/}
          {/*    {error}*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </div>
      {props.legend && (
        <div className="text-center text-sm text-gray-600 mt-4 w-full">{props.legend}</div>
      )}
    </div>
  );
}
