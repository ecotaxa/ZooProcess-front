// import { title } from "@/components/primitives";
// import { Timeline_scan } from "@/components/timeline-scan";
// import { Card, CardBody, CardFooter, Input, Link, Select, SelectItem, Spinner, Switch } from "@heroui/react";

// import ArcticMap from '@/components/ArcticMap';
import MapComponent from '@/components/MapComponent';
// import Planisfer from "@/components/Planisfer";
import { useEffect, useRef, useState } from 'react';
// import AntarcticMap from "@/components/AntarcticMap";

import DrawCanvas from '@/components/DrawCanvas';
import { REAL_FOLDER } from '@/constants';

// import dotenv from 'dotenv';
// dotenv.config();
// const { useEnviron } = require('@next/npm/env');

// useEnviron({
//   database: 'your-database-url',
//   username: 'your-username',
//   password: 'your-password'
// });

// import { env } from 'node:process';
// import env;

const startCoords: [number, number] = [43.3, 7.4];
const endCoords: [number, number] = [41.4, 7.4];

function handleCoordsChange(start: [number, number], end: [number, number] | void) {
  console.log('handleCoordsChange', start, end);
}

type Coord = [number, number];

export default function AboutPage() {
  const initialStartCoords: Coord = [43.3, 7.1];
  const initialEndCoords: Coord = [41.3, 8.1];

  // const [folder, setFolder] = useState<string | undefined>();
  // useEffect(() => {
  //     setFolder(process.env.VITE_REAL_FOLDER);
  // }, []);

  const onCoordsChange = (start: Coord, end: Coord | void): any => {
    console.log('onCoordsChange', start, end);
  };

  const test = () => {
    const folder = REAL_FOLDER; // || "toto"
    // console.log("process.env.REAL_FOLDER", folder)

    return (
      <div>
        <h1>Folder: {folder}</h1>
      </div>
    );
  };

  return (
    <div className="w-screen max-w-none overflow-x-hidden px-6">
      {test()}
      {/* <h1>t{process.env.REAL_FOLDER}</h1> */}
      {/* <h1>{process.env.VITE_REAL_FOLDER}</h1> */}

      <MapComponent start={initialStartCoords} end={initialEndCoords} onChange={onCoordsChange} />
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
