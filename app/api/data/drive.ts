import { Drive } from '../network/interfaces';
import * as api from '@/app/api/network/zooprocess-api';

export async function getDrives(): Promise<Array<Drive>> {
  try {
    const drives = await api.getDrives(); //'/drives/')
    return drives;
  } catch (error) {
    console.error('Error - getDrives()', error);
    throw error;
  }
}

// export async function updateDrive(drive:any /*Drive without ID*/) { //}: Promise<Drive>{

//   try {
//     return api.updateDrive(drive)
//     .then((response) => {
//       console.log("Drive updated OK");
//       return Promise.resolve( { data:response, message:"Drive have been updated"})
//     })
//     .catch ((error) =>  {
//       console.error("Drive added NOK: ", error);
//       console.log("Drive: ", drive);
//       throw (error.message)
//     })
//   } catch (error: any) {
//     console.debug("updateDrive caught error:", error);
//     // Extract message from error object
//     const errorMessage = error.message ||
//                        (error.response?.data?.message) ||
//                        (typeof error === 'object' ? JSON.stringify(error) : error);
//     throw new Error(errorMessage);
//   }
// }

export async function updateDrive(drive: any /*Drive without ID*/) {
  //}: Promise<Drive>{

  try {
    const response = await api.updateDrive(drive);
    console.log('Drive updated OK');
    // return Promise.resolve( { data:response, message:"Drive have been updated"})
    return response;
  } catch (error: any) {
    console.debug('updateDrive caught error:', error);
    // Extract message from error object
    const errorMessage =
      error.message ||
      error.response?.data?.message ||
      (typeof error === 'object' ? JSON.stringify(error) : error);
    throw new Error(errorMessage);
  }
}
