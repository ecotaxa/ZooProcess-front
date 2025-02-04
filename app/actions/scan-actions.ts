// "use server"

import { addScan as addScanAPI } from "@/app/api/network/scan"

export async function addScan(image: {
    url: string,
    instrumentId: string,
    projectId: string,
    subsampleId: string
}) {
    return addScanAPI(image)
}
