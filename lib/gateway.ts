// import { getDrives } from "@/app/api/network/zooprocess-api"
import * as I from '@/app/api/network/interfaces'

function pathToRealStorage(path:string) : string {
    console.log( "pathToRealStorage() | path :", path)

    // path.substring(0, 1) == '/'? path.substring(1) : path
    const sessionFolder = process.env.UPLOAD_FOLDER || "/uploads"
    const realFolder = process.env.REAL_FOLDER || "/Users/sebastiengalvagno/Work/test/nextui/zooprocess_v10/public/uploads" //"/Users/sebastiengalvagno/Drives"
    const newPath = path.substring( 0, sessionFolder.length) == sessionFolder ? realFolder + path.substring( sessionFolder.length) : path
    
    // const newPath2 = path.substring( 1, sessionFolder.length) == sessionFolder ? realFolder + path.substring( sessionFolder.length) : path

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
function pathToSessionStorage(path:string , sessionFolder = process.env.UPLOAD_FOLDER || "") : string {
    console.log( "pathToSessionStorage() | path :", path)
    console.log('path type:', typeof path, 'path value:', path);

    // if ( path.substring(0, 1) != '/' ) {
    //     // path = path.substring(1)
    //     path = "/Users/sebastiengalvagno/" + path
    // }

    // path.substring(0, 1) == '/'? path.substring(1) : path
    // const realFolder = process.env.REAL_FOLDER || "/Users/sebastiengalvagno/Work/test/nextui/zooprocess_v10/public/uploads" 
    const realFolder = process.env.REAL_FOLDER || '/Users/sebastiengalvagno/Work/test/nextui/zooprocess_v10/public/' ///uploads'
    // "/Users/sebastiengalvagno/Drives" // NEXT_PUBLIC_FOLDER_STORAGE_IMAGES
    // const sessionFolder = process.env.UPLOAD_FOLDER || "" // "/" // "/uploads"
    // console.log( "pathToSessionStorage() | realFolder :", realFolder)
    // console.log( "pathToSessionStorage() | sessionFolder :", sessionFolder)

    // console.log( "path.substring(0, realFolder.length): >", path.substring( 0, realFolder.length) , "<" )
    // console.log( "path.substring(1, realFolder.length): >", path.substring( 1, realFolder.length+1) , "<" )
    // console.log( "test false: ", path.substring( 0, realFolder.length) == realFolder ) 
    // console.log( "test true : ", path.substring( 1, realFolder.length) == realFolder ) 
    // console.log( "p1:", path.substring( 1, realFolder.length+1))
    // console.log( "p2:", realFolder)
    // // const newPath = path.substring(0, realFolder.length) == realFolder ? sessionFolder + path.substring(realFolder.length) : path

    // console.log( "fou0 : ", realFolder )
    // console.log( "fou1 : ", path.substring( realFolder.length+1) )
    // console.log( "fou10: ", path.substring( realFolder.length) )
    // // console.log("fou2: ", path.substring(realFolder.length+2) )
    // // console.log("fou3: ", path.substring(realFolder.length+1,realFolder.length) )


    // // .slice(0, -1) magouillage pour enlever un " qui est en fin de chaine. aucune idée d'où il vient  {mad}
    // // let newPath = sessionFolder + path.substring( realFolder.length+1) // .slice(0, -1);
    // console.log( "newPath | sessionFolder  :", sessionFolder )
    // console.log( "newPath | path.substring :", path.substring( realFolder.length ) )

// <<<<<<< HEAD
//     let newPath = sessionFolder + path.substring( realFolder.length  ) // .slice(0, -1);
// =======
    /**
     * know path are  / something / Drive / Project name / * / image.tif
     * must change to / session storage / Drive / Project name / * / image.jpg
     * to change in pathToSessionStorage
     * I must remove all path before the drive
     * and paste the session storage path before the drive
     */
    /* old and sometimes fail */
    // const length = realFolder.length - 1
    // let newPath = sessionFolder + path.substring( length ) // .slice(0, -1);

    // const drives: Array<I.Drive> = 
    // const newPath = getDrives()
    // .then(drives => {
    //     console.debug("drives: ", drives)
    //     console.log( "pathToSessionStorage() | newPath :", newPath)
    //     const matchingDrive = drives.find(drive => path.startsWith(drive.url));
    //     if (matchingDrive) {
    //         return sessionFolder + path.substring(matchingDrive.url.length);
    //     }
    //     console.log( "pathToSessionStorage() | newPath :", path)
    //     return path
    // })
    // .catch(error => {
    //     console.error("Error getDrives():", error);
    //     console.log( "pathToSessionStorage() | newPath :", path)
    //     return path
    // });

    // const drives = await getDrives()
    // const matchingDrive = drives.find(drive => path.startsWith(drive.url));
    // if (matchingDrive) {
    //     console.log( "pathToSessionStorage() | newPath :", sessionFolder + path.substring(matchingDrive.url.length))
    //     return sessionFolder + path.substring(matchingDrive.url.length);
    // }
    // console.log( "pathToSessionStorage() | newPath :", path)
    // return path

    // if ( path.startsWith(realFolder)) {
    //     return sessionFolder + path.substring(realFolder.length);
    // }
    // return path

    if ( path.startsWith(realFolder)) {
        // return path
        return path.substring( realFolder.length) 

    }

    return realFolder + path
// >>>>>>> updateNextSplitScanProcess

    // if ( newPath.substring( ) == '/' ) {
    //     newPath = newPath.substring(1)
    // }
    ///ARRRGGGGGGG 
    
    // if ( newPath.slice(-1) == '"'){
    //     newPath = newPath.slice(0, -1)
    // }

    // str = str.slice(0, -1);
    // let newPath = ""
    // if ( path.substring(0, 1) == '/' ) {
    //     if ( path.substring(0, realFolder.length) == realFolder ){
    //         sessionFolder + path.substring(realFolder.length)
    //     } else {
    //         newPath = path
    //     }
    // } else {
    //     newPath = "/" + path
    // }

    // console.log( "pathToSessionStorage() | newPath :", newPath)
    // return newPath
}


export { pathToRealStorage, pathToSessionStorage, isTiff }

