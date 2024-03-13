"use client";


// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

import { useVignettes } from '@/api/vignettes';
import { MySpinner } from "@/components/mySpinner";
import { ErrorComponent } from "@/components/ErrorComponent";
import { sep } from "path";
import { Vignette } from "@/app/api/network/zooprocess-api";

type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,  
        taskId: string  
    }
}



const CheckPage: FC<pageProps> = ({ params }) => {
  const { separatorTask, isLoading, isError } = useVignettes(params.taskId);
  const [vignetteList, setVignetteList] = useState(separatorTask?.vignette);
  const router = useRouter();

  const formatData = (data: any) => {
    return data;
  };

  useEffect(() => {
    console.log("separatorTask changed", separatorTask);
    if (separatorTask == null) return;
    const vignettes = separatorTask.vignette;
    if (Object.keys(vignettes).length == 0) return;

    console.log("vignettes have changed sort them to display them", vignettes);
    const data = formatData(vignettes);
    setVignetteList(data);
  }, [separatorTask]);

  const ShowData = () => {
    if (isLoading) return <MySpinner />;
    if (isError) return <ErrorComponent error={isError} />;

    if ( vignetteList == null) return <div>No vignette</div>;

    console.log("vignetteList", vignetteList);

    // const tab = vignetteList.forEach((vignette: Vignette) => {
      // console.log(vignette.url)
      // <li>toto</li>
      // return "<li>vignette.id</li>"
    // })

    // console.log("tab",tab)

    const image = (vignette:Vignette) => {
      return (
        <img key={vignette.id} src={vignette.url}/>
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

              <div className="grid" key="form">
                    {
                      vignetteList.map( vignette => image(vignette) )
                    }
              </div>

      </>
    );
  };

  return (
    <div className="grid">
      Vignettes
      <ShowData />
      Vignettes fin
    </div>
  );
};


export default CheckPage;


