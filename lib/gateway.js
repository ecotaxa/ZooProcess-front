
function pathToRealStorage(path) {
    console.log("pathToRealStorage() | path :", path)

    // path.substring(0, 1) == '/'? path.substring(1) : path
    const sessionFolder = process.env.UPLOAD_FOLDER || "/uploads"
    const realFolder = process.env.REAL_FOLDER || "/Users/sebastiengalvagno/Drives"
    const newPath = path.substring(0, sessionFolder.length) == sessionFolder ? realFolder + path.substring(sessionFolder.length) : path

    console.log("pathToRealStorage() | newPath :", newPath)
    return newPath
}


function pathToSessionStorage(path) {
    console.log("pathToSessionStorage() | path :", path)

    // path.substring(0, 1) == '/'? path.substring(1) : path
    const realFolder = process.env.REAL_FOLDER || "/Users/sebastiengalvagno/Drives" // NEXT_PUBLIC_FOLDER_STORAGE_IMAGES
    const sessionFolder = process.env.UPLOAD_FOLDER || "/uploads"
    const newPath = path.substring(0, realFolder.length) == realFolder ? sessionFolder + path.substring(realFolder.length) : path

    console.log("pathToSessionStorage() | newPath :", newPath)
    return newPath
}


export { pathToRealStorage, pathToSessionStorage }

