import { getSubSample } from "@/app/api/data/subsamples"


export async function GET(
    request: Request,
    { params }: { params: { projectid :string, sampleid: string, subsapleid: string } }
) {
    const subsample = await getSubSample(params.projectid,params.sampleid,params.subsapleid)
    if (!subsample) {
        console.log ("GET() SubSample not found")
        return Response.json({ status: 'error', message: 'SubSample not found' })
    }

    console.log ("GET() SubSample found : subsample: ", subsample)

    return Response.json({ status: 'success', data: subsample })
}
