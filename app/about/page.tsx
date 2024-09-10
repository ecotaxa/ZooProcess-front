"use client"


// import { title } from "@/components/primitives";
// import { Timeline_scan } from "@/components/timeline-scan";
// import { Card, CardBody, CardFooter, Input, Link, Select, SelectItem, Spinner, Switch } from "@nextui-org/react";

// import ArcticMap from '@/components/ArcticMap';
import MapComponent from "@/components/MapComponent";
// import Planisfer from "@/components/Planisfer";
import { useEffect, useRef, useState } from "react";
// import AntarcticMap from "@/components/AntarcticMap";


const startCoords :[number,number] = [43.3, 7.4]    
const endCoords :[number,number] = [41.4, 7.4]

function handleCoordsChange(start: [number,number], end :[number,number]|void){
    console.log("handleCoordsChange", start, end)
}

type Coord =  [number,number]

export default function AboutPage() {

    const initialStartCoords :Coord = [43.3, 7.1]
    const initialEndCoords :Coord = [41.3, 8.1]

    const onCoordsChange = (start: Coord, end :Coord|void) : any => {
        console.log("onCoordsChange", start, end)
    }
 
	return (
        <div className="w-screen max-w-none overflow-x-hidden px-6" >
 
        <MapComponent start={initialStartCoords} end={initialEndCoords} onCoordsChange={onCoordsChange} />

        </div>
	);
}


// 	<h1 className={title()}>About</h1>
		// 	<Spinner/>
		// 	<div className="flex flex-col gap-4">
        //     <Link href={"/blog/123"} className="bg-green-400 w-fit rounded-lg p-4">
        //         Single param
        //     </Link>
        //     <Link href={"blog/a/b"} className="bg-blue-400 w-fit rounded-lg p-4">
        //         Multiple Params
        //     </Link>
        //     <Link href={"blog"} className="bg-amber-400 w-fit rounded-lg p-4">
        //         Optional
        //     </Link>
        //  </div>