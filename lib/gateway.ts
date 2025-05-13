// import { getDrives } from "@/app/api/network/zooprocess-api"
import * as I from '@/app/api/network/interfaces'

const realFolder =  process.env.NEXT_PUBLIC_REAL_FOLDER // process.env.REAL_FOLDER || '/Users/sebastiengalvagno/Work/test/nextui/ZooprocessFront/public/' ///uploads'

function pathToRealStorage(path:string) : string {
    console.log( "pathToRealStorage() | path :", path)

    // path.substring(0, 1) == '/'? path.substring(1) : path
    // const sessionFolder = process.env.UPLOAD_FOLDER || "/uploads"
    const sessionFolder = "" //process.env.UPLOAD_FOLDER || "/uploads"
    const newPath = path.substring( 0, sessionFolder.length) == sessionFolder ? realFolder + path.substring( sessionFolder.length) : path
    

    console.log( "pathToRealStorage() | newPath  :", newPath)
    // console.log( "pathToRealStorage() | newPath2 :", newPath2)


    return newPath
}


const isTiff = (fileUrl: string) : boolean => {
    if (fileUrl == undefined) return false
    console.log("fileUrl: ", fileUrl)
    return fileUrl.endsWith(".tif") || fileUrl.endsWith(".tiff")
}

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
function pathToSessionStorage_old(path:string , sessionFolder = process.env.NEXT_PUBLIC_UPLOAD_FOLDER || "") : string {

    if (!path) return "";


    console.log( "pathToSessionStorage() | path :", path)
    console.log('path type:', typeof path, 'path value:', path);

    console.log("realFolder:", realFolder)

    if (realFolder) {
        if ( path.startsWith(realFolder)) {
            const newPath = path.substring( realFolder.length)
            console.debug("newPath:",newPath)
            return newPath

        }
    }

    console.debug("pathToSessionStorage =>:", realFolder + path)
    return realFolder + path
}

function pathToSessionStorage(path: string, sessionFolder = process.env.NEXT_PUBLIC_UPLOAD_FOLDER || ""): string {
    if (!path) return null;

    console.log("pathToSessionStorage() | path:", path);
    
    // If the path is already a web-accessible path (starts with /uploads/)
    if (path.startsWith('/uploads/')) {
        console.debug("Already a web path:", path);
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
        console.debug("Created JPG path:", jpgPath);
        
        return jpgPath;
    }
    
    // For other file types or paths, use the original logic
    const realFolder = process.env.NEXT_PUBLIC_REAL_FOLDER;
    
    if (realFolder && path.startsWith(realFolder)) {
        const newPath = path.substring(realFolder.length);
        console.debug("newPath:", newPath);
        return newPath.startsWith('/') ? newPath : `/${newPath}`;
    }
    
    // If all else fails, return the original path with a leading slash if needed
    return path.startsWith('/') ? path : `/${path}`;
}


export { pathToRealStorage, pathToSessionStorage, isTiff }

