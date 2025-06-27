"use client";

import { BackgroundTable } from "@/components/backgrounds-table";
import { Button, Card, CardBody, CardHeader, Link, Spacer} from "@heroui/react";
import { FC, useEffect, useState } from "react";

import { getProjectBackgrounds } from "@/app/api/data/background";
import { useTranslations } from 'next-intl' ;
import { Debug } from "@/components/Debug";

interface pageProps {
        projectid: string,
}


const BackgroundScans : FC<pageProps> = ({projectid}) => {

  console.log("Metadata params projectid: ", projectid);

  const [ backgroundList, setBackgroundList ] = useState<any[]>([])
	const t = useTranslations('ProjectPage_Backgrounds');


    useEffect(() => {
        const fetchBackgrounds = async () => {
            const fetchedBackgrounds = await getProjectBackgrounds(projectid)
            const formattedData = formatData(fetchedBackgrounds)
            // Newest entries first, fields date & time both contain the full creation date
            formattedData.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            setBackgroundList(formattedData)
        }
        fetchBackgrounds()
    }, [projectid])

    
    // data format
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
              name: s.id, // It's a project-local id in Python backend
              creator: s.user.name,
              time:s.createdAt,
              date:s.createdAt,
              qc: s.qc || t("QC_TODO"),
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
              qc: s.qc || t("QC_TODO"),
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
  
      
    const ShowData = () => {
        console.debug(backgroundList)
        return <BackgroundTable projectId={projectid} backgrounds={backgroundList}/>
    }

    return (
      <>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
            <Card className="inline-block "
                    data-testid="backgroundCard" 
                >
                <CardHeader className="flex flex-row py-3">
                    <div>
                        <h1>{t("Title")}</h1>
                        <h4>{t("Subtitle")}</h4>
                    </div>
                    <Button 
                          href={`/projects/${projectid}/background/`}
                          as={Link}
                          color="primary"
                          variant="solid"
                          data-testid="newBackBtn"
                          >{t("New_Upload")}
                        </Button>
                        <Button 
                          href={`/projects/${projectid}/upload/`}
                          as={Link}
                          color="primary"
                          variant="solid"
                          data-testid="newBackBtn"
                          >{t("New")}
                        </Button>
                </CardHeader>
                <CardBody>
                    <ShowData/>
                </CardBody>

            </Card> 

        </div>
    </section>
    <Debug params={backgroundList} title="backgroundList" pre={true} />
    </>
    );
};

export default BackgroundScans;

