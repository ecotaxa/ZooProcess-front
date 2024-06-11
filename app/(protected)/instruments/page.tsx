"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MySpinner } from '@/components/mySpinner'
import { ErrorComponent } from '@/components/ErrorComponent'
import { InstrumentsTable } from './instruments-table'
import { Button, Card, CardBody, CardHeader, Link, Spacer } from '@nextui-org/react';
import { useInstruments } from '@/api/instruments'


export default function InstrumentsPage() {

    const formatData = (data:any) => {
        const fdata = data.map( (mdata:any) => {
            // const createdAt = new Date(metadata.createdAt)
            // console.log("createdAt: ", createdAt)

            // ici les colonnes qui m'interresse pour mon tableau
            return {
                id: mdata.id,
                name: mdata.name,
                model: mdata.model,
				sn:mdata.sn,
                projectcount: 0, // metadata.sampleCount,
            }
        });
    
        console.log(fdata);
        return fdata;
    }


	const { instruments, isLoading, isError } = useInstruments()
    const [ instrumentList, setProjectList ] = useState([instruments])
    const router = useRouter()
    
    useEffect( () => { 
        if ( Object.keys(instruments).length == 0) return;

        console.log("projects have changed (only useful columns for the table)", instruments);
        const data = formatData(instruments)
        setProjectList(data);
      } , [instruments])
    
    const ShowData = () => {
        if (isLoading) return <MySpinner />
        if (isError) return <ErrorComponent error={isError}/>
        return <InstrumentsTable instruments={instrumentList}/>
      }

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="text-center justify-center">
                <h4 data-testid="title">
					Instruments
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
                            >Add new instrument</Button>
                    </CardHeader>
                    <CardBody>
                        <ShowData/>
                    </CardBody>

                </Card> 
            </div>
        </section>
    );
};







