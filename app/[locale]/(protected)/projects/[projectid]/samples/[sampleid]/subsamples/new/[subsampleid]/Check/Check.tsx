// "use client"

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, Button, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from '@heroicons/react/24/outline';

// export function Check(param:{current:eState, nextState:eState, setCurrent: (etate:eState) => void, onCancel: () => void}) {
//     const {current, nextState, setCurrent} = param;
//     const [images, setImages] = useState<Array<{ img: string; multiple: string }>>([]);
//     const [selectedImage, setSelectedImage] = useState<{ img: string; multiple: string } | null>(null);
//     const [backdrop, setBackdrop] = useState<"opaque" | "blur" | "transparent" | undefined>("opaque");

//     if (current != eState.check) {
//         return <></>
//     }

//     const jsonfiles = "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json"

//     useEffect(() => {
//         fetch(jsonfiles)
//             .then(response => response.json())
//             .then(data => setImages(data));
//     }, []);

//     const imageRef = useRef<HTMLImageElement>(null);

//     useEffect(() => {
//         if (selectedImage && imageRef.current) {
//             const img = imageRef.current;
//             const scaledHeight = img.naturalHeight * 3;
//             const scaledWidth = img.naturalWidth * 3;

//             // Update modal size
//             const modal = img.closest('.heroui-modal-content') as HTMLElement;
//             if (modal) {
//                 modal.style.height = `${scaledHeight}px`;
//                 modal.style.width = `${scaledWidth}px`;
//             }
//         }
//     }, [selectedImage]);

//     if (current != eState.check) {
//         return <></>
//     }

//     // return (
//     //     <div className="container mx-auto p-4">
//     //         <h1 className="text-2xl font-bold mb-4">Images</h1>
//     //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//     //             {images.map((image, index) => (
//     //                 <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
//     //                     <div className="relative">
//     //                         <img src={image.img} alt={image.img.split('/').pop()} className="w-full h-48 object-cover" />
//     //                         <span className={`absolute top-0 right-0 m-2 px-2 py-1 text-sm font-bold rounded ${
//     //                             parseFloat(image.multiple) < 30 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
//     //                         }`}>
//     //                             {image.multiple}%
//     //                         </span>
//     //                     </div>
//     //                     <div className="p-2">
//     //                         <p className="text-sm truncate">{image.img.split('/').pop()}</p>
//     //                     </div>
//     //                 </div>
//     //             ))}
//     //         </div>
//     //     </div>
//     // );

//     // return (
//     //     <div className="container mx-auto p-4">
//     //         <h1 className="text-2xl font-bold mb-4">Images</h1>
//     //         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
//     //             {images.map((image, index) => (
//     //                 <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
//     //                     <img src={image.img} alt={image.img.split('/').pop()} className="w-full" />
//     //                     <div className="p-2">
//     //                         <p className="text-xs truncate">{image.img.split('/').pop()}</p>
//     //                         <span className={`text-xs font-bold ${
//     //                             parseFloat(image.multiple) < 30 ? 'text-red-500' : 'text-green-500'
//     //                         }`}>
//     //                             {image.multiple}
//     //                         </span>
//     //                     </div>
//     //                 </div>
//     //             ))}
//     //         </div>
//     //     </div>
//     // )

//     // return (
//     //     <div className="container mx-auto p-4">
//     //         <h1 className="text-2xl font-bold mb-4">Images</h1>
//     //         <div className="flex flex-wrap gap-2">
//     //             {images.map((image, index) => (
//     //                 <div key={index} className="relative">
//     //                     <span className={`absolute -top-6 right-0 text-xs font-bold ${
//     //                         parseFloat(image.multiple) < 30 ? 'text-red-500' : 'text-green-500'
//     //                     }`}>
//     //                         {image.multiple}
//     //                     </span>
//     //                     <img src={image.img} alt={image.img.split('/').pop()} className="w-auto h-auto" />
//     //                     <p className="text-xs truncate mt-1">{image.img.split('/').pop()}</p>
//     //                 </div>
//     //             ))}
//     //         </div>
//     //     </div>
//     // );

//     // return (
//     //     <div className="container mx-auto p-4">
//     //         <h1 className="text-2xl font-bold mb-4">Images</h1>
//     //         <div className="flex flex-wrap gap-2">
//     //             {images.map((image: { img: string; multiple: string }, index: number) => (
//     //                 <div key={index} className="relative border rounded-lg overflow-hidden shadow-lg p-2">
//     //                     <span className={`absolute top-0 left-0 px-2 py-1 text-xs font-bold ${
//     //                         parseFloat(image.multiple) < 30 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
//     //                     }`}>
//     //                         {image.multiple}%
//     //                     </span>
//     //                     <Button
//     //                         className="absolute top-0 right-0 p-1"
//     //                         onClick={() => setSelectedImage(image)}
//     //                     >
//     //                         <EyeIcon className="h-5 w-5" />
//     //                     </Button>
//     //                     <img src={image.img} alt={image.img.split('/').pop()} className="w-auto h-auto" />
//     //                     <p className="text-xs truncate mt-1">{image.img.split('/').pop()}</p>
//     //                 </div>
//     //             ))}
//     //         </div>
//             // <Modal backdrop={backdrop}
//             // isOpen={selectedImage !== null}
//             //     onClose={() => setSelectedImage(null)}
//             // >
//             //     <ModalContent>
//             //     <ModalBody>
//             //     {selectedImage && (
//             //         <div className="p-4">
//             //             <img
//             //                 src={selectedImage.img}
//             //                 alt={selectedImage.img.split('/').pop()}
//             //                 className="w-auto h-auto"
//             //                 style={{ transform: 'scale(3)' }}
//             //             />
//             //         </div>
//             //     )}
//             //     </ModalBody>
//             //     </ModalContent>
//             // </Modal>
//     //     </div>
//     // );

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Images</h1>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                 {images.map((image, index) => (
//                     <div key={index} className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between">
//                         <div className="absolute top-2 right-2">
//                             <EyeIcon
//                                 className="h-5 w-5 cursor-pointer"
//                                 onClick={() => setSelectedImage(image)}
//                             />
//                         </div>
//                         <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                             parseFloat(image.multiple) < 30 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
//                         }`}>
//                             {image.multiple}%
//                         </span>
//                         <div className="flex-grow flex items-end justify-center">
//                             <img src={image.img} alt={image.img.split('/').pop()} className="max-w-full max-h-full object-contain" />
//                         </div>
//                         <p className="text-xs truncate mt-2">{image.img.split('/').pop()}</p>
//                     </div>
//                 ))}
//             </div>
//             {/* <Modal backdrop={backdrop}
//     isOpen={selectedImage !== null}
//     onClose={() => setSelectedImage(null)}
// >
//              <ModalBody>
//                  {selectedImage && (
//                      <div className="p-4">
//                          <img
//                              src={selectedImage.img}
//                              alt={selectedImage.img.split('/').pop()}
//                              className="w-auto h-auto"
//                              style={{ transform: 'scale(3)' }}
//                          />
//                      </div>
//                  )}
//                  </ModalBody>
// </Modal> */}
// <Modal backdrop={backdrop}
//             isOpen={selectedImage !== null}
//                 onClose={() => setSelectedImage(null)}
//                 className="h-auto w-auto"
//                 >
//                 <ModalContent>
//                 <ModalBody>
//                 {selectedImage && (
//                 <div className="overflow-auto">
//                 <div className="inline-block border border-gray-300">
//                     <img
//                         ref={imageRef}
//                         src={selectedImage.img}
//                         alt={selectedImage.img.split('/').pop()}
//                         className="w-auto h-auto transform scale-[3] origin-top-left"
//                     />
//                 </div>
//             </div>
//     )}
//                 </ModalBody>
//                 </ModalContent>
//             </Modal>

//         </div>
//     );

// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, Button, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3;
//       const scaledWidth = img.naturalWidth * 3;

//       // Mettre à jour la taille de la modal en fonction de l'image
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent style={{ width: modalSize.width, height: modalSize.height }}>
//           <ModalBody>
//             {selectedImage && (
//               <div className="overflow-auto max-w-full max-h-full">
//                 <div className="inline-block border border-gray-300">
//                   <img
//                     ref={imageRef}
//                     src={selectedImage.img}
//                     alt={selectedImage.img.split("/").pop()}
//                     className="w-auto h-auto transform scale-[3] origin-top-left"
//                   />
//                 </div>
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, Button, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3;
//       const scaledWidth = img.naturalWidth * 3;

//       // Mettre à jour la taille de la modal en fonction de l'image
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent style={{ width: modalSize.width, height: modalSize.height, padding: "20px" }}>
//           <ModalBody className="relative" style={{ padding: "20px" }}>
//             {selectedImage && (
//               <div className="overflow-auto max-w-full max-h-full">
//                 <div className="inline-block border border-gray-300">
//                   <img
//                     ref={imageRef}
//                     src={selectedImage.img}
//                     alt={selectedImage.img.split("/").pop()}
//                     className="w-full h-auto transform scale-[3] object-contain"
//                     style={{ maxHeight: "90vh" }} // Limiter la hauteur de l'image
//                   />
//                 </div>
//               </div>
//             )}
//             <button
//               className="absolute top-2 right-2 text-black bg-white rounded-full p-2 shadow-md"
//               onClick={() => setSelectedImage(null)}
//             >
//               &times;
//             </button>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3;
//       const scaledWidth = img.naturalWidth * 3;

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//           }}
//         >
//           <ModalBody className="relative p-0 m-0"> {/* Retirer tout padding et marge */}
//             {selectedImage && (
//               <div className="overflow-auto max-w-full max-h-full">
//                 <div className="inline-block">
//                   <img
//                     ref={imageRef}
//                     src={selectedImage.img}
//                     alt={selectedImage.img.split("/").pop()}
//                     className="w-full h-auto transform scale-[3] object-contain" // Garder scale(3)
//                   />
//                 </div>
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3;
//       const scaledWidth = img.naturalWidth * 3;

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0" style={{ overflow: "hidden" }}> {/* Retirer tout padding et scrolling */}
//             {selectedImage && (
//               <div className="inline-block">
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   className="w-full h-auto transform scale-[3] object-contain" // Garder scale(3)
//                   style={{ display: "block", width: modalSize.width, height: modalSize.height }} // Ajuster la taille
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3; // Hauteur multipliée par 3
//       const scaledWidth = img.naturalWidth * 3;   // Largeur multipliée par 3

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0" style={{ overflow: "hidden" }}>
//             {selectedImage && (
//               <div className="flex justify-center items-center" style={{ transform: "scale(3)", transformOrigin: "top left", height: modalSize.height, width: modalSize.width }}>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   className="w-auto h-auto" // Garder l'image à sa taille naturelle
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// GOOOOD
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3; // Hauteur multipliée par 3
//       const scaledWidth = img.naturalWidth * 3;   // Largeur multipliée par 3

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0" style={{ overflow: "hidden", height: modalSize.height }}>
//             {selectedImage && (
//               <div style={{ transform: "scale(3)", transformOrigin: "top left", width: selectedImage.img.split("/").pop(), height: selectedImage.img.split("/").pop() }}>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   className="w-auto h-auto" // Garder l'image à sa taille naturelle
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3; // Hauteur multipliée par 3
//       const scaledWidth = img.naturalWidth * 3;   // Largeur multipliée par 3

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth + 40}px`, // Ajoute une marge de 20px à droite
//         height: `${scaledHeight + 40}px`, // Ajoute une marge de 20px en haut
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//             marginTop: "20px", // Ajoute de l'espace en haut
//             marginRight: "20px", // Ajoute de l'espace à droite
//           }}
//         >
//           <ModalBody className="relative p-0 m-0" style={{ overflow: "hidden", height: modalSize.height }}>
//             {selectedImage && (
//               <div style={{ transform: "scale(3)", transformOrigin: "top left" }}>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   className="w-auto h-auto" // Garder l'image à sa taille naturelle
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3; // Hauteur multipliée par 3
//       const scaledWidth = img.naturalWidth * 3;   // Largeur multipliée par 3

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0" style={{ overflow: "hidden", height: modalSize.height }}>
//             {selectedImage && (
//               <div style={{ transform: "scale(3)", transformOrigin: "top left", width: selectedImage.img.split("/").pop(), height: selectedImage.img.split("/").pop() }}>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   className="w-auto h-auto" // Garder l'image à sa taille naturelle
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3; // Hauteur multipliée par 3
//       const scaledWidth = img.naturalWidth * 3;   // Largeur multipliée par 3

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${Math.min(scaledWidth, window.innerWidth * 0.9)}px`, // Limiter la largeur à 90% de la fenêtre
//         height: `${Math.min(scaledHeight, window.innerHeight * 0.9)}px`, // Limiter la hauteur à 90% de la fenêtre
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0" style={{ overflow: "hidden", height: modalSize.height }}>
//             {selectedImage && (
//               <div style={{ transform: "scale(3)", transformOrigin: "top left" }}>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   style={{
//                     width: '100%', // S'assurer que l'image utilise toute la largeur de la modal
//                     height: 'auto', // Ajuste la hauteur automatiquement
//                     maxHeight: "none", // Permettre à l'image de s'étendre sans limite de hauteur
//                   }}
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3; // Hauteur multipliée par 3
//       const scaledWidth = img.naturalWidth * 3;   // Largeur multipliée par 3

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0">
//             {selectedImage && (
//               <div style={{ transform: "scale(3)", transformOrigin: "top left" }}>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   style={{
//                     width: `${selectedImage.img.naturalWidth}px`, // Afficher à la largeur originale
//                     height: `${selectedImage.img.naturalHeight}px`, // Afficher à la hauteur originale
//                   }}
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const scaledHeight = img.naturalHeight * 3; // Hauteur multipliée par 3
//       const scaledWidth = img.naturalWidth * 3;   // Largeur multipliée par 3

//       // Mettre à jour la taille de la modal en fonction de l'image avec scale(3)
//       setModalSize({
//         width: `${scaledWidth}px`,
//         height: `${scaledHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0">
//             {selectedImage && (
//               <div style={{ transform: "scale(3)", transformOrigin: "top left" }}>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   style={{
//                     width: `${selectedImage.img.naturalWidth}px`, // Afficher à la largeur originale
//                     height: `${selectedImage.img.naturalHeight}px`, // Afficher à la hauteur originale
//                   }}
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const originalHeight = img.naturalHeight * 3;
//       const originalWidth = img.naturalWidth * 3;

//       let newWidth = originalWidth;
//       let newHeight = originalHeight;

//       // Si l'image est en mode paysage (width > height), augmenter la largeur de 1,6 fois
//       if (img.naturalWidth > img.naturalHeight) {
//         newWidth = originalWidth * 1.6;
//       }

//       // Mettre à jour la taille de la modal
//       setModalSize({
//         width: `${newWidth}px`,
//         height: `${newHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0">
//             {selectedImage && (
//               <div>
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   style={{
//                     width: `${modalSize.width}`, // Utiliser la largeur calculée
//                     height: `${modalSize.height}`, // Utiliser la hauteur calculée
//                   }}
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const originalHeight = img.naturalHeight * 3;
//       const originalWidth = img.naturalWidth * 3;

//       let newWidth = originalWidth;
//       let newHeight = originalHeight;

//       // Si l'image est en mode paysage (width > height), augmenter la largeur de 1,6 fois
//       if (img.naturalWidth > img.naturalHeight) {
//         newWidth = originalWidth * 1,6+100;
//         newHeight = (img.naturalHeight * 2+100); // Ajuster la hauteur proportionnellement
//       }

//       // Mettre à jour la taille de la modal
//       setModalSize({
//         width: `${newWidth}px`,
//         height: `${newHeight}px`,
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0">
//             {selectedImage && (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: "100%",
//                 }}
//               >
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   style={{
//                     width: "100%",  // Utilise 100% de la largeur disponible
//                     height: "auto", // Garde les proportions de l'image
//                     objectFit: "contain", // Assure que l'image garde ses proportions
//                   }}
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

// OK, meme si les imags beaucoup plus haute que large on un agrandissement bizarre dans la modale

import { useEffect, useRef, useState } from 'react';
import { eState } from '../state';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import { EyeIcon } from '@heroicons/react/24/outline';

export function Check(param: {
  current: eState;
  nextState: eState;
  setCurrent: (etate: eState) => void;
  onCancel: () => void;
}) {
  const { current, nextState, setCurrent } = param;
  const [images, setImages] = useState<Array<{ img: string; multiple: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<{
    img: string;
    multiple: string;
  } | null>(null);
  const [backdrop, setBackdrop] = useState<'opaque' | 'blur' | 'transparent' | undefined>('opaque');

  if (current != eState.check) {
    return <></>;
  }

  const jsonfiles =
    '/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json';

  useEffect(() => {
    fetch(jsonfiles)
      .then(response => response.json())
      .then(data => setImages(data));
  }, []);

  const imageRef = useRef<HTMLImageElement>(null);
  const [modalSize, setModalSize] = useState({ width: 'auto', height: 'auto' });

  useEffect(() => {
    if (selectedImage && imageRef.current) {
      const img = imageRef.current;
      const originalHeight = img.naturalHeight * 3;
      const originalWidth = img.naturalWidth * 3;

      let newWidth = originalWidth;
      let newHeight = originalHeight;

      // Si l'image est en mode paysage (width > height), augmenter la largeur de 1,6 fois
      if (img.naturalWidth > img.naturalHeight) {
        newWidth = originalWidth * 1.6; // Agrandir la largeur
        newHeight = img.naturalHeight * 2; // Ajuster la hauteur proportionnellement
      }

      // Mettre à jour la taille de la modal
      setModalSize({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
    }
  }, [selectedImage]);

  if (current != eState.check) {
    return <></>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between bg-black-100"
          >
            <div className="absolute top-2 left-2">
              <EyeIcon className="h-5 w-5 cursor-pointer" onClick={() => setSelectedImage(image)} />
            </div>
            <span
              className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold ${
                parseFloat(image.multiple) < 30
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {image.multiple}%
            </span>
            <div className="flex-grow flex items-end justify-center">
              <img
                src={image.img}
                alt={image.img.split('/').pop()}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-xs truncate mt-2">{image.img.split('/').pop()}</p>
          </div>
        ))}
      </div>

      <Modal
        backdrop={backdrop}
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        className="h-auto w-auto"
      >
        <ModalContent
          style={{
            width: modalSize.width,
            height: modalSize.height,
            padding: '0', // Supprimer le padding autour de l'image
            overflow: 'hidden', // Empêcher le défilement
          }}
        >
          <ModalBody className="relative p-0 m-0">
            {selectedImage && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <img
                  ref={imageRef}
                  src={selectedImage.img}
                  alt={selectedImage.img.split('/').pop()}
                  style={{
                    width: 'auto', // Garder la largeur auto pour respecter les proportions
                    height: '100%', // Garde les proportions de l'image
                    objectFit: 'contain', // Assure que l'image garde ses proportions
                  }}
                />
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

// test avec marge ne fonctionne pas
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { eState } from "./state";
// import { Modal, ModalBody, ModalContent } from "@heroui/react";
// import { EyeIcon } from "@heroicons/react/24/outline";

// export function Check(param: {
//   current: eState;
//   nextState: eState;
//   setCurrent: (etate: eState) => void;
//   onCancel: () => void;
// }) {
//   const { current, nextState, setCurrent } = param;
//   const [images, setImages] = useState<
//     Array<{ img: string; multiple: string }>
//   >([]);
//   const [selectedImage, setSelectedImage] = useState<{
//     img: string;
//     multiple: string;
//   } | null>(null);
//   const [backdrop, setBackdrop] = useState<
//     "opaque" | "blur" | "transparent" | undefined
//   >("opaque");

//   if (current != eState.check) {
//     return <></>;
//   }

//   const jsonfiles =
//     "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes.json";

//   useEffect(() => {
//     fetch(jsonfiles)
//       .then((response) => response.json())
//       .then((data) => setImages(data));
//   }, []);

//   const imageRef = useRef<HTMLImageElement>(null);
//   const [modalSize, setModalSize] = useState({ width: "auto", height: "auto" });

//   useEffect(() => {
//     if (selectedImage && imageRef.current) {
//       const img = imageRef.current;
//       const originalHeight = img.naturalHeight * 3;
//       const originalWidth = img.naturalWidth * 3;

//       let newWidth = originalWidth;
//       let newHeight = originalHeight;

//       // Si l'image est en mode paysage (width > height), augmenter la largeur de 1,6 fois
//       if (img.naturalWidth > img.naturalHeight) {
//         newWidth = originalWidth * 1.6 ; // Agrandir la largeur
//         newHeight = img.naturalHeight * 2; // Ajuster la hauteur proportionnellement
//       }

//       // Ajouter des marges autour de la modal
//       const margin = 50; // Par exemple, 50 pixels de marge

//       // Mettre à jour la taille de la modal avec des marges
//       setModalSize({
//         width: `${newWidth + margin}px`,  // Ajouter la marge à la largeur
//         height: `${newHeight + margin}px`, // Ajouter la marge à la hauteur
//       });
//     }
//   }, [selectedImage]);

//   if (current != eState.check) {
//     return <></>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Images</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border rounded-lg overflow-hidden shadow-lg p-2 h-64 flex flex-col justify-between"
//           >
//             <div className="absolute top-2 right-2">
//               <EyeIcon
//                 className="h-5 w-5 cursor-pointer"
//                 onClick={() => setSelectedImage(image)}
//               />
//             </div>
//             <span
//               className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold ${
//                 parseFloat(image.multiple) < 30
//                   ? "bg-red-500 text-white"
//                   : "bg-green-500 text-white"
//               }`}
//             >
//               {image.multiple}%
//             </span>
//             <div className="flex-grow flex items-end justify-center">
//               <img
//                 src={image.img}
//                 alt={image.img.split("/").pop()}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>
//             <p className="text-xs truncate mt-2">{image.img.split("/").pop()}</p>
//           </div>
//         ))}
//       </div>

//       <Modal
//         backdrop={backdrop}
//         isOpen={selectedImage !== null}
//         onClose={() => setSelectedImage(null)}
//         className="h-auto w-auto"
//       >
//         <ModalContent
//           style={{
//             width: modalSize.width,
//             height: modalSize.height,
//             padding: "0", // Supprimer le padding autour de l'image
//             overflow: "hidden", // Empêcher le défilement
//           }}
//         >
//           <ModalBody className="relative p-0 m-0">
//             {selectedImage && (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: "100%",
//                 }}
//               >
//                 <img
//                   ref={imageRef}
//                   src={selectedImage.img}
//                   alt={selectedImage.img.split("/").pop()}
//                   style={{
//                     width: "auto", // Garder la largeur auto pour respecter les proportions
//                     height: "100%", // Garde les proportions de l'image
//                     objectFit: "contain", // Assure que l'image garde ses proportions
//                   }}
//                 />
//               </div>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }
