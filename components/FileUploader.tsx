"use client";

import { Input } from "@nextui-org/input";
import Image from "next/image";
import { ChangeEvent, FC, useState } from "react";
import { Debug } from "@/components/Debug";
import { Label } from "@radix-ui/react-label";
import { Button } from "@nextui-org/button";
import { CameraIcon } from "@radix-ui/react-icons";
import { addBackground } from "@/app/api/network/zooprocess-api";
import { auth } from "@/auth";
// import { add, set } from "date-fns";
import { add } from "date-fns";
// import { image } from "@nextui-org/theme";
// import styles from "./FileUploader.module.scss";

type pageProps = {
  // props:{
      // projectid: string,
      // sampleid: string,
      // subsampleid: string,  
      instrumentId: string,
  // },
  onChange: (data:any) => void,
  // imageRGB: string,
}

// const FileUploader: FC<pageProps> = ({props,onChange}) => {
  const FileUploader: FC<pageProps> = ({instrumentId, onChange }) => {
  // const FileUploader: FC<pageProps> = ({instrumentId, onChange, imageRGB}) => {

  // const {projectid, sampleid, subsampleid, instrumentId} = props;
  // const {instrumentId} = props;

  // console.log("FileUploader: ", props);
  // console.log("projectid: ", projectid);
  // console.log("sampleid: ", sampleid);
  // console.log("subsampleid: ", subsampleid);
  
  console.log("instrumentId: ", instrumentId);
  
  const imagePlaceholder = "/images/placeholder-image.jpg";
  // const [imageUrl, setImageUrl] = useState(imagePlaceholder);
  const [imageUrl, setImageUrl] = useState(imagePlaceholder);

  // // let backgroundImage = undefined
  // if ( imageRGB ) { 
  //   // backgroundImage = image
  //   setImageUrl(imageRGB)
  // } 
  // // else {
  // //   // backgroundImage = imagePlaceholder
  // //   setImageUrl(imagePlaceholder)
  // // }

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const transmit = async (image: {url:string, instrumentId:string}) => {
    console.log("transmitting: ", image.url );
    // addBackground(image)   
    // à mettre dans la fonction qui appelle  plus besoin de passer project, sample et subsample
    // instrumentId oui pour quand il faudra attaquer le scanner avec l'API
    onChange(image)
  };

  // const isTiff = (fileUrl:string) : boolean => {
  //   console.log("fileUrl: ", fileUrl)
  //   return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")
  // }


  // ne marche pas car le fileUrl est une url locale au server que je ne peux pas transmettre au convertisseur :(
  // function printImage(fileUrl:string){

  //   setImageUrl(fileUrl);

  //   if (isTiff(fileUrl) ){
  //     const data = {
  //       src: fileUrl,
  //     }
  //     console.log("data: ", data)

  //     const server = "http://localhost:8000"
  //     const url = server + "/convert/"
  //     const response = fetch( url , {
  //       method: "POST",
  //       body: JSON.stringify(data),
  //       headers: {
  //         "Content-Type": "application/text",
  //       },
  //     })
  //     .then((response) => {
  //       console.log("response: ", response)
  //       response.text()
  //         .then((imageUrl) => {
  //           setImageUrl(imageUrl);
  //         })
  //         .catch((error) => {
  //           console.log("Cannot convert Tiff to Jpg error: ", error)
  //         })
  //     })
  //   }

  // }

  const onImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      console.warn("no file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true)
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("something went wrong, check your server console.");
        return;
      }

      console.log("res: ", res)

      const data: { fileUrl: string , filename: string } = await res.json();

      // const a = await auth()
      // const userId = a?.user.id
      // const userId = "658dd7ea24bc10a4bf1e37e2"
      // if (!userId) {
      //   console.error("no user id found")
      //   throw new Error("no user id found")
      // }
      // const instrumentId = "65c4e0994653afb2f69b11ce"

      const data2api = {
        url: data.fileUrl,
        // userId,
        instrumentId
      }
      console.log("data2api: ", data2api)
      await transmit(data2api);

      setImageUrl(data.fileUrl);
      // printImage(data.fileUrl)
    } catch (error) {
      console.error("something went wrong, check your server console. (2)");
    } finally {
      setIsUploading(false)
    }

    /** Reset file input */
    // e.target.type = "text";
    e.target.type = "file";
  };

  const ShowURL = () => {
    if (imageUrl !== imagePlaceholder) {
      return (<Label >{imageUrl}</Label>)
    }

  }

  return (

      
      <div className="flex items-center p-3">
        <div className="">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>

          <input className="mb-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                  id="file_input" type="file" 
                  name="csv" onChange={onImageFileChange}
          />
          {/* <Button onChange={onImageFileChange}><CameraIcon />Upload Scan</Button> */}
          {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">Text file only.</p> */}
          {/* <button className="border p-2" type="submit">Upload</button> */}
          <ShowURL/>
        </div>
        {/* <div className="flex-row">
          { ! isUploading && (
            <Image className="height-auto"
              src={imageUrl}
              alt="uploaded image"
              width={720}
              height={446}
              priority={true}
            />
          )}

          {isUploading && (
            <div className="pl-4">
              uploading
            </div>
          )}
        </div> */}
        <Debug params={{ imageUrl }} />

      </div>


  )

  return (
    <label
      // className={styles["file-uploader"]}
      style={{ paddingTop: `calc(100% * (${446} / ${720}))` }}
    >
      <Image
        src={imageUrl}
        alt="uploaded image"
        width={720}
        height={446}
        priority={true}
      />
      <input
        style={{ display: "none" }}
        type="file"
        onChange={onImageFileChange}
      />
    </label>
  );
}


export default FileUploader

