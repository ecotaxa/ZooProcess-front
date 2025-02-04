

import { th } from "date-fns/locale"




/**
 * know path are  / something / Drive / Project name / * / image.tif
 * must change to / session storage / Drive / Project name / * / image.jpg
 * to change in pathToSessionStorage
 */

export async function converttiff2jpg ( data) {
            // "use server";

            const bodytext = JSON.stringify(data)
            console.debug("bodytext: ", bodytext)

            // const server = "http://localhost:8000"
            const server = "http://zooprocess.imev-mer.fr:8000"
            const url = server + "/convert"
            console.debug("converttiff2jpg url: ", url)
            console.debug("converttiff2jpg data: ", data)
            // const response = 
            return await fetch( url , {
                method: "POST",
                body: bodytext, // JSON.stringify(data),
                // body: data_test,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": "Zooprocess v10",
                    // "Access-Control-Allow-Origin":"no-cors"
                },
            })
            .then((response) => {
                if (response.ok) {
                    console.log("converttiff2jpg fetch response: ", response)
                    // console.log("converttiff2jpg fetch response.text: ", response.text)
                    // console.log("converttiff2jpg fetch JSON.parse(response.text): ", JSON.parse(response.text))
                    return response

                    // response.text()
                    // .then((imageUrl) => {

                    //     // receive text: then need to remove the double quote around the text
                    //     if ( imageUrl[0] == '"' ) {
                    //         imageUrl = imageUrl.substring(1)
                    //     }
                    //     console.debug("imageUrl[-1]: ", imageUrl[-1])
                    //     if ( imageUrl[-1] == '"'){
                    //         imageUrl = imageUrl.substring(0, imageUrl.length-1)
                    //     }

                    //     return new Promise.resolve({path:imageUrl})
                    // })
                    
                    // response.text()
                    // .then((imageUrl) => {
                    //     // setImageUrl(imageUrl);
                    //     console.log("imageUrl: ", imageUrl)
                    //     const localPath = pathToSessionStorage(imageUrl)
                    //     console.log("localPath: ", localPath)
                    //     setBackground(localPath)
                    //     return response
                    // })
                    // .catch((error) => {
                    //     console.log("Cannot convert Tiff to Jpg error: ", error)
                    //     const errormsg = { message:"Cannot convert Tiff to Jpg error: " + error}
                    //     // setMsg(errormsg.message)
                    //     // setError(errormsg)
                    //     throw new Error(errormsg)
                    // })
                } else {
                    console.error("Resp NOK", response.status)
                    // setError(response)
                    // setError([response])
                    if ( response.status == 422) {
                        console.error("The server do not accept your connection")
                        console.error("Can't connect: ", response)
                        // setMsg("The server do not accept your connection")
                        throw new Error("The server do not accept your connection")
                        // throw new Error({message:"The server do not accept your connection"})
                    } else {
                        console.error("Cannot convert Tiff to Jpg error: ", response)
                        // setMsg("Cannot convert Tiff to Jpg error:")
                        throw new Error("Cannot convert Tiff to Jpg error: " + response)
                        // throw new Error({message:"Cannot convert Tiff to Jpg error: " + response})
                    }
                }
            })
            .catch( err => {
                console.error("Error converting Tiff to Jpg:", err)
                console.error("Error converting Tiff to Jpg:", err.message)
                console.error("return 404")
                //return "/images/404.jpg"
                //throw new Error("Cannot convert Tiff to Jpg error: " + err.message)
                return Promise.resolve("/images/404.jpg")
            })

}

