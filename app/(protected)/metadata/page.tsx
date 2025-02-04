

"use client";

import { useMetadata } from '@/app/api/metadata';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MySpinner } from '@/components/mySpinner'
import { ErrorComponent } from '@/components/ErrorComponent'
import { MetadataTable } from '@/components/metadata-table'
import { Button, Card, CardBody, CardFooter, CardHeader, Link, Spacer } from '@nextui-org/react';

// import { Projects } from "@/app/api/network/zooprocess-api"


// const castArray = (value:Array<any>) => Array.isArray(value) ? value : [value];

const Metadata = () => {


    const formatData = (data:any) => {
        const metadata = data.map( (metadata:any) => {
            const createdAt = new Date(metadata.createdAt)
            console.log("createdAt: ", createdAt)

            // ici les colonnes qui m'interresse pour mon tableau
            return {
                id: metadata.id,
                name: metadata.name,
                description: metadata.description,
                samplecount: 0, // metadata.sampleCount,
                subsamplecount: 0, // metadata.subsamplecount,
                //createdAt,
            }
        });
    
        console.log(metadata);
        return metadata;
    }


const { metadata, isLoading, isError } = useMetadata()
    const [ metadataList, setProjectList ] = useState([metadata])
    const router = useRouter()
    
    useEffect( () => { 
        if ( Object.keys(metadata).length == 0) return;

        console.debug("metadata have changed (only useful columns for the table)", metadata);
        const data = formatData(metadata)
        setProjectList(data);
      } , [metadata])
    
    const ShowData = () => {
        if (isLoading) return <MySpinner />
        if (isError) return <ErrorComponent error={isError}/>
        return <MetadataTable metadata={metadataList}/>
      }

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="text-center justify-center">
                <h4 data-testid="title">
                    Projects
                </h4>
                <Spacer y={5}/>
                <Card className="inline-block "
                    data-testid="metadataCard" 
                    >
                    <CardHeader className="flex flex-row-reverse py-3">
                        <Button 
                            href="metadata/new"
                            as={Link}
                            color="primary"
                            variant="solid"
                            data-testid="newMetadataBtn"
                            >Add new metadata</Button>
                    </CardHeader>
                    <CardBody>
                        <ShowData/>
                    </CardBody>

                </Card> 
            </div>
        </section>
    );
};

export default Metadata;
