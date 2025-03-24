"use client";

import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
// import { eState } from "./state";
import { Project, Sample, SubSample } from "@/app/api/network/interfaces";
// import { Loader, MyLoaderProps } from "./Loader";
import { Loader } from "./Loader";
import { MyImage } from "@/components/myImage";
// import { addScan } from "@/app/actions/scan-actions";
// import { useState } from "react";
// import { pathToRealStorage, pathToSessionStorage } from "@/lib/gateway";
// import { converttiff2jpg } from "@/app/api/convert";


const imagePlaceholder : string = "/images/placeholder-image.jpg";

// const isTiff = (fileUrl: string) : boolean => {
//   console.log("fileUrl: ", fileUrl)
//   return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")

// }


// const Scan = (step: number = 1, nextState: eState) => {
export function Scan (params:{
    // current:eState, 
    // nextState: eState, 
    // scan?: string, 
    background: string, 
    // scanId: string, 
    project: Project|any, 
    sample: Sample, 
    subsample: SubSample, 
    // setCurrent:(state:eState)=>void, 
    // onCancel:()=>void,
    onChange:(fileUrl:any) => Promise<any>,
    // onClick:()=>void
    onValid:()=>void
}) {

  // const noError : Array<any>= []
  // const [error, setError] = useState(noError);

  // const [scanData, setScanData] = useState({
  //   image: false as string|boolean,
  //   background: imagePlaceholder,
  //   scan: undefined as string | undefined,
  // });


    let {
        // current, nextState, 
        // scan,
         background, 
        //  scanId, 
          project, sample, subsample, 
        //   setCurrent, 
        //   onCancel,
           onChange, 
        //    onClick
        onValid
         } = params

      //    const onChange = async (fileUrl: any) => {
      //     try {
      //         // setScan(fileUrl.url);
      //         if ( scanData.scan !== fileUrl.url) {
      //             setScanData({ ...scanData, scan: fileUrl.url });
      //             if (isTiff(fileUrl.url)) {
      //                 const data = { src: pathToRealStorage(fileUrl.url) };
      //                 const response = await converttiff2jpg(data);
      //                 const imageUrl = await response.text();
      //                 const localPath = pathToSessionStorage(imageUrl.replace(/"/g, ""), "/");
      //                 if ( scanData.background !== localPath ) {
      //                     // setBackground(localPath);
      //                     console.debug("scanData.background !== localPath ");
      //                     setScanData(prevState => ({ ...scanData, background: localPath }))
      //                 }
              
      //             let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
      //             console.debug("Calling addScan with:", furl);
      //             const scanResponse = await addScan(furl);
      //             if  ( scanResponse){
      //                 console.debug("Scan response:", scanResponse);

      //                 // setImage(scanResponse.id);
      //                 if (scanData.image !== scanResponse.id) {
      //                     setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
      //                 }
      //                 console.log("Go To the next page");
      //             }
      //             else{
      //                 console.error("Error adding scan");
      //             }
      //         } else {
      //             // setBackground(fileUrl.url);
      //             if ( scanData.background !== fileUrl.url ) {
      //                 setScanData(prevState => ({ ...scanData, background: fileUrl.url }))
      //             }
      //             let furl = { ...fileUrl, url: pathToRealStorage(fileUrl.url) };
      //             console.debug("2 Calling addScan with:", furl);
      //             const scanResponse = await addScan(furl);
      //             if  ( scanResponse){
      //                 console.debug("2 Scan response:", scanResponse);
      //                 // setImage(scanResponse.id);
      //                 if (scanData.image !== scanResponse.id) {
      //                     setScanData(prevState => ({ ...scanData, image: scanResponse.id }));
      //                 }
      //                 console.log("Go To the next page 2");
      //             } else {
      //                 console.error("Error adding scan 2");
      //             }
      //         }
      //     }
      // }
      // catch (error) {
      //         console.error("Error in onChange: ", error);
      //         // setError(error as any[]);
      //     }
      // };


// if (current != eState.scan1) {
//       return <></>;
//     }

    // const [background, setBackground] = useState(imagePlaceholder)


    // const loaderProps : MyLoaderProps = {
    //   project: project,
    //   sample,
    //   subsample,
    //   onChange: onChange,
    // };

    const showImage = () => {
        // if (isError) { return <></> }

        return (
        <>
            <div className="flex-row">
              <p>background : {background}</p>
              {/* <Image
                className="height-auto"
                src={background}
                alt="uploaded image"
                height={446}
              /> */}
              <MyImage src={background} />
            </div>


            <Button
            //   disabled={isError || isLoading || !image}
              color="primary"
              variant="solid"
              data-testid="newProjectBtn"
              onPress={() => {
                // if (current == eState.scan1) {
                //   console.debug("go to Process");
                // //   setBackground(imagePlaceholder)
                //   setCurrent(nextState);
                // } else {
                //   console.debug("go to onClick");
                // //   setBackground(imagePlaceholder)
                //   onClick();
                // }
                onValid()
              }}
            >
              Validate
            </Button>
        </>
        )
    }

    return (
      <>
        {/* <h3>Scan {step}</h3> */}
        <Card className="inline-block size-full" data-testid="ScanCard">
          <CardBody>
              {/* <Loader project={project} sample={sample} subsample={subsample} onChange={onChange} /> */}
              <Loader project={project} onChange={onChange} />
              {/* <Loader props={loaderProps} /> */}
          </CardBody>

          <CardFooter className="flex flex-row-reverse py-3">
            { showImage() }
          </CardFooter>
        </Card>
      </>
    );
  };
