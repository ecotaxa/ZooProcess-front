"use client";

import { Suspense } from "react";
// import AsyncDrriveComponents from "./AsyncDriveComponents";
import AsyncAuthComponent from '../../components/AsyncDriveComponents'
import Drives from "@/components/drives";



const onChange = (value:any) => {
    console.log("change value:", value)
}



const testDrives = () => {
 
  const items = {
    id: "select",
    name: "name",
    value: "",
    placeholder: "placeholder",
    label: "label",
    required: true,
    choice: [],
    onChange: (name:string,value:string)=>{return ""}
  }

    return (
        <>
            <Drives {...items}/>
        </>
    )


}

export default testDrives;

