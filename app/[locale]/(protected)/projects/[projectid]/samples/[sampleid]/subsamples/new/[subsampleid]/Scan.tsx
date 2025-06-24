"use client";

import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
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



export function Scan (params:{
    background?: string, 
    project: Project|any, 
    sample: Sample, 
    subsample: SubSample, 
    onChange:(fileUrl:any) => Promise<any>,
    onValid:()=>void
}) {


    let {
         background, 
          project, sample, subsample, 
           onChange, 
        onValid
         } = params



    const showImage = () => {

      console.debug(":Scan::showImage: background :",background)
        return (
        <>
            <div className="flex-row">
              <p>background : {background}</p>
              <MyImage src={background} />
            </div>

        </>
        )
    }

    return (
      <>
        <Card className="inline-block size-full" data-testid="ScanCard">
          <CardBody>
              <Loader project={project} onChange={onChange} />
          </CardBody>

          { showImage() }

          <CardFooter className="flex flex-row-reverse py-3">

            <Button
              color="primary"
              variant="solid"
              data-testid="newProjectBtn"
              onPress={() => {
                onValid()
              }}
            >
              Validate
            </Button>

          </CardFooter>
        </Card>
      </>
    );
  };
