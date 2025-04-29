"use client";

import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Project } from "@/app/api/network/interfaces";
import { Loader } from "../samples/[sampleid]/subsamples/new/[subsampleid]/Loader";
import { Debug } from "@/components/Debug";
import { MyImage } from "@/components/myImage"; 
import { useEffect, useState } from "react";
import { ErrorComponent } from "@/components/ErrorComponent";

const imagePlaceholder : string = "/images/placeholder-image.jpg";


export function Scan (params:{
    project: Project|any, 
    onChange:(fileUrl:any) => Promise<any>,
    onValid:()=>void
    scan?: string,
    textButton?:string
}) {


    let { project, onChange, onValid, scan: scanned = imagePlaceholder } = params;

    // const textButton = params.textButton || "Scan";
    const [textButton, setTextButton] = useState(params.textButton || "Validate");
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Scan.tsx::useEffect()");
        setTextButton(params.textButton || "Validate");
    }, [params.textButton]);


    async function onLoad(fileUrl:any){
        console.log("background/scan::onLoad(",fileUrl,")")
        try {
          setError(null);
          await onChange(fileUrl);
      } catch (err:any) {
          console.error("Error in Scan component:", err);
          setError(err);
      }    
    }
    
 
    return (
      <>
        <Card className="inline-block size-full" data-testid="ScanCard">
          <CardBody className="flex flex-col gap-4">
            <div className="w-full">
              <Loader project={project} onChange={onLoad} />
            </div>

            {error && <ErrorComponent error={error} />}

            <div className="w-full mb-4">
              <MyImage
                // className="height-auto"
                src={scanned}
                alt="uploaded image"
                // height={446}
                legend="Scan preview"
                className="max-h-[400px] object-contain"
              />
            </div>
            
            </CardBody>



          <CardFooter className="flex flex-row-reverse py-3">
            {/* {showImage(scanned)} */}
            {/* <div className="flex-row"> */}


            <div className="flex justify-end w-full">
              {/* <Debug params={{scanned}} title={"Scan"} open={true} /> */}
              <Debug params={{scanned, error}} title={"Scan"} open={true} />
              <Button
                color="primary"
                variant="solid"
                data-testid="validateScanBtn"
                onPress={() => { onValid() }}
                isDisabled={scanned === imagePlaceholder || error !== null}
              >
                {/* Validate */}
                {textButton}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </>
    );
  };
