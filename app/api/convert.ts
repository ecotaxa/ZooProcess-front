
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
    

    // Update the data object with the new destination
    const modifiedData = {
        ...data,
        dst: `${process.env.NEXT_PUBLIC_REAL_FOLDER}${destinationPath}`
    };
    
    console.debug("converttiff2jpg modified data: ", modifiedData);
    
    // const server = "http://zooprocess.imev-mer.fr:8000";
    // const server= process.env.NEXT_PUBLIC_API_SERVER;
    const server= process.env.NEXT_PUBLIC_API_TOOLS_SERVER;
    const url = server + "/convert/";


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






/**
 * know path are  / something / Drive / Project name / * / image.tif
 * must change to / session storage / Drive / Project name / * / image.jpg
 * to change in pathToSessionStorage
 */



