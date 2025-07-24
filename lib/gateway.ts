// import { getDrives } from "@/app/api/network/zooprocess-api"
import * as I from '@/app/api/network/interfaces';
import { API_SERVER, REAL_FOLDER, UPLOAD_FOLDER } from '@/constants';
// import { fileExists } from '@/app/api/file-exists';

// const realFolder =  process.env.VITE_REAL_FOLDER // process.env.REAL_FOLDER || '/Users/sebastiengalvagno/Work/test/nextui/ZooprocessFront/public/' ///uploads'
const realFolder = REAL_FOLDER ? (REAL_FOLDER.endsWith('/') ? REAL_FOLDER : REAL_FOLDER + '/') : '';

// function pathToRealStorage(path:string) : string {
//     console.log( "pathToRealStorage() | path :", path)

//     // path.substring(0, 1) == '/'? path.substring(1) : path
//     // const sessionFolder = process.env.UPLOAD_FOLDER || "/uploads"
//     const sessionFolder = "" //process.env.UPLOAD_FOLDER || "/uploads"
//     const newPath = path.substring( 0, sessionFolder.length) == sessionFolder ? realFolder + path.substring( sessionFolder.length) : path

//     console.log( "pathToRealStorage() | newPath  :", newPath)
//     // console.log( "pathToRealStorage() | newPath2 :", newPath2)

//     return newPath
// }

function pathToRealStorage(path: string, projectBasePath?: string): string {
  console.log('pathToRealStorage() | path:', path);

  // const realFolder = process.env.VITE_REAL_FOLDER || "";
  // const realFolder = () => {
  //     return process.env.VITE_REAL_FOLDER || "";
  // }
  // const realFolder = process.env.VITE_REAL_FOLDER
  // ? (process.env.VITE_REAL_FOLDER.endsWith('/')
  //     ? process.env.VITE_REAL_FOLDER
  //     : process.env.VITE_REAL_FOLDER + '/')
  // : "";

  // If path starts with realFolder, keep it
  if (path.startsWith(realFolder)) {
    return path;
  }

  if (path.startsWith('/Volumes')) {
    return path;
  }

  // @ts-ignore
  if (path.startsWith(API_SERVER)) {
    return path;
  }

  // look for the projectBasePath, if provided
  // if (projectBasePath) {
  //     if (path.startsWith(projectBasePath)) {
  //         return path;
  //     }
  // }

  // If path starts with /uploads/, add the realFolder prefix
  if (path.startsWith('/uploads/')) {
    // Ensure clean concatenation without double slashes
    console.debug('path:', path);
    console.log('file is in /uploads then add prefix to have real path');
    const adjustedPath = path.startsWith('/') ? path.substring(1) : path;
    return `${realFolder}${adjustedPath}`;
  }

  // Check if path is an absolute filesystem path
  // const isAbsolutePath = (
  //     path.match('/^\\/Volumes\\//')    // Mac mounted volumes
  // //   || path.match(/^\/[a-zA-Z]/)    // Unix root paths
  // //   || path.match(/^[A-Z]:\\/)         // Windows drives
  // );
  // if (isAbsolutePath) {
  //     return path;
  // }

  // quand j'appelle la function c'est certaine fois pour determiner le chemin pour y mettre le fichier
  // donc le test rendra faux
  // const exists = await fileExists(path);
  // if (exists) {
  //     return path;Error: can not open image file: /Users/sebastiengalvagno/Work/ZooprocessFront/public/Users/sebastiengalvagno/Work/test/nextui/zooprocess_v10/public/Volumes/PIQv/local_SebProject/Zooscan_scan/_raw/apero2023_pp_wp2_001_st01_d_d1_raw_1-1747118489147-577809389.tif
  // }

  // Other cases add the prefix
  const adjustedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${realFolder}${adjustedPath}`;
}

const isTiff = (fileUrl: string): boolean => {
  if (fileUrl == undefined) return false;
  console.log('fileUrl in gateway.ts: ', fileUrl);
  return fileUrl.endsWith('.tif') || fileUrl.endsWith('.tiff');
};

/**
 * // Remove leading/trailing slashes and split
 * @param path
 * @returns segmented path
 */
function splitPath(path: string) {
  const segments = path.replace(/^\/+|\/+$/g, '').split('/');
  return segments;
}
/**
 *
 * @param path where are store the file
 * @param sessionFolder the path that is used to store the files in the web session (the path where the web server can publish the files)
 * @returns
 */
// async
function pathToSessionStorage(path: string, sessionFolder = UPLOAD_FOLDER): string {
  if (!path) return '';

  console.log('pathToSessionStorage() | path :', path);
  console.log('path type:', typeof path, 'path value:', path);

  console.log('pathToSessionStorage realFolder:', realFolder);

  if (realFolder) {
    console.debug('We have realFolder defined');
    if (path.startsWith(realFolder)) {
      const newPath = path.substring(realFolder.length);
      console.debug('pathToSessionStorage newPath:', newPath);
      return newPath;
    } else {
      console.debug('path:', path);
      console.debug('path do not start with:', realFolder);
      return path;
    }
  }

  console.debug('pathToSessionStorage =>:', realFolder + path);
  return realFolder + path;
}

function pathToSessionStorage_test(path: string, sessionFolder = UPLOAD_FOLDER): string {
  if (!path) return null;

  console.log('pathToSessionStorage() | path:', path);

  // If the path is already a web-accessible path (starts with /uploads/)
  if (path.startsWith('/uploads/')) {
    console.debug('Already a web path:', path);
    return path;
  }

  // If this is a TIFF file that needs conversion
  if (isTiff(path)) {
    // Create a daily folder path
    const today = new Date();
    const dateFolder = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    const uploadFolder = `/uploads/${dateFolder}`;

    // Extract the filename
    const filename = path.split('/').pop();

    // Create a web-accessible path for the converted JPG
    const jpgPath = `${uploadFolder}/${filename.replace(/\.tiff?$/, '.jpg')}`;
    console.debug('Created JPG path:', jpgPath);

    return jpgPath;
  }

  // For other file types or paths, use the original logic
  // const realFolder = process.env.VITE_REAL_FOLDER;

  if (realFolder && path.startsWith(realFolder)) {
    const newPath = path.substring(realFolder.length);
    console.debug('newPath:', newPath);
    return newPath.startsWith('/') ? newPath : `/${newPath}`;
  }

  // If all else fails, return the original path with a leading slash if needed
  return path.startsWith('/') ? path : `/${path}`;
}

export { pathToRealStorage, pathToSessionStorage, isTiff };
