"use client";

import { Input } from "@nextui-org/input";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Debug } from "./Debug";
import { Label } from "@radix-ui/react-label";
import { Button } from "@nextui-org/button";
import { CameraIcon } from "@radix-ui/react-icons";
// import styles from "./FileUploader.module.scss";

export default function FileUploader() {
  const imagePlaceholder = "/images/placeholder-image.jpg";
  const [imageUrl, setImageUrl] = useState(imagePlaceholder);
  const [isUploading, setIsUploading] = useState<boolean>(false)

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
        console.error("something went wrong, check your console.");
        return;
      }

      console.log("res: ", res)

      const data: { fileUrl: string } = await res.json();

      setImageUrl(data.fileUrl);
    } catch (error) {
      console.error("something went wrong, check your console.");
    } finally {
      setIsUploading(false)
    }

    /** Reset file input */
    e.target.type = "text";
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
        <div className="flex-row">
          { ! isUploading && (
            <Image
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
        </div>
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