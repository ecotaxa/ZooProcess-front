"use client"


import { title } from "@/components/primitives";
import { Timeline_scan } from "@/components/timeline-scan";
import { Card, CardBody, Link, Spinner } from "@nextui-org/react";

import ArcticMap from '@/components/ArcticMap';
import MapComponent from "@/components/MapComponent";
import Planisfer from "@/components/Planisfer";


const startCoords :[number,number] = [43.3, 7.4]    
const endCoords :[number,number] = [41.4, 7.4]

function handleCoordsChange(start: [number,number], end :[number,number]|void){
    console.log("handleCoordsChange", start, end)
}

export default function AboutPage() {
	return (
        <div>
        <Card>
      <CardBody>

        {/* <Timeline_scan current={0.5} />

        <Timeline_scan current={1} />
        <Timeline_scan current={1.5} /> */}
        
            {/* <MapComponent         
            initialStartCoords={startCoords}
            initialEndCoords={endCoords}
        onCoordsChange={handleCoordsChange}
            /> */}
            <Planisfer/>

        <h1>Carte de l'Arctique</h1>
        <ArcticMap />


		</CardBody>
        </Card>
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