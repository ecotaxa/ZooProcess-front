// class gateway{}

import { Image, Spinner } from '@heroui/react';

import { isTiff, pathToSessionStorage, pathToRealStorage } from '@/lib/gateway';
import { converttiff2jpg } from '@/app/api/convert';

import { useEffect, useRef, useState } from 'react';

// export function MyImage(props) {
//     let newProps = { ...props }
//     const sessionPath = pathToSessionStorage(props.src)
//     newProps.src = sessionPath
//     newProps.className = "mx-auto m-0 p-0"

//     return (
//         <div className="w-fit mx-auto m-0 p-0">
//             <Image {...newProps} radius="none" />
//             {props.legend && (
//                 <div className="text-center text-sm text-gray-600">
//                     {props.legend}
//                 </div>
//             )}
//         </div>
//     )
// }

// export function MyImage(props) {
//     const img = new window.Image()
//     img.src = props.src
//     const isPortrait = img.height > img.width

//     let newProps = { ...props }
//     const sessionPath = pathToSessionStorage(props.src)
//     newProps.src = sessionPath
//     const rotateClass = isPortrait ? "rotate-90" : ""
//     newProps.className = `mx-auto m-0 p-0 ${rotateClass}`

//     return (
//         <div className="w-fit mx-auto m-0 p-0">
//             <Image {...newProps} radius="none" />
//             {props.legend && (
//                 <div className="text-center text-sm text-gray-600">
//                     {props.legend}
//                 </div>
//             )}
//         </div>
//     )
// }

// export function MyImage(props) {
//     const [isPortrait, setIsPortrait] = useState(false)

//     useEffect(() => {
//         const img = new window.Image()
//         img.src = props.src
//         img.onload = () => {
//             setIsPortrait(img.height > img.width)
//         }
//     }, [props.src])

//     let newProps = { ...props }
//     const sessionPath = pathToSessionStorage(props.src)
//     newProps.src = sessionPath
//     const rotateClass = isPortrait ? "rotate-90" : ""
//     newProps.className = `mx-auto m-0 p-0 ${rotateClass}`

//     return (
//         <div className="w-fit mx-auto m-0 p-0">
//             <Image {...newProps} radius="none" />
//             {props.legend && (
//                 <div className="text-center text-sm text-gray-600">
//                     {props.legend}
//                 </div>
//             )}
//         </div>
//     )
// }

export function MyImage(props) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // const containerRef = useRef(null);

  const placeholder = '/images/placeholder-image.jpg';

  const changeToJpgExtension = path => {
    return path.replace(/\.tif?$/i, '.jpg');
  };

  useEffect(() => {
    if (props.src && isTiff(props.src)) {
      setIsLoading(true);
      setError(null);

      const data = {
        src: pathToRealStorage(props.src),
        dst: changeToJpgExtension(pathToSessionStorage(props.src, '')),
        // dst: changeToJpgExtension(props.src)
      };

      console.debug('MyImage() | data :', data);
      converttiff2jpg(data)
        .then(response => {
          console.debug('converttiff2jpg return', response);
          return response;
        })
        .then(p => {
          console.log('response imageUrl', p);
          return p;
        })
        .then(imageUrl => pathToSessionStorage(imageUrl.replace(/"/g, ''), ''))
        .then(p => {
          console.log('pathToSessionStorage =>', p);
          return p;
        })
        .then(path => {
          console.debug('------------------------------------------------');
          console.debug('MyImage() | sessionPath :', path);
          return path;
        })
        .then(sessionPath => sessionPath.replace(/^\/+/, '/'))
        .then(i => {
          console.log('normalizedPath', i);
          return i;
        })
        .then(normalizedPath => {
          setProcessedImage(normalizedPath);
          setIsLoading(false);
        })

        .catch(e => {
          console.error('CATCH MyImage Error converting TIFF to JPG:', e);
          // return "/images/404.jpg"
          setProcessedImage('/images/404.jpg');
          setError('Failed to convert image');
          setIsLoading(false);
        });
    } else if (props.src) {
      // Not a TIFF, just use the original
      setProcessedImage(null);
      setIsLoading(false);
      setError(null);
    }
  }, [props.src]);

  //    // Calculate max dimensions based on screen size
  //    useEffect(() => {
  //     const updateMaxDimensions = () => {
  //         // Get available screen space (accounting for margins/padding)
  //         const maxWidth = window.innerWidth * 0.9; // 90% of viewport width
  //         const maxHeight = window.innerHeight * 0.7; // 70% of viewport height

  //         if (containerRef.current && dimensions.width > 0 && dimensions.height > 0) {
  //             let newWidth, newHeight;

  //             if (isPortrait) {
  //                 // For portrait images (after rotation), width becomes height and vice versa
  //                 newWidth = Math.min(dimensions.height, maxWidth);
  //                 newHeight = (newWidth / dimensions.height) * dimensions.width;

  //                 // Check if height exceeds max height
  //                 if (newHeight > maxHeight) {
  //                     newHeight = maxHeight;
  //                     newWidth = (newHeight / dimensions.width) * dimensions.height;
  //                 }
  //             } else {
  //                 // For landscape images
  //                 newWidth = Math.min(dimensions.width, maxWidth);
  //                 newHeight = (newWidth / dimensions.width) * dimensions.height;

  //                 // Check if height exceeds max height
  //                 if (newHeight > maxHeight) {
  //                     newHeight = maxHeight;
  //                     newWidth = (newHeight / dimensions.height) * dimensions.width;
  //                 }
  //             }

  //             // Apply the calculated dimensions
  //             containerRef.current.style.width = `${isPortrait ? newHeight : newWidth}px`;
  //             containerRef.current.style.height = `${isPortrait ? newWidth : newHeight}px`;
  //         }
  //     };

  //     updateMaxDimensions();
  //
  //     // Update dimensions on window resize
  //     window.addEventListener('resize', updateMaxDimensions);
  //     return () => window.removeEventListener('resize', updateMaxDimensions);
  // }, [dimensions, isPortrait]);

  const handleLoad = e => {
    const img = e.target;
    setIsPortrait(img.naturalHeight > img.naturalWidth);

    // // Store the image dimensions
    // setDimensions({
    //     width: img.naturalWidth,
    //     height: img.naturalHeight
    // });
  };

  let newProps = { ...props };
  if (newProps.src === undefined) {
    newProps.src = placeholder;
  }

  console.log('MyImage() | props :', props);
  console.log('props.src type:', typeof props.src, 'props.src value:', props.src || placeholder);

  if (newProps.src !== placeholder) {
    newProps.src = processedImage || pathToSessionStorage(props.src);
  }
  newProps.onLoad = handleLoad;
  // const rotateClass = isPortrait ? "rotate-90" : ""
  // newProps.className = `mx-auto ${rotateClass}`
  // newProps.className = `mx-auto ${props.className || ""}`;
  // newProps.className = `max-w-full max-h-full object-contain ${props.className || ""}`;
  newProps.className = `object-contain ${props.className || ''}`;

  // Apply rotation to the container if the image is portrait
  //    const containerRotateClass = isPortrait ? "rotate-90 transform-origin-center" : "";
  // Calculate container style based on orientation
  //  const containerStyle = isPortrait ? {
  //     width: `${dimensions.height}px`,
  //     height: `${dimensions.width}px`,
  //     transform: 'rotate(90deg)',
  //     transformOrigin: 'center'
  // } : {};

  // // src={pathToSessionStorage(props.src)}
  // console.log("MyImage() | sessionPath :", sessionPath)
  // newProps.src = sessionPath
  // // newProps.className = "mx-auto"
  // newProps.onLoad = handleLoad
  // const rotateClass = isPortrait ? "rotate-90" : ""
  // newProps.className = `mx-auto ${rotateClass}`
  // // newProps.className = `"${rotateClass}`
  // console.log("MyImage() | newProps :", newProps)

  return (
    // <div className="image-container">
    // <div className="flex flex-col items-center">
    // <div className="w-fit mx-auto border border-gray-200">
    // <div className={`w-fit mx-auto border border-gray-200 relative ${containerRotateClass}`}>

    // <div className="relative">
    //     {/* This wrapper handles the rotation */}
    //     <div className={`
    //         ${isPortrait ?
    //             "portrait-container transform rotate-90 origin-center" :
    //             "landscape-container"
    //         }
    //         border border-gray-200 mx-auto
    //     `}>
    // <div className="relative flex justify-center">
    <div className="relative flex flex-col items-center">
      {/* <div 
                className="border border-gray-200 flex justify-center items-center"
                style={containerStyle}
            > */}
      {/* // <div className="  border border-gray-200"> */}
      {/* <div className="flex justify-center"> */}
      <div
        className={`
                    image-container
                    border border-gray-200
                    ${isPortrait ? 'portrait-mode' : 'landscape-mode'}
                `}
      >
        {/* <div 
                    ref={containerRef}
                    className={`
                        border border-gray-200 flex justify-center items-center overflow-hidden
                        ${isPortrait ? 'transform rotate-90' : ''}
                    `}
                    style={{
                        maxWidth: '90vw',
                        maxHeight: '70vh',
                        transition: 'width 0.3s, height 0.3s'
                    }}
                > */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
            <div className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="mt-2 text-sm text-gray-600">Converting image...</p>
            </div>
          </div>
        )}

        <Image {...newProps} radius="none" />

        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-sm text-center">
            {error}
          </div>
        )}
      </div>
      {/* </div> */}
      {props.legend && (
        // <div className="legend text-center text-sm text-gray-600 mt-2">
        // <div className="text-center text-sm text-gray-600 mt-2">
        <div className="text-center text-sm text-gray-600 mt-2 w-full">{props.legend}</div>
      )}
      <div>
        <h3>{newProps.src}</h3>
      </div>
    </div>
  );
}

// export function MyImage(props) {
//     const [isPortrait, setIsPortrait] = useState(false)

//     useEffect(() => {
//         const img = new Image()
//         img.src = props.src
//         img.onload = () => {
//             setIsPortrait(img.height > img.width)
//         }
//     }, [props.src])

//     let newProps = { ...props }
//     const sessionPath = pathToSessionStorage(props.src)
//     newProps.src = sessionPath
//     const rotateClass = isPortrait ? "rotate-90" : ""
//     newProps.className = `mx-auto ${rotateClass}`

//     return (
//         <div className="w-fit mx-auto">
//             <Image {...newProps} />
//             {props.legend && (
//                 <div className="text-center text-sm text-gray-600 mt-2">
//                     {props.legend}
//                 </div>
//             )}
//         </div>
//     )
// }

// export function MyImage(props) {
//     const [isPortrait, setIsPortrait] = useState(false)

//     const handleLoad = (e) => {
//         const img = e.target
//         setIsPortrait(img.naturalHeight > img.naturalWidth)
//     }

//     let newProps = { ...props }
//     const sessionPath = pathToSessionStorage(props.src)
//     newProps.src = sessionPath
//     newProps.onLoad = handleLoad
//     const rotateClass = isPortrait ? "rotate-90" : ""
//     newProps.className = `mx-auto m-0 p-0 ${rotateClass}`

//     return (
//         <div className="w-fit mx-auto m-0 p-0">
//             <Image {...newProps} radius="none" />
//             {props.legend && (
//                 <div className="text-center text-sm text-gray-600">
//                     {props.legend}
//                 </div>
//             )}
//         </div>
//     )
// }

// export function MyImage(props) {
//     const [isPortrait, setIsPortrait] = useState(false)

//     const handleLoad = (e) => {
//         const img = e.target
//         setIsPortrait(img.naturalHeight > img.naturalWidth)
//     }

//     let newProps = { ...props }
//     const sessionPath = pathToSessionStorage(props.src)
//     newProps.src = sessionPath
//     newProps.onLoad = handleLoad
//     const rotateClass = isPortrait ? "rotate-90" : ""
//     newProps.className = `mx-auto m-0 p-0 ${rotateClass}`

//     return (
//         <div className="flex justify-center items-center m-0 p-0">
//             <Image {...newProps} radius="none" />
//             {props.legend && (
//                 <div className="text-center text-sm text-gray-600">
//                     {props.legend}
//                 </div>
//             )}
//         </div>
//     )
// }

// export function MyImage(props) {
//     const [isPortrait, setIsPortrait] = useState(false)

//     const handleLoad = (e) => {
//         const img = e.target
//         setIsPortrait(img.naturalHeight > img.naturalWidth)
//     }

//     let newProps = { ...props }
//     const sessionPath = pathToSessionStorage(props.src)
//     newProps.src = sessionPath
//     newProps.onLoad = handleLoad
//     const rotateClass = isPortrait ? "rotate-90" : ""
//     newProps.className = `mx-auto m-0 p-0 ${rotateClass}`

//     return (
//         <div className="flex flex-col items-center m-0 p-0">
//             <Image {...newProps} radius="none" />
//             {props.legend && (
//                 <div className="text-center text-sm text-gray-600">
//                     {props.legend}
//                 </div>
//             )}
//         </div>
//     )
// }
