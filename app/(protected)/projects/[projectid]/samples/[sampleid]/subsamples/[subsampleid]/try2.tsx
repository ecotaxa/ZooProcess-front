"use client";


import SingleFileUploadForm from "@/app/(components)/SingleFileUploadForm";
import { ProjectBreadcrumbs } from "@/components/ProjectBreadcrumbs";
// import { /*Image,*/ Input } from "@nextui-org/react";
// import Image from "next/image"
import { Image, Input } from "@nextui-org/react";
import { FC, useState } from "react";

import React, { SyntheticEvent } from "react"
import axios from "axios"

interface pageProps {
    params: {
      projectid: string,
      sampleid: string
      subsampleid: string
    }
  }

// const SubsamplePage : FC<pageProps> = ({projectid,sampleid,subsampleid}) => {
const SubsamplePage : FC<pageProps> = ({params}) => {
    // console.log("NewSample params: ", params);
    // console.log("NewSample params projectid: ", params.params.projectid);
    // console.log("NewSample params sampleid: ", params.params.sampleid);
    // console.log("NewSample params sampleid: ", params.params.subsampleid);

    const {projectid,sampleid,subsampleid} = params

    console.log("NewSample params: ", params);
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
        } catch (error) {
          console.error('There was an error uploading the file', error.message)
        } finally {
          setIsUploading(false)
        }
      }
    
      const handleFileSelect = (event: any) => {
        setFile(event.target.files[0])
      }
    
    
    
    
    return (

      <div className="w-full max-w-3xl px-3 mx-auto">
      <h1 className="mb-10 text-3xl font-bold text-gray-900">
        Upload your files
      </h1>

      <h1>SubSample Scan Preview</h1>
            <div><b>project Id: </b> {projectid}</div>
            <div><b>sample Id: </b> {sampleid}</div>
            <div><b>subsample Id: </b> {subsampleid}</div>

            <ProjectBreadcrumbs list={[projectid, sampleid]} separator="/"/>

            {/* <SingleFileUploadForm/> */}
      
            <div className="flex flex-row items-center p-3">
        <form onSubmit={handleSubmit} className="mr-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
          <input className="mb-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" name="csv" onChange={handleFileSelect} />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">Text file only.</p>
          <button className="border p-2" type="submit">Upload</button>
        </form>
        {isUploading && (
          <div className="pl-4">
            uploading
          </div>
        )}
      </div>


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
