import { getDrives } from './drive';
import { useDrives } from '../drives';
import { Drive } from '../network/interfaces';

// export default async function AsyncDriveData(): Promise<{ drives: Array<Drive>, isLoading: any, isError: boolean }> {
// //   const { drives, isLoading, isError } = useDrives()
// //   return { drives, isLoading, isError }

// return  getDrives()
// .then((drives) => {

//     console.log("AsyncDriveData %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
//     console.log("AsyncDriveData drives: ", drives)

//     return { drives, isLoading: false, isError: false }
// })
// .catch((error) => {
//     return { drives: [], isLoading: false, isError: true }
// })

// }

// import { useState, useEffect } from 'react';
// import { useDrives } from "../api/drives";
// import { Drive } from '../api/network/interfaces';

// export default function AsyncDriveData() {
//   const [data, setData] = useState<{ drives: Array<Drive>, isLoading: boolean, isError: boolean }>({ drives: [], isLoading: true, isError: false });

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const result = await useDrives();
//         setData({ drives: result.drives, isLoading: false, isError: false });
//       } catch (error) {
//         setData({ drives: [], isLoading: false, isError: true });
//       }
//     }
//     fetchData();
//   }, []);

//   return data;
// }

export default async function AsyncDriveData(): Promise<Array<Drive>> {
  //   const { drives, isLoading, isError } = useDrives()
  //   return { drives, isLoading, isError }

  return await getDrives();
  // .then((drives) => {

  //     console.log("AsyncDriveData %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  //     console.log("AsyncDriveData drives: ", drives)

  //     return drives;
  // })
  // .then((drives) => {

  // console.log("AsyncDriveData %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  // console.log("AsyncDriveData drives: ", drives)

  // return { drives, isLoading: false, isError: false }
  // })
  // .catch((error) => {
  // return { drives: [], isLoading: false, isError: true }
  // })
}
