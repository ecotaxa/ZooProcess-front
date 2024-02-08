"use client";


import SingleFileUploadForm from "@/app/(components)/SingleFileUploadForm";
import { ProjectBreadcrumbs } from "@/components/ProjectBreadcrumbs";
// import { /*Image,*/ Input } from "@nextui-org/react";
// import Image from "next/image"
import { Image, Input } from "@nextui-org/react";
import { FC, useState } from "react";


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


  
    // export default function PrivatePage(props) {
      const [image, setImage] = useState(null);
      const [createObjectURL, setCreateObjectURL] = useState(null);
    
      const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
    
          setImage(i);
          setCreateObjectURL(URL.createObjectURL(i));
        }
      };
    
      const uploadToServer = async (event) => {
        const body = new FormData();
        body.append("file", image);
        const response = await fetch("/api/file", {
          method: "POST",
          body
        });
      };
    
      return (
        <div>
          <div>
            <img src={createObjectURL} />
            <h4>Select Image</h4>
            <input type="file" name="myImage" onChange={uploadToClient} />
            <button
              className="btn btn-primary"
              type="submit"
              onClick={uploadToServer}
            >
              Send to server
            </button>
          </div>
        </div>
      );
    
    
    
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

            <SingleFileUploadForm/>
      
    </div>

    )




    return (
        <>
            <h1>SubSample Scan Preview</h1>
            <div><b>project Id: </b> {projectid}</div>
            <div><b>sample Id: </b> {sampleid}</div>
            <div><b>subsample Id: </b> {subsampleid}</div>

            <ProjectBreadcrumbs list={[projectid, sampleid]} separator="/"/>
            {/* <ProjectBreadcrumbs list={[projectid,sampleid,subsampleid]} separator="/" /> */}

            <form action="">
              <Input type="file" name="file" placeholder="Your scan" />
            </form>

            <Image
    //   width={300}
      alt="NextUI hero Image"
    // src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
    src="http://photos.galvagno.info/images/paroxantus.jpg"
    // src="/images/hero-card-complete.jpeg"
    // src="/images/background.jpg"
    // src="/images/Sipho.jpg"
    />   

        </>

    )

}

export default SubsamplePage
