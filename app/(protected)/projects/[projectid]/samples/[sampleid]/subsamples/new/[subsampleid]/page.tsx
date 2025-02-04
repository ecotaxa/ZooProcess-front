
"use server";

import { FC } from "react"



import { getSubSample } from "@/app/api/data/subsamples";
// import { Project } from "@/app/api/network/interfaces";
// import { Metadata } from "./Metadata";
// import { ScannerSettings } from "./ScannerSettings";
// import { Preview } from "./Preview";
import { getProject } from "@/app/api/data/projects";
import { getSample } from "@/app/api/data/samples";
import { ProcessTimeline } from "./ProcessTimeline";

type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}




const ScanPage : FC<pageProps> = async ({params}) => {

    // const router = useRouter();
    const {projectid, sampleid, subsampleid} = params;
    // const {project, isError, isLoading} = useProject(projectid);
    // const [image , setImage] = useState(false);
    // const imagePlaceholder = "/images/placeholder-image.jpg";
    // const [background, setBackground] = useState(imagePlaceholder)
    // const [scan, setScan] = useState(undefined)
    // const [imageRGB , setImageRGB] = useState("");

    console.debug("ScanPage params: ", params)

const project = await getProject(projectid);
const sample = await getSample(projectid, sampleid);
const subsample = await getSubSample(projectid, sampleid, subsampleid);

console.debug("ScanPage subsample: ", subsample)

  

    
    return (
     

        <ProcessTimeline project={project} sample={sample} subsample={subsample} />
    )

}

export default ScanPage;

