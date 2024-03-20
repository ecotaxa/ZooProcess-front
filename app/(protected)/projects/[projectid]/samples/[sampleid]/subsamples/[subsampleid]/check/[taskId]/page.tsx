"use client";


// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

import { useVignettes } from '@/api/vignettes';
import { MySpinner } from "@/components/mySpinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { sep } from "path";
import { Vignette } from "@/app/api/network/zooprocess-api";
import { pathToSessionStorage } from "@/lib/gateway";
import { Image } from "@nextui-org/react";
import { BorderDottedIcon } from "@radix-ui/react-icons";
import { Debug } from "@/Components/Debug";

//import path from "path/posix";
import path from "path";

type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,  
        taskId: string  
    }
}



const CheckPage: FC<pageProps> = ({ params }) => {
// const CheckPage: FC<pageProps> = ({ projectid, sampleid,subsampleid, taskId }) => {

  const { separatorTask, isLoading, isError } = useVignettes(params.taskId);
  const [ vignetteList, setVignetteList] = useState(separatorTask?.vignette);
  // const [ vignetteList, setVignetteList] = useState(separatorTask?.data);
  // const [ vignetteList, setVignetteList] = useState([]);

  // const [vignetteMaskList, setVignetteMaskList] = useState([]);
  // const [vignetteRawList, setVignetteRawList] = useState([]);
  // const [vignetteResultList, setVignetteResultList] = useState([]);

  const router = useRouter();

  // const formatData = (data: any) => {
    const getName = (url:string):string => {

      // const p = path.join(url)//  .resolve(url)
      // const nam = p.

      const split = url.split(sep);
      const name = split[split.length-1];

      console.log("get name: ", name)

      return name;
    }

  const formatData2 = (data: any) => {

    // export interface Vignette {
    //   id: string
    //   url: string
    //   type: string
    // }


    const raw = data.filter( (vignette:Vignette) => vignette.type == "raw" )
    const mask = data.filter( (vignette:Vignette) => vignette.type == "mask" )
    const result = data.filter( (vignette:Vignette) => vignette.type == "merge" )

    // setVignetteMaskList(mask)
    // setVignetteRawList(raw)
    // setVignetteResultList(result)

    
    // const p = path.resolve(vignette.url)

    const formatted = raw.map((vignette:any)=>{

 
      
      // (url:string):string => { 
      //    return url;
      // }

      const vign_mask = mask.filter( (vignet:any) => getName(vignet.url) )
      const vign_result = result.filter( (vignet:any) => getName(vignet.url) )

      let vignettes = {
        raw : {
          id:vignette.id,
          url:vignette.url,
          type:vignette.type
        },
        mask:vign_mask,
        result:vign_result
      } 
      
      return vignettes
    })

    // const formatted = data.map((vignette:any)=>{return {
    //   id:vignette.id,
    //   url:vignette.url,
    //   type:vignette.type
    // }})!

    return formatted; // data;
  };


  const formatData = (data: Array<any>) => {
    console.log("formatData")
    const formatted = data.map((vignette:any) => {
      return {
        id:vignette.id,
        url:vignette.url,
        type:vignette.type
      }
    })

    return formatted; // data;
  };

  useEffect(() => {
    console.log("separatorTask changed", separatorTask);
    if (separatorTask == null) return;
    const vignettes = separatorTask; //.vignette;
    console.log("vignettes:", vignettes)
    if (vignettes){
      if (Object.keys(vignettes).length == 0) return;
      console.log("vignettes have changed sort them to display them", vignettes);
      const data = formatData(vignettes);
      setVignetteList(data);

      // setVignetteList(vignettes)
    }
    //  else {
    //   setVignetteList([])
    // }
  }, [separatorTask]);

  const ShowData = () => {

    if (isLoading) return <MySpinner />;
    if (isError) return <ErrorComponent error={isError} />;

    if ( vignetteList == null || vignetteList.length == 0) return <div>No vignette</div>;

    console.log("vignetteList", vignetteList);

    // const tab = vignetteList.forEach((vignette: Vignette) => {
      // console.log(vignette.url)
      // <li>toto</li>
      // return "<li>vignette.id</li>"
    // })

    // console.log("tab",tab)

    const image = (vignette:Vignette) => {

      console.log("vignette.url", vignette.url)
      const localPath = pathToSessionStorage(vignette.url)
      console.log("localPath", localPath)
      const sep = "/"
      const name = vignette.url.split(sep).pop()

      return (
        <div  key={vignette.id} className="border-2 background-color: rgb(226 232 240);">
          {/* <img key={vignette.id} src={localPath}/> */}
          <Image src={localPath} className="border-2" />
          <p>{name}</p>
          <Debug params={vignette.url} /> 
        </div>
      )
    }


    return (
      <>
        {/* {
          // JSON.stringify(vignetteList)
          // vignetteList.forEach((vignette: Vignette) => {
          //   <li>toto</li>
          // })
          // tab
          // vignetteList.length == 0? <div>No vignette</div> :
            vignetteList.map((vignette: Vignette) => {
            //   return {vignette.id, vignette.name, vignette.url};
            //   // return <div className="border-2 background-color: rgb(226 232 240);"><img src={vignette.url}/><p>vignette.url</p></div>
                <p>li</p>
            })
        } */}
              <div className="grid grid-cols-2 gap-4" key="form">
                <div className="h-screen flex items-center justify-center">
                    {
                      vignetteList.map( (vignette:any) =>  image(vignette))
                      // vignetteList.map( (vignette:any) => {
                      //   return ( 
                      //     <>
                      //       image(vignette) 
                      //       <Debug params={vignette} /> 
                      //     </>

                      //   )
                      // }
                      //   )
                    }
                  </div>
              </div>

      </>
    );
  };

  return (
    <div className="grid">
      {/* Vignettes */}
      <ShowData />
      {/* Vignettes fin */}
    </div>
  );

}


export default CheckPage;

