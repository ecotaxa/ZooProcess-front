

// class gateway{}

import { Image } from "@nextui-org/react"

import {isTiff, pathToSessionStorage, pathToRealStorage }  from "@/lib/gateway"
import { converttiff2jpg } from "@/app/api/convert";

import { useEffect, useState } from "react"



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



export function MyImage(props){
    const [isPortrait, setIsPortrait] = useState(false)
    const [processedImage, setProcessedImage] = useState(null)

    // useEffect(() => {
    //     if (isTiff(props.src)) {
    //         const data = { src: pathToRealStorage(props.src) }
            
    //         // converttiff2jpg(data)
    //         //     .then(response => response.text())
    //         //     .then(imageUrl => {
    //         //         const sessionPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/")
    //         //         setProcessedImage(sessionPath)
    //         //     })
    //         converttiff2jpg(data)
    //             .then(response => response.text())
    //             .then(imageUrl => pathToSessionStorage(imageUrl.replace(/"/g, ""), ""))
    //             .then(path => {
    //                 console.debug("------------------------------------------------")
    //                 console.debug("MyImage() | sessionPath :", path)
    //                 return path
    //              })
    //             .then(sessionPath => sessionPath.replace(/^\/+/, '/'))
    //             .then(normalizedPath => setProcessedImage(normalizedPath))
    //     }
    // }, [props.src])

    const changeToJpgExtension = (path) => {
        return path.replace(/\.tif?$/i, '.jpg')
      }

    useEffect( () => {
        if (isTiff(props.src)) {
            const data = { 
                src: pathToRealStorage(props.src),
                dst: changeToJpgExtension(pathToSessionStorage(props.src, ""))
                // dst: changeToJpgExtension(props.src)
             }
            
             console.debug("MyImage() | data :", data)

            // converttiff2jpg(data)
            //     .then(response => response.text())
            //     .then(imageUrl => {
            //         const sessionPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/")
            //         setProcessedImage(sessionPath)
            //     })
            converttiff2jpg(data)
                .then(response => { console.debug("converttiff2jpg return", response) ;return response})
                // .then(response => response.text())
                // .then(response => response.json())
                .then((p)=>{console.log("response imageUrl", p); return p})
                .then(imageUrl => pathToSessionStorage(imageUrl.replace(/"/g, ""), ""))
                .then((p)=>{console.log("pathToSessionStorage =>", p); return p})
                .then(path => {
                    console.debug("------------------------------------------------")
                    console.debug("MyImage() | sessionPath :", path)
                    return path
                 })
                .then(sessionPath => sessionPath.replace(/^\/+/, '/'))
                .then((i)=> {console.log("normalizedPath", i); return i})
                // .then(()=> {return ('/Users/sebastiengalvagno/Work/test/nextui/ZooprocessFront/public/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_001_st01_d_d1_raw_1.jpg')})
                .then(normalizedPath => setProcessedImage(normalizedPath))
                
                .catch(e => {
                    console.error("CATCH MyImage Error converting TIFF to JPG:", e);
                    // return "/images/404.jpg"
                    setProcessedImage("/images/404.jpg")
                })
        }
    }, [props.src])

    const handleLoad = (e) => {
        const img = e.target
        setIsPortrait(img.naturalHeight > img.naturalWidth)
    }

    let newProps = { ...props }

    console.log("MyImage() | props :", props)
    console.log('props.src type:', typeof props.src, 'props.src value:', props.src);

    // // const sessionPath = pathToSessionStorage(props.src)
    // let sessionPath = pathToSessionStorage(props.src)


    // if (isTiff(props.src)) {
    //     const data = { src: pathToRealStorage(props.src) };
    //     // const response = await converttiff2jpg(data);
    //     // const imageUrl = await response.text();
    //     // sessionPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/");

    //     return converttiff2jpg(data)
    //     .then((response) => {
    //         const imageUrl = response.text();
    //         return imageUrl.replace(/"/g, "");
    //     })
    //     .then((imageUrl) => {
    //         return pathToSessionStorage(imageUrl, "/");
    //     })
    //     .then((sessionPath) => {
    //         console.log("MyImage() | sessionPath :", sessionPath);
    //         newProps.src = sessionPath;
    //         newProps.className = "mx-auto";
    //         newProps.onLoad = handleLoad;
    //         const rotateClass = isPortrait ? "rotate-90" : "";
    //         newProps.className = `mx-auto ${rotateClass}`;
    //         return newProps;
    //     });
    // } else {
    //     newProps.src = sessionPath;
    //     newProps.className = "mx-auto";
    //     newProps.onLoad = handleLoad;
    //     const rotateClass = isPortrait ? "rotate-90" : "";
    //     newProps.className = `mx-auto ${rotateClass}`;
    //     return newProps;

    // }

    newProps.src = processedImage || pathToSessionStorage(props.src)
    newProps.onLoad = handleLoad
    const rotateClass = isPortrait ? "rotate-90" : ""
    newProps.className = `mx-auto ${rotateClass}`

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
        <div className="w-fit mx-auto border border-gray-200">
        {/* // <div className="  border border-gray-200"> */}
        {/* <div className="flex justify-center"> */}
                <Image {...newProps} radius="none"/>
            {/* </div> */}
            {props.legend && (
                // <div className="legend text-center text-sm text-gray-600 mt-2">
                <div className="text-center text-sm text-gray-600 mt-2">
                    {props.legend}
                </div>
            )}
            <div>
                <h3>{newProps.src}</h3>
            </div>
        </div>
    )

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
