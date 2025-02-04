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
    // sampleid_formElements, 
    // inputFormElements, 
    // inputFormElements_tow_type_vertical, 
    fraction_inputFormElments
]

interface pageProps {
    params: {
        projectid: string
        sampleid: string
    }
}

// const NewSubSample : FC<pageProps> = async (params ) => {
    // const NewSubSample : FC<pageProps> = async ({projectid, sampleid}: pageProps) => {
    // const NewSubSample = async ({projectid, sampleid}: pageProps) => {


    const NewSubSample = async (params: pageProps) => {

    console.log("NewSample params : TOTO");

    console.log("NewSample params : ", params);

        //    const projectid = params.projectid;
        //     const sampleid = params.sampleid;

            const {projectid, sampleid}= params.params
            console.log("NewSample params projectid: ", projectid);
            console.log("NewSample params sampleid: ", sampleid);

            // const projectid = params.projectid;
            // const sampleid = params.sampleid;

    //     const projectid = "66685e4877fbfe58ebff221e"
    // const sampleid = "66fe4ac6752044c6dadfbaa6"

    const user = await getMe()

    const project = await getProject(projectid)
    let sample : Sample | undefined = undefined;
    if ( project.samples !== undefined ) {
        const s = project.samples.find((s: any) => s.sample_id === sampleid)
        if ( s !== undefined ) {
            sample = s
        } else {
            sample = await getSample(projectid,sampleid)
        }
    }

   


    // console.debug("NewSample params: ", params);
    console.debug("NewSample params: ", {projectid, sampleid});
    // console.log("NewSample params projectid: ", params.projectid);
    // console.log("NewSample params sampleid: ", params.sampleid);
    // console.log("NewSample params projectid: ", params.projectid);

    // const projectid = router.query.projectid //as string
    // const projectid = params.params.projectid;
    // const sampleid = params.params.sampleid;
    // const projectId = params.projectid;





    return (
        <>


            {/* <div>PID {projectid}</div> */}
            {/* <div>SID {sampleid}</div> */}

            <div>{project.name} / { sample && sample.name} </div>

        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

            <div className="text-center justify-center">

                    Sub Sample|undefined = undefined; Metadata to sample {sampleid} from project {projectid}
                    <Timeline_scan list={timelist} current={0} />

                        <SubSampleForm {...{projectid:projectid, sampleid:sampleid, user:user} } />
            </div>
        </section>
        </>
    );
}


export default NewSubSample;
