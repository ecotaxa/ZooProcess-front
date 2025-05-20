"use client";

// import { useBackgrounds, useSampleScans } from "@/app/api/background";
// import { ErrorComponent } from "@/components/ErrorComponent";
import { BackgroundTable } from "@/components/backgrounds-table";
// import { MySpinner } from "@/components/mySpinner";
// import { ScanTable } from "@/components/scans-table";
import { Button, Card, CardBody, CardHeader, Link, Spacer} from "@nextui-org/react";
import { FC, useEffect, useState } from "react";

import { getProjectBackgrounds } from "@/app/api/data/background";
import { Background } from "@/app/api/network/interfaces";

interface pageProps {
    // params: {
        projectid: string
    // }
}


const BackgroundScans : FC<pageProps> = ({projectid}) => {

    // const projectId = params.projectid ;
    // console.log("Metadata params: ", params);
    // console.log("Metadata params projectid: ", params.projectid);
    console.log("Metadata params projectid: ", projectid);

    // const { backgrounds, isLoading, isError } = useBackgrounds(projectId)
    const [ backgroundList, setBackgroundList ] = useState<any[]>([])


    useEffect(() => {
        const fetchBackgrounds = async () => {
            const fetchedBackgrounds = await getProjectBackgrounds(projectid)
            const formattedData = formatData(fetchedBackgrounds)
            setBackgroundList(formattedData)
        }
        fetchBackgrounds()
    }, [projectid])

    
    // const { scans, isLoading: isScanLoading , isError: isScanError } = useSampleScans(projectId)
    // const [ scanList, setScanList ] = useState(scans)
    
    // {
    //     "id": "65c3635582772f6fd7ba5bd3",
    //     "url": "Drives/Background/2024_02_07_08_52_10_0001.jpg",
    //     "background": true,
    //     "createdAt": "2023-12-31T21:03:22.650Z",
    //     "userId": "65bd08e14fbfb25884e127fb",
    //     "instrumentId": "65c4e0994653afb2f69b11ce",
    //     "subSampleId": null
    //   },

    const formatData = (data:any) => {

        console.log("formatData", data);
    
        const backgrounds = Object.keys(data).map( (_scan) => {
    
          console.log("background: ", _scan);
  
          if ( _scan == "key"){
              console.error("ARRGG indey == key");
              console.log("ARRGG indey == key")
              console.debug(data);
              console.log("pfffff")
          } else {
            const s = data[_scan]
            console.log("s: ", s);

            return {
              id: s.id,
              name: s.url,
              creator: s.user.name,
              time:s.createdAt,
              date:s.createdAt,
            //   qc:"",
              qc: s.qc || "TODO",  
              action:s.url
            }
          }
        })

        console.log("formated backgrounds data: ", backgrounds);
        return backgrounds
    }

    const formatScanSampleData = (data:any) => {

        console.log("formatData", data);
    
        const scans = Object.keys(data).map( (_scan) => {
    
          console.log("scans: ", _scan);
  
          if ( _scan == "key"){
              console.error("ARRGG indey == key");
              console.log("ARRGG indey == key")
              console.debug(data);
              console.log("pfffff")
          } else {
            const s = data[_scan]
  
            const fraction_id = "fraction_id"
            const frac_min = "frac_min"
            const frac_sup = "frac_sup"
            const observation = "observation"

            const qc = s.SubSample?.qc

            return {
              id: s.id,
              name: s.url,
              creator: s.user.name,
            //   time:s.createdAt,
            //   date:s.createdAt,
            // qc: "missing",
              qc: s.qc || "TODO",  
              fraction_id,
              frac_min,
              frac_sup,
              observation,
              action:s.url
            }  
          }
        })

        console.log("formated scans data: ", scans);
        return scans
    }

    // useEffect( () => { 
    //         if ( backgrounds.length > 0 ) {
    //             console.log("background list has changed", backgrounds);
    //             const data = formatData(backgrounds)
    //             // const data = formatData(backgrounds).filter(item => item !== undefined);
    //             // const data = samples
    //             setBackgroundList(data);
    //     }
    // } , [backgrounds])
    
    // useEffect( () => { 
    //     if ( scans.length > 0 ) 
    //         {
    //             console.log("scan list has changed", scans);
    //             const data = formatScanSampleData(scans)
    //             // const data = formatData(backgrounds).filter(item => item !== undefined);
    //             // const data = samples
    //             setScanList(data);
    //         }
    // } , [scans])
  
      
    const ShowData = () => {
        // if (isLoading) return <MySpinner />
        // if (isError) return <ErrorComponent error={isError}/>
        console.debug(backgroundList)
        return <BackgroundTable projectId={projectid} backgrounds={backgroundList}/>
    }

    // const ShowScanData = () => {
    //     if (isScanLoading) return <MySpinner />
    //     if (isScanError) return <ErrorComponent error={isScanError}/>
    //     console.debug(scanList)
    //     return <ScanTable projectId={projectId} scans={scanList}/>
    // }

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
            {/* <h1 data-testid="title">
                {projectId} Scans
            </h1>
            <Spacer y={5}/> */}
            <Card className="inline-block "
                    data-testid="backgroundCard" 
                >
                <CardHeader className="flex flex-row py-3">
                    <div>
                        <h1>Available Back Scans</h1>
                        <h4>Samples read from file: </h4>
                    </div>
                    <Button 
                          // href={`/projects/${projectId}/samples/new`} cannot open this page ????
                          href={`/projects/${projectid}/background/`}
                          as={Link}
                          color="primary"
                          // showAnchorIcon
                          variant="solid"
                          data-testid="newBackBtn"
                          >NEW BACKGROUND using upload
                        </Button>
                        <Button 
                          // href={`/projects/${projectId}/samples/new`} cannot open this page ????
                          href={`/projects/${projectid}/upload/`}
                          as={Link}
                          color="primary"
                          // showAnchorIcon
                          variant="solid"
                          data-testid="newBackBtn"
                          >NEW BACKGROUND
                        </Button>
                </CardHeader>
                <CardBody>
                    <ShowData/>
                </CardBody>

            </Card> 

            {/* <Spacer y={5}/>

            <Card className="inline-block "
                    data-testid="backgroundCard" 
                >
                <CardHeader className="flex flex-row py-3">
                    <div>
                        <h1>Available sub sample scans</h1>
                        <h4>Subsamples read from file: </h4>
                    </div>
                </CardHeader>
                <CardBody>
                    <ShowScanData/>
                </CardBody>

            </Card>  */}
        </div>
    </section>

    );
};

export default BackgroundScans;

