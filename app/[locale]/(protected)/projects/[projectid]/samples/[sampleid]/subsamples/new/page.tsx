"use server"

import Head from 'next/head';

import { fraction_inputFormElments } from '@/config/formElements';

import { useParams, useRouter } from 'next/navigation';
import { Debug } from '@/components/Debug';
import { Timeline_scan } from '@/components/timeline-scan';


import SubSampleForm from './SubSampleForm';
import { timelist } from './[subsampleid]/state';
import { getMe } from '@/app/api/data/user';
import { Sample } from '@/app/api/network/interfaces';
import { getSample } from '@/app/api/data/samples';
import { getProject } from '@/app/api/data/projects';
 




const forms = [
    fraction_inputFormElments
]

interface pageProps {
    params: {
        projectid: string
        sampleid: string
    }
}


const NewSubSample = async (params: pageProps) => {
    const {projectid, sampleid}= params.params
    console.debug("NewSample params projectid: ", projectid);
    console.debug("NewSample params sampleid: ", sampleid);

    const user = await getMe()
    const sample = await getSample(projectid,sampleid)
   const project = sample.project

    return (
        <>
            {/* <div>{project.name} / { sample && sample.name} </div> */}
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

                <div className="text-center justify-center">
                    {/* Sub Sample|undefined = undefined; Metadata to sample {sampleid} from project {projectid} */}
                    <Timeline_scan list={timelist} current={0} />
                    <SubSampleForm sample={sample} user={user}  />
                </div>
            </section>
        </>
    );
}


export default NewSubSample;
