import { Suspense } from 'react';
// import AsyncDrriveComponents from "./AsyncDriveComponents";
import AsyncAuthComponent from '../../components/AsyncDriveComponents';

const test = () => {
  // const { drives, isLoading, isError } = useDrives()

  // console.log("drives: ", drives)

  // const DriveComponent = () => {
  // return (
  //     <>
  //     <Suspense fallback={<div>Loading...</div>}>
  //         <AsyncAuthComponent />
  //   </Suspense>

  //     </>
  // )
  //   }

  //   const AsyncDriveContent = () => {
  //     const { drives, isLoading, isError } = AsyncDriveData()

  //     if (isLoading) return <p>Loading...</p>
  //     if (isError) return <p>Error loading drives</p>

  //     return (
  //       <>
  //         <h1>test</h1>
  //         <p>AsyncAuthComponent</p>
  //         {drives && drives.map(drive => <p key={drive.id}>{drive.name}</p>)}
  //       </>
  //     )
  //   }

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <AsyncAuthComponent />
      {/* </Suspense> */}
    </>
  );
};

export default test;
