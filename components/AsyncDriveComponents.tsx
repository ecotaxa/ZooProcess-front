// "use client";

// import { Suspense, use, useCallback, useEffect, useState } from 'react'
// import AsyncDriveData from './AsyncDriveData'
// import { Drive } from '../api/network/interfaces';

// const AsyncDriveContent = () => {
//    const drives = AsyncDriveData();

//    const [driveList, setDrives] = useState<Drive[]>([]);

//    const callback = useCallback(() => {
//     const fetchDrives = async () => {
//         const drivesData = await drives;
//         console.log("AsyncDriveContent useEffect: ", drivesData);
//         if (drivesData !== driveList) {
//             setDrives(drivesData);
//         }
//     };
//     fetchDrives();
//    }, [drives, driveList]);

//    console.log("----------------------------------------------")

//    useEffect(() => {
//     //    const fetchDrives = async () => {
//     //        const drivesData = await drives;
//     //        console.log("AsyncDriveContent useEffect: ", drivesData);
//     //        if (drivesData !== driveList) {
//             //    setDrives(drivesData);
//             setDrives(drives);
//             //    }
//     //    };
//     //    fetchDrives();
// //    }, [drives, driveList]);
// }, [drives]);

//    return (
//        <>
//            <h1>test</h1>
//            <p>AsyncAuthComponent</p>
//            {driveList && driveList.map((drive: Drive) => <p key={drive.id}>{drive.name}</p>)}
//            drive list
//        </>
//    );
// };

// const AsyncDriveComponent = () => {  return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <AsyncDriveContent />
//     </Suspense>
//   )
// }

// export default AsyncDriveComponent

import { Suspense, useEffect, useState } from 'react';
import AsyncDriveData from '../app/api/data/AsyncDriveData.tsx';
import { Drive } from '@/network/interfaces.ts';

const AsyncDriveContent = () => {
  const drives = AsyncDriveData();

  const [drivelist, setDrives] = useState<Drive[]>([]);

  useEffect(() => {
    const fetchDrives = async () => {
      const drivesData = await drives;
      console.log('AsyncDriveContent useEffect: ', drivesData);
      setDrives(drivesData);
    };
    fetchDrives();
    // }, [drives])
  }, []);

  return (
    <>
      <h1>test</h1>
      <p>AsyncAuthComponent</p>
      {drivelist && drivelist.map((drive: Drive) => <p key={drive.id}>{drive.name}</p>)}
      drive list
    </>
  );
};

const AsyncDriveComponent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncDriveContent />
    </Suspense>
  );
};

export default AsyncDriveComponent;
