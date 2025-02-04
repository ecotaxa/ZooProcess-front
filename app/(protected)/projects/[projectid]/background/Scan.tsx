"use client";

import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Project } from "@/app/api/network/interfaces";
import { Loader } from "../samples/[sampleid]/subsamples/new/[subsampleid]/Loader";
// import { useCallback, useState } from "react";
// import file from "@/app/api/file";
import { Debug } from "@/components/Debug";
// import { useState } from "react";

// const imagePlaceholder : string = "/images/placeholder-image.jpg";

export function Scan (params:{
    project: Project|any, 
    onChange:(fileUrl:any) => Promise<any>,
    onValid:()=>void
    scan: string,
}) {


    // const [ scan, setScan] = useState<string|undefined>(undefined);
    // const [ scanned, setScan] = useState<string>(imagePlaceholder);


    // let scanned = imagePlaceholder
    // const [ scanned, setScan] = useState<string>(imagePlaceholder);

    let { project, onChange, onValid, scan: scanned } = params;

    function onLoad(fileUrl:any){

        console.log("onLoad(",fileUrl,")")

        // setScan(fileUrl)    
        // scanned = fileUrl
        // setScan(fileUrl)
        onChange(fileUrl)
    }
    
    // // const showImage = useCallback((url:string|undefined) => {
    // const showImage = useCallback((url:string) => {

    //     // if (!url) {
    //     //     return <></>;
    //     // }

    //     return (
    //     <>
    //         <div className="flex-row">
    //           <Image
    //             className="height-auto"
    //             src={url}
    //             alt="uploaded image"
    //             height={446}
    //           />
    //         </div>

    //         <Button
    //           color="primary"
    //           variant="solid"
    //           data-testid="newProjectBtn"
    //           onPress={() => { onValid() }}
    //         >
    //           Validate
    //         </Button>
    //     </>
    //     )
    // }, [onValid]);

 
    return (
      <>
        <Card className="inline-block size-full" data-testid="ScanCard">
          <CardBody>
              <Loader project={project} onChange={onLoad} />
          </CardBody>

          <CardFooter className="flex flex-row-reverse py-3">
            {/* {showImage(scanned)} */}
            <Debug params={{scanned}} title={"Scan"} open={true} />
            <div className="flex-row">
              <Image
                className="height-auto"
                src={scanned}
                alt="uploaded image"
                height={446}
              />
            </div>

            <Button
              color="primary"
              variant="solid"
              data-testid="newProjectBtn"
              onPress={() => { onValid() }}
            >
              Validate
            </Button>

          </CardFooter>
        </Card>
      </>
    );
  };
