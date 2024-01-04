import { FC } from "react";




interface pageProps {
    params: {
      projectid: string,
      sampleid: string
      subsampleid: string
    }
  }

// const SubsamplePage : FC<pageProps> = ({projectid,sampleid,subsampleid}) => {
const SubsamplePage : FC<pageProps> = ({params}) => {

    // console.log("NewSample params: ", params);
    // console.log("NewSample params projectid: ", params.params.projectid);
    // console.log("NewSample params sampleid: ", params.params.sampleid);
    // console.log("NewSample params sampleid: ", params.params.subsampleid);

    const {projectid,sampleid,subsampleid} = params

    console.log("NewSample params: ", params);
    console.log("NewSample params projectid: ", projectid);
    console.log("NewSample params sampleid: ", sampleid);
    console.log("NewSample params sampleid: ", subsampleid);


    return (
        <>
            SubSample Scan Preview
            <div><b>project Id: </b> {projectid}</div>
            <div><b>sample Id: </b> {sampleid}</div>
            <div><b>subsample Id: </b> {subsampleid}</div>
        </>

    )

}

export default SubsamplePage
