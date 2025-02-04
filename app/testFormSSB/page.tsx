"use server";

import Head from "next/head";
import { getProject } from "../api/data/projects";
import { getSample } from "../api/data/samples";
import { getMe } from "../api/data/user";
import { Sample } from "../api/network/interfaces";
import { Timeline_scan } from "@/components/timeline-scan";
import { timelist } from "../(protected)/projects/[projectid]/samples/[sampleid]/subsamples/new/[subsampleid]/state";
import SubSampleForm from "../(protected)/projects/[projectid]/samples/[sampleid]/subsamples/new/SubSampleForm";



const testFormSSBPage = async () => {

    //    http://localhost:3001/projects/66685e4877fbfe58ebff221e/samples/66fe4ac6752044c6dadfbaa6/subsamples/new
    const projectid = "66685e4877fbfe58ebff221e"
    const sampleid = "66fe4ac6752044c6dadfbaa6"

    const user = await getMe()

    const project = await getProject(projectid)
    let sample : Sample|undefined = undefined;
    if ( project.samples !== undefined ) {
        const s = project.samples.find((s: any) => s.sample_id === sampleid)
        if ( s !== undefined ) {
            sample = s
        } else {
            sample = await getSample(projectid,sampleid)
        }
    }

    // return (
    //     <div>
    //         <h1>Test Form SSB</h1>
    //         <p>projectid: {projectid}</p>
    //         <p>sampleid: {sampleid}</p>
    //         <p>user: {user.email}</p>
    //         <p>project: {project.name}</p>
    //         <p>sample: {sample && sample.name}</p>
    //     </div>
    // )


    return (
        <>
        <Head>
            <title>
            New Sub Sample Metadata | ZooProcess
            </title>
        </Head>

        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

            <div className="text-center justify-center">
                    Sub Sample Metadata to sample {sampleid} from project {projectid}
                    <Timeline_scan list={timelist} current={0} />
                    {/* <MyForm 
                        {...form} 
                        project={projectid}
                        sample={sampleid}
                        onChange={onChange} 
                        onCancel={onCancel}
                        button={formButtons}/> */}

                        {/* {showForm(user)} */}
                        <SubSampleForm {...{projectid:projectid, sampleid:sampleid, user:user} } />
            </div>
        </section>
        </>
    );



}



export default testFormSSBPage;