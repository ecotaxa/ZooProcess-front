"use client";


import SingleFileUploadForm from "@/app/(components)/SingleFileUploadForm";
import { ProjectBreadcrumbs } from "@/components/ProjectBreadcrumbs";

// import { auth } from "@/auth"


// import { /*Image,*/ Input } from "@nextui-org/react";
// import Image from "next/image"
import { Image, Input } from "@nextui-org/react";
import { FC, useState } from "react";

import React, { SyntheticEvent } from "react"
import axios from "axios"

// import FileUploader from "@/components/FileUploader";
import { Timeline_scan } from "@/components/timeline-scan";


interface pageProps {
    // params: {
      projectid: string,
      sampleid: string
      subsampleid: string
    // }
  }

// const SubsamplePage : FC<pageProps> = ({projectid,sampleid,subsampleid}) => {
// const SubsamplePage : FC<pageProps> = async ({params}) => {
const SubsamplePage : FC<pageProps> =  ({projectid, sampleid, subsampleid}) => {
    // console.log("NewSample params: ", params);
    // console.log("NewSample params projectid: ", params.params.projectid);
    // console.log("NewSample params sampleid: ", params.params.sampleid);
    // console.log("NewSample params sampleid: ", params.params.subsampleid);

    // const {projectid,sampleid,subsampleid} = params //.params

    // console.log("NewSample params: ", params);
    console.log("NewSample params projectid: ", projectid);
    console.log("NewSample params sampleid: ", sampleid);
    console.log("NewSample params sampleid: ", subsampleid);


      const [file, setFile] = useState("")
      const [isUploading, setIsUploading] = useState<boolean>(false)
    
      const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()
        setIsUploading(true)
    
        const formData = new FormData()
        formData.append("file", file)
    
        try {
          await axios.post('/api/upload2', formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        } catch (error:any) {
          console.error('There was an error uploading the file', error.message)
        } finally {
          setIsUploading(false)
        }
      }
    
      const handleFileSelect = (event: any) => {
        setFile(event.target.files[0])
      }
    

    // const session = await auth()
    
    return (

      <div className="w-full max-w-3xl px-3 mx-auto">
      <h1 className="mb-10 text-3xl font-bold text-gray-900">
        SubSample Info
      </h1>

      <Timeline_scan current={2} />
      <h1>SubSample Info</h1>
            <div><b>project Id: </b> {projectid}</div>
            <div><b>sample Id: </b> {sampleid}</div>
            <div><b>subsample Id: </b> {subsampleid}</div>
            {/* <div><b>user Id: </b> {session?.user}</div> */}

            {/* <ProjectBreadcrumbs list={[projectid, sampleid]} separator="/"/> */}

            {/* <FileUploader /> */}
        
      </div>
    )




    // return (
    //     <>
    //         <h1>SubSample Scan Preview</h1>
    //         <div><b>project Id: </b> {projectid}</div>
    //         <div><b>sample Id: </b> {sampleid}</div>
    //         <div><b>subsample Id: </b> {subsampleid}</div>

    //         <ProjectBreadcrumbs list={[projectid, sampleid]} separator="/"/>
    //         {/* <ProjectBreadcrumbs list={[projectid,sampleid,subsampleid]} separator="/" /> */}

    //         <form action="">
    //           <Input type="file" name="file" placeholder="Your scan" />
    //         </form>

    //         <Image
    // //   width={300}
    //   alt="NextUI hero Image"
    // // src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
    // src="http://photos.galvagno.info/images/paroxantus.jpg"
    // // src="/images/hero-card-complete.jpeg"
    // // src="/images/background.jpg"
    // // src="/images/Sipho.jpg"
    // />   

    //     </>

    // )

}

export default SubsamplePage
