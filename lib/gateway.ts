// import { getDrives } from "@/app/api/network/zooprocess-api"
import * as I from '@/app/api/network/interfaces'

const realFolder =  process.env.NEXT_PUBLIC_REAL_FOLDER // process.env.REAL_FOLDER || '/Users/sebastiengalvagno/Work/test/nextui/ZooprocessFront/public/' ///uploads'

function pathToRealStorage(path:string) : string {
    console.log( "pathToRealStorage() | path :", path)

    // path.substring(0, 1) == '/'? path.substring(1) : path
    const sessionFolder = process.env.UPLOAD_FOLDER || "/uploads"
    const newPath = path.substring( 0, sessionFolder.length) == sessionFolder ? realFolder + path.substring( sessionFolder.length) : path
    

    console.log( "pathToRealStorage() | newPath  :", newPath)
    // console.log( "pathToRealStorage() | newPath2 :", newPath2)


    return newPath
}


const isTiff = (fileUrl: string) : boolean => {
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
function pathToSessionStorage(path:string , sessionFolder = process.env.NEXT_PUBLIC_UPLOAD_FOLDER || "") : string {
    console.log( "pathToSessionStorage() | path :", path)
    console.log('path type:', typeof path, 'path value:', path);

   

    if ( path.startsWith(realFolder)) {
        return path.substring( realFolder.length) 

    }

    return realFolder + path

}


export { pathToRealStorage, pathToSessionStorage, isTiff }

