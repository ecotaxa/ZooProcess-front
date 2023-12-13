import { FC } from "react";

interface pageProps {
    // params: {
        projectid: string
    // }
}

const Scans : FC<pageProps> = (params) => {

    const projectId = params.projectid ;
    console.log("Metadata params: ", params);
    console.log("Metadata params projectid: ", params.projectid);

    return (
        <div>
            <h1>{projectId} Scans</h1>
        </div>
    );
};

export default Scans;
