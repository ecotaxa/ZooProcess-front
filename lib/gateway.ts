
function pathToRealStorage(path:string) : string {
    console.log("pathToRealStorage() | path :", path)

    // path.substring(0, 1) == '/'? path.substring(1) : path
    const sessionFolder = process.env.UPLOAD_FOLDER || "/uploads"
    const realFolder = process.env.REAL_FOLDER || "/Users/sebastiengalvagno/Work/test/nextui/zooprocess_v10/public/uploads" //"/Users/sebastiengalvagno/Drives"
    const newPath = path.substring(0, sessionFolder.length) == sessionFolder ? realFolder + path.substring(sessionFolder.length) : path

    console.log("pathToRealStorage() | newPath :", newPath)
    return newPath
}


function pathToSessionStorage(path:string) : string {
    console.log("pathToSessionStorage() | path :", path)

    // if ( path.substring(0, 1) != '/' ) {
    //     // path = path.substring(1)
    //     path = "/Users/sebastiengalvagno/" + path
    // }

    // path.substring(0, 1) == '/'? path.substring(1) : path
    // const realFolder = process.env.REAL_FOLDER || "/Users/sebastiengalvagno/Work/test/nextui/zooprocess_v10/public/uploads" 
    const realFolder = '/Users/sebastiengalvagno/Work/test/nextui/zooprocess_v10/public' ///uploads'
    // "/Users/sebastiengalvagno/Drives" // NEXT_PUBLIC_FOLDER_STORAGE_IMAGES
    const sessionFolder = process.env.UPLOAD_FOLDER || "/" // "/uploads"
    console.log("pathToSessionStorage() | realFolder :", realFolder)
    console.log("pathToSessionStorage() | sessionFolder :", sessionFolder)

    console.log("path.substring(0, realFolder.length): >", path.substring(0, realFolder.length) , "<" )
    console.log("test: ",  path.substring(0, realFolder.length) == realFolder ) 
    console.log("p1:",path.substring(1, realFolder.length+1))
    console.log("p2:",realFolder)
    // const newPath = path.substring(0, realFolder.length) == realFolder ? sessionFolder + path.substring(realFolder.length) : path

    console.log("fou0: ", realFolder )
    console.log("fou1: ", path.substring(realFolder.length+1) )
    // console.log("fou2: ", path.substring(realFolder.length+2) )
    // console.log("fou3: ", path.substring(realFolder.length+1,realFolder.length) )


    // .slice(0, -1) magouillage pour enlever un " qui est en fin de chaine. aucune idée d'où il vient  {mad}
    let newPath = sessionFolder + path.substring(realFolder.length+1) // .slice(0, -1);
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

    console.log("pathToSessionStorage() | newPath :", newPath)
    return newPath
}


export { pathToRealStorage, pathToSessionStorage }

