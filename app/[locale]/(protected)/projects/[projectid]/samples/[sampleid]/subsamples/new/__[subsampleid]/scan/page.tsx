// obsolette
// // "use client";

// import { Debug } from "@/components/Debug"
// import { Timeline_scan } from "@/components/timeline-scan";
// import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
// import { FC, useState } from "react"
// import FileUploader from "@/components/FileUploader";
// import { useRouter } from "next/navigation";
// import { useProject } from "@/app/api/projects";
// import { MySpinner } from "@/components/mySpinner";
// import { ErrorComponent } from "@/components/ErrorComponent";
// import { addBackground } from "@/app/api/network/zooprocess-api";

// import { MyImage } from "@/components/myImage";
// import { tree } from "next/dist/build/templates/app-page";

// import {pathToRealStorage, pathToSessionStorage}  from "@/lib/gateway"

// type pageProps = {
//     params:{
//         projectid: string,
//         sampleid: string,
//         subsampleid: string,
//     }
// }

// const ScanPage : FC<pageProps> = ({params}) => {

//     const navigate = useNavigate();
//     const {projectid, sampleid, subsampleid} = params;
//     const {project, isError, isLoading} = useProject(projectid);
//     const [image , setImage] = useState(false);
//     const imagePlaceholder = "/images/placeholder-image.jpg";
//     const [background, setBackground] = useState(imagePlaceholder)
//     // const [imageRGB , setImageRGB] = useState("");

//     const onClick = () => {
//         console.log("validate scan")
//         if ( image ) {
//             const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${subsampleid}/process/?image=${image}`
//             console.log("path: " , path)
//             navigate(path)
//         }
//     };

//     const isTiff = (fileUrl:string) : boolean => {
//         console.log("fileUrl: ", fileUrl)
//         // return true
//         return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")

//     }

//     const onChange = async (fileUrl:any) => {
//         console.log("New scan onChange:", fileUrl)

//         if (isTiff(fileUrl.url)){
//             const data = {
//                 src: pathToRealStorage(fileUrl.url),
//                 dst: pathToRealStorage(fileUrl.url + ".jpg"),
//             }

//             // const data_test = {
//             //     "src": "/Users/sebastiengalvagno/Drives/18-03-2024/medsea_mesocosme_wp220130310_c3_d2_raw_1-1710751210823-978326589.tif"
//             // }

//             console.log("data: ", data)

//             // const server = "http://localhost:8000"
//             // const server = "http://zooprocess.imev-mer.fr:8000"
//             const server = process.env.API_TOOLS_SERVER;
//             const url = server + "/convert/"
//             console.error("url: ", url)
//             console.error("data: ", data)
//             const response = await fetch( url , {
//                 method: "POST",
//                 body: JSON.stringify(data),
//                 // body: data_test,
//                 headers: {
//                     "Content-Type": "application/text",
//                     "Access-Control-Allow-Origin":"no-cors"
//                 },
//             })
//             .then((response) => {
//                 if (response.ok) {
//                     console.log("response: ", response)
//                     response.text()
//                     .then((imageUrl) => {
//                         // setImageUrl(imageUrl);
//                         console.log("imageUrl: ", imageUrl)
//                         const localPath = pathToSessionStorage(imageUrl)
//                         console.log("localPath: ", localPath)
//                         setBackground(localPath)
//                     })
//                     .catch((error) => {
//                         console.log("Cannot convert Tiff to Jpg error: ", error)
//                     })
//                 } else {
//                     console.error("Resp NOK", response.status)
//                     if ( response.status == 422){
//                         console.error("The server do not accept your connection")
//                         console.error("Can't connect: ", response)
//                     } else {
//                         console.error("Cannot convert Tiff to Jpg error: ", response)
//                     }
//                 }
//             })
//         } else {
//             setBackground(fileUrl.url)
//         }

//         // const stringifiedData = useMemo(() => JSON.stringify(value, null, 2), [value]);
//         // stringifiedData = JSON.stringify(value, null, 2);

//         // POUR AFFICHAGE DEBUG
//         // setData(JSON.stringify(value, null, 2))
//         // console.log("App onChange:", stringifiedData);

//         return await addBackground(fileUrl)
//         .then((response) => {
//             console.log("response: ", response)
//             setImage(response.id)
//             console.log("Go To the next page" )
//             // navigate(`${response.id}`)

//             // setImageRGB("/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_raw/dyfamed_20230111_100m_d1_raw_1.jpg")
//         })
//         .catch((error) => {
//             return Promise.reject(error)
//         })
//     }

//     const Loader = () => {
//         if ( isLoading ) { return <MySpinner /> }
//         if ( isError ) { return <ErrorComponent  error={isError}/> }

//         console.log("project: ", project)

//         const props = {
//             // projectid: projectid,
//             // sampleid: sampleid,
//             // subsampleid: subsampleid,
//             instrumentId: project.instrumentId,
//         }

//         return (
//             <>
//                 <Debug params={project}/>
//                 <div><b>instrument Id: </b> {project.instrumentId}</div>
//                 <Debug params={props}/>
//                 <FileUploader instrumentId={project.instrumentId}  onChange={onChange} />
//                 {/* <FileUploader instrumentId={project.instrumentId} image={imageRGB} onChange={onChange} /> */}
//             </>
//         )
//     }

//     return (
//         <>
//             <Debug params={params}/>

//             <Timeline_scan current={2} />

//             <Card className="inline-block size-full"
//                 data-testid="projectCard"
//                 >
//                 <CardBody>
//                     <div><b>project Id: </b> {projectid}</div>
//                     <div><b>sample Id: </b> {sampleid}</div>
//                     <div><b>subsample Id: </b> {subsampleid}</div>

//                     <Loader />

//                 </CardBody>

//                 <CardFooter className="flex flex-row-reverse py-3">
//                 <div className="flex-row">
//           {/* { ! isUploading && ( */}
//             <Image className="height-auto"
//             //   src={imageUrl}
//               src={background}
//               alt="uploaded image"
//               width={720}
//               height={446}
//             //   priority={true}
//             />
//           {/* )} */}

//           {/* {isUploading && (
//             <div className="pl-4">
//               uploading
//             </div> */}
//           {/* )} */}
//         </div>

//                     <Button
//                         disabled={ isError || isLoading || !image }
//                         color="primary"
//                         // showAnchorIcon
//                         variant="solid"
//                         data-testid="newProjectBtn"
//                         // >Scan {actions[nextAction(action)]}</Button>
//                         onPress={onClick}
//                     >Validate</Button>
//                 </CardFooter>

//             </Card>

//             {/* <hr/>
//             <h3>absolute</h3>
//             <MyImage src="/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_200m_d1_1/multiples_to_separate/mask/dyfamed_20230111_200m_d1_1_173_mask.png" />
//             <h3>public</h3>
//             <Image src="/uploads/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_100m_d1_1/multiples_to_separate/result/dyfamed_20230111_100m_d1_1_7.jpg" />
//             <h3>images</h3>
//             <Image src="/images/dyfamed_20230111_100m_d1_1_7.jpg"/>
//             <Image src="/uploads_local/08-02-2024/hervia_2-1707382311642-714881819.jpeg" />
//             <Image src="/uploads/thuridille-1707404384236-511392864.jpeg" /> */}
//         </>
//     )

// }

// export default ScanPage;
