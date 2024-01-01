

"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MySpinner } from '@/components/mySpinner'
import { ErrorComponent } from '@/components/ErrorComponent'
import { DrivesTable } from './drives-table'
import { Button, Card, CardBody, CardHeader, Link, Spacer } from '@nextui-org/react';
import { useDrives } from '@/api/drives';

// import { Projects } from "@/app/api/network/zooprocess-api"


// const castArray = (value:Array<any>) => Array.isArray(value) ? value : [value];

const Drives = () => {


    const formatData = (data:any) => {
        const fdata = data.map( (mdata:any) => {
            // const createdAt = new Date(metadata.createdAt)
            // console.log("createdAt: ", createdAt)

            // ici les colonnes qui m'interresse pour mon tableau
            return {
                id: mdata.id,
                name: mdata.name,
                url: mdata.description,
                projectcount: 0, // metadata.sampleCount,
            }
        });
    
        console.log(fdata);
        return fdata;
    }


const { drives, isLoading, isError } = useDrives()
    const [ driveList, setProjectList ] = useState([drives])
    const router = useRouter()
    
    useEffect( () => { 
        if ( Object.keys(drives).length == 0) return;

        console.log("projects have changed (only useful columns for the table)", drives);
        const data = formatData(drives)
        setProjectList(data);
      } , [drives])
    
    const ShowData = () => {
        if (isLoading) return <MySpinner />
        if (isError) return <ErrorComponent error={isError}/>
        return <DrivesTable drives={driveList}/>
      }

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="text-center justify-center">
                <h4 data-testid="title">
                    Drives
                </h4>
                <Spacer y={5}/>
                <Card className="inline-block "
                    data-testid="dataCard" 
                    >
                    <CardHeader className="flex flex-row-reverse py-3">
                        <Button 
                            href="drives/new"
                            as={Link}
                            color="primary"
                            variant="solid"
                            data-testid="newBtn"
                            >Add new drive</Button>
                    </CardHeader>
                    <CardBody>
                        <ShowData/>
                    </CardBody>

                </Card> 
            </div>
        </section>
    );
};

export default Drives;
