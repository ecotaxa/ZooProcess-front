"use client";

import { Input } from "@heroui/input";
import Image from "next/image";
import { ChangeEvent, FC, useState, useRef } from "react";
import { Debug } from "@/components/Debug";
import { Label } from "@radix-ui/react-label";
import { Button } from "@heroui/button";
import { CameraIcon } from "@radix-ui/react-icons";
import { add } from "date-fns";
import { Progress } from "@heroui/react";
// import { Progress } from "@/components/ui/progress"; // Assurez-vous d'importer votre composant Progress de HeroUI

type pageProps = {
  projectId: string,
  sampleId?: string,
  subsampleId?: string,  
  instrumentId: string,
  onChange: (data:any) => void,
}

const FileUploader: FC<pageProps> = (props) => {
  console.log("FileUploader(props):", props);
  const {instrumentId, projectId, onChange} = props;
  console.log("FileUploader instrumentId: ", instrumentId);
  
  const imagePlaceholder = "/images/placeholder-image.jpg";
  const [imageUrl, setImageUrl] = useState(imagePlaceholder);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const transmit = async (image: {url:string, instrumentId:string, projectId:string}) => {
    console.log("transmitting: ", image.url);
    onChange(image);
  };

  const onImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("no file was chosen");
      return;
    }

    const file = fileInput.files[0];
    setFileSize(file.size);
    
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(0);

    // Utiliser XMLHttpRequest au lieu de fetch pour suivre la progression
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
        // console.log(`Upload progress: ${percentComplete}%`);
      }
    });

    xhr.addEventListener("load", async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          
          const data2api = {
            url: data.fileUrl,
            projectId,
            instrumentId
          };
          
          // console.log("data2api: ", data2api);
          await transmit(data2api);
          setImageUrl(data.fileUrl);
        } catch (error) {
          console.error("Error processing response:", error);
        }
      } else {
        console.error("Upload failed with status:", xhr.status);
      }
      setIsUploading(false);
    });

    xhr.addEventListener("error", () => {
      console.error("Upload failed");
      setIsUploading(false);
    });

    xhr.addEventListener("abort", () => {
      console.log("Upload aborted");
      setIsUploading(false);
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);

    /** Reset file input */
    e.target.type = "file";
  };

  const ShowURL = () => {
    if (imageUrl !== imagePlaceholder) {
      return (<Label>{imageUrl}</Label>);
    }
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  return (
    <div className="flex flex-col p-3">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
          Upload file
        </label>

        <input 
          className="mb-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
          id="file_input" 
          type="file" 
          name="csv" 
          onChange={onImageFileChange}
          disabled={isUploading}
          ref={fileInputRef}
        />
        
        <ShowURL />
      </div>
      
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
          {fileSize !== null && (
            <div className="text-xs mt-1 text-gray-500">
              File size: {formatFileSize(fileSize)}
            </div>
          )}
        </div>
      )}
      
      {/* <Debug params={{ imageUrl, uploadProgress, fileSize }} open={true} /> */}
      <div className="mb-16"></div>
    </div>
  );
};

export default FileUploader;
