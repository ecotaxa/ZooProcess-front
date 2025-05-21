
export async function converttiff2jpg(data: any): Promise<string> {

    const bodytext = JSON.stringify(data);
    console.debug("bodytext: ", bodytext);

    // Create a daily folder path
    const today = new Date();
    const dateFolder = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

    const uploadFolder = `/uploads/${dateFolder}`;
    
    // Create the folder if it doesn't exist (server-side)
    const fullUploadPath = `${process.env.NEXT_PUBLIC_REAL_FOLDER}${uploadFolder}`;
    
    // Extract the filename from the original path
    const originalPath = data.src;
    const filename = originalPath.split('/').pop();
    
    // Create the destination path for the converted file
    const destinationPath = `${uploadFolder}/${filename.replace(/\.tiff?$/, '.jpg')}`;
    
    // // internal API to check if file exist (we need to go the server side)
    // try {
    //     const fileCheckResponse = await fetch('/api/file-exists', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ filePath: fullDestinationPath }),
    //     });
        
    //     const { exists } = await fileCheckResponse.json();
        
    //     if (exists) {
    //         console.log("File already exists, returning path");
    //         return destinationPath;
    //     }
    // } catch (error) {
    //     console.error("Error checking if file exists:", error);
    //     // Continue with conversion if check fails
    // }

    // Update the data object with the new destination
    const modifiedData = {
        ...data,
        dst: `${process.env.NEXT_PUBLIC_REAL_FOLDER}${destinationPath}`
    };
    
    console.debug("converttiff2jpg modified data: ", modifiedData);
    
    // const server = "http://zooprocess.imev-mer.fr:8000";
    const server= process.env.API_TOOLS_SERVER;
    const url = server + "/convert/";

    // console.debug("await fetch url: ", url)
    // const datafetched = await fetch(url, {
    //     method: "POST",
    //     body: JSON.stringify(modifiedData),
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json",
    //         "User-Agent": "Zooprocess v10",
    //     },
    // });

    // console.debug("await fetch done")
    // console.debug("converttiff2jpg datafetched: ", datafetched);

    // return datafetched
    //     .then((response: Response) => {
    //         if (response.ok) {
    //             console.log("converttiff2jpg fetch response: ", response);
    //             return response.text()
    //                 .then((imageUrl) => {
    //                     // Return the web-accessible path instead of the file system path
    //                     console.debug("got destinationPath:",destinationPath)
    //                     return destinationPath;
    //                 });
    //         } else {
    //             console.debug("converttiff2jpg fetch response not ok:", response);
    //             throw new Error(`Conversion failed with status: ${response.status}`);
    //         }
    //     });

    //     console.debug("converttiff2jpg return - there is a problem")


    try {
        console.debug("await fetch url: ", url);
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(modifiedData),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Zooprocess v10",
            },
        });

        console.debug("await fetch done");
        console.debug("converttiff2jpg response: ", response);

        if (response.ok) {
            console.log("converttiff2jpg fetch response: ", response);
            // Get the response text but we'll return the web path regardless
            const imageUrl = await response.text();
            console.debug("got destinationPath:", destinationPath);
            return destinationPath;
        } else {
            console.debug("converttiff2jpg fetch response not ok:", response);
            throw new Error(`Conversion failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error in converttiff2jpg:", error);
        throw error;
    }

}


// import { th } from "date-fns/locale"




/**
 * know path are  / something / Drive / Project name / * / image.tif
 * must change to / session storage / Drive / Project name / * / image.jpg
 * to change in pathToSessionStorage
 */





// export async function converttiff2jpg_old ( data:any ) : Promise<string> {
//             // "use server";

//             const bodytext = JSON.stringify(data)
//             console.debug("bodytext: ", bodytext)

//             // const server = "http://localhost:8000"
//             const server = "http://zooprocess.imev-mer.fr:8000"
//             const url = server + "/convert"
//             console.debug("converttiff2jpg url: ", url)
//             console.debug("converttiff2jpg data: ", data)
//             // const response = 
//             // return
//             // await 
//             const datafetched = fetch( url , {
//                 method: "POST",
//                 body: bodytext, // JSON.stringify(data),
//                 // body: data_test,
//                 headers: {
//                     "Accept": "application/json",
//                     "Content-Type": "application/json",
//                     "User-Agent": "Zooprocess v10",
//                     // "Access-Control-Allow-Origin":"no-cors"
//                 },
//             })

//             return datafetched
//             .then((response:Response) => {
//                 if (response.ok) {
//                     console.log("converttiff2jpg fetch response: ", response)
//                     // console.log("converttiff2jpg fetch response.text: ", response.text)
//                     // console.log("converttiff2jpg fetch JSON.parse(response.text): ", JSON.parse(response.text))
//                     return response.text()

//                     // response.text()
//                     // .then((imageUrl) => {

//                     //     // receive text: then need to remove the double quote around the text
//                     //     if ( imageUrl[0] == '"' ) {
//                     //         imageUrl = imageUrl.substring(1)
//                     //     }
//                     //     console.debug("imageUrl[-1]: ", imageUrl[-1])
//                     //     if ( imageUrl[-1] == '"'){
//                     //         imageUrl = imageUrl.substring(0, imageUrl.length-1)
//                     //     }

//                     //     return new Promise.resolve({path:imageUrl})
//                     // })
                    
//                     // response.text()
//                     // .then((imageUrl) => {
//                     //     // setImageUrl(imageUrl);
//                     //     console.log("imageUrl: ", imageUrl)
//                     //     const localPath = pathToSessionStorage(imageUrl)
//                     //     console.log("localPath: ", localPath)
//                     //     setBackground(localPath)
//                     //     return response
//                     // })
//                     // .catch((error) => {
//                     //     console.log("Cannot convert Tiff to Jpg error: ", error)
//                     //     const errormsg = { message:"Cannot convert Tiff to Jpg error: " + error}
//                     //     // setMsg(errormsg.message)
//                     //     // setError(errormsg)
//                     //     throw new Error(errormsg)
//                     // })
//                 } else {
//                     console.error("Resp NOK", response.status)
//                     // setError(response)
//                     // setError([response])
//                     if ( response.status == 422) {
//                         console.error("The server do not accept your connection")
//                         console.error("Can't connect: ", response)
//                         // setMsg("The server do not accept your connection")
//                         throw new Error("The server do not accept your connection")
//                         // throw new Error({message:"The server do not accept your connection"})
//                     } else {
//                         console.error("Cannot convert Tiff to Jpg error: ", response)
//                         // setMsg("Cannot convert Tiff to Jpg error:")
//                         throw new Error("Cannot convert Tiff to Jpg error: " + response)
//                         // throw new Error({message:"Cannot convert Tiff to Jpg error: " + response})
//                     }
//                 }
//             })
//             .catch( err => {
//                 console.error("Error converting Tiff to Jpg:", err)
//                 console.error("Error converting Tiff to Jpg:", err.message)
//                 console.error("return 404")
//                 //return "/images/404.jpg"
//                 //throw new Error("Cannot convert Tiff to Jpg error: " + err.message)
//                 return "/images/404.jpg"
//             })

// }
// // module.exports = {
// //     convertTiff2Jpg
// // }


