"use client";

import { getScans } from "@/app/api/data/scan";
import { SubSample } from "@/app/api/network/interfaces";
import { ScanTable } from "@/components/scans-table";
import { Card, CardBody, CardHeader, Link, Spacer} from "@heroui/react";
import { FC, useEffect, useState } from "react";
import { useTranslations } from 'next-intl' ;
import { Debug } from "@/components/Debug";

interface pageProps {
        projectid: string
}


const Scans : FC<pageProps> = ({projectid}) => {

	const t = useTranslations('ProjectPage_Scans');
	

    console.log("Metadata params projectid: ", projectid);

    const [ scanList, setScanList ] = useState<any[]>([])

    useEffect(() => {
        const fetchBackgrounds = async () => {
            const fetchedScans = await getScans(projectid)
            const formattedData = formatData(fetchedScans)
            setScanList(formattedData)
        }
        fetchBackgrounds()
    }, [projectid])

    
 

    /* data to format
	{
		"id": "67fe58f4ec2fb4b42b442d62",
		"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_005_st11_d_d1_1-1744722130000-285157118.tif",
		"type": "SCAN",
		"createdAt": "2025-04-15T13:02:44.803Z",
		"userId": "67d2a8e28d769787349edfc2",
		"instrumentId": "67d2e965b9c2783283859438",
		"background": false,
		"archived": false,
		"deleted": false,
		"deletedAt": null,
		"projectId": "67d7a84fff15a5db7ee64f9e",
		"instrument": {
			"id": "67d2e965b9c2783283859438",
			"model": "Zooscan",
			"name": "SN01",
			"sn": "SN01"
		},
		"scanSubsamples": [
			{
				"id": "67fe58f4ec2fb4b42b442d63",
				"scanId": "67fe58f4ec2fb4b42b442d62",
				"subsampleId": "67fd2b087724babc8c40bc95",
				"subsample": {
					"id": "67fd2b087724babc8c40bc95",
					"name": "67d7a84fff15a5db7ee64f9e_undefined",
					"createdAt": "2025-04-14T15:34:32.139Z",
					"sampleId": "67d7a84fff15a5db7ee64fa1",
					"userId": "67d2a8e28d769787349edfc2",
					"metadataModelId": "6565df171af7a84541c48b20",
					"qCStateId": null,
					"metadataModel": null,
					"metadata": [
						{
							"id": "67fd2b087724babc8c40bc96",
							"name": "scanning_operator",
							"type": "string",
							"value": "seb",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						},
						{
							"id": "67fd2b087724babc8c40bc97",
							"name": "scan_id",
							"type": "string",
							"value": "1_",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						},
						{
							"id": "67fd2b087724babc8c40bc98",
							"name": "fraction_number",
							"type": "string",
							"value": "1",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						},
						{
							"id": "67fd2b087724babc8c40bc99",
							"name": "fraction_id_suffix",
							"type": "string",
							"value": "",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						},
						{
							"id": "67fd2b087724babc8c40bc9a",
							"name": "fraction_min_mesh",
							"type": "number",
							"value": "1",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						},
						{
							"id": "67fd2b087724babc8c40bc9b",
							"name": "fraction_max_mesh",
							"type": "number",
							"value": "2",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						},
						{
							"id": "67fd2b087724babc8c40bc9c",
							"name": "spliting_ratio",
							"type": "number",
							"value": "2",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						},
						{
							"id": "67fd2b087724babc8c40bc9d",
							"name": "observation",
							"type": "string",
							"value": "obs",
							"sampleId": null,
							"subSampleId": "67fd2b087724babc8c40bc95"
						}
					],
					"scanSubsamples": [
						{
							"id": "67fd30d37724babc8c40bca7",
							"scanId": "67fd30d37724babc8c40bca6",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fd30d37724babc8c40bca6",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_009_st11_d_d2_1-1744646188727-74231843.tif",
								"type": "SCAN",
								"createdAt": "2025-04-14T15:59:15.351Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fd33e67724babc8c40bcad",
							"scanId": "67fd33e67724babc8c40bcac",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fd33e67724babc8c40bcac",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_008_st11_d_d2_1-1744646950339-637459065.tif",
								"type": "SCAN",
								"createdAt": "2025-04-14T16:12:22.276Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fdeef07724babc8c40bfad",
							"scanId": "67fdeef07724babc8c40bfac",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fdeef07724babc8c40bfac",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_008_st11_d_d1_1-1744695003050-211500524.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T05:30:24.235Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fdfc207724babc8c40bfb1",
							"scanId": "67fdfc207724babc8c40bfb0",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fdfc207724babc8c40bfb0",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_003_st01_d_d1_1-1744698305956-588292588.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T06:26:40.590Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fe069f7724babc8c40bfbb",
							"scanId": "67fe069f7724babc8c40bfba",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fe069f7724babc8c40bfba",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_003_st01_d_d2_1-1744700908870-90442382.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T07:11:27.453Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fe13b47724babc8c40bfd8",
							"scanId": "67fe13b47724babc8c40bfd6",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fe13b47724babc8c40bfd6",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_009_st11_d_d1_1-1744704380915-805495088.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T08:07:16.324Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fe19a17724babc8c40bff9",
							"scanId": "67fe19a17724babc8c40bff7",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fe19a17724babc8c40bff7",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_007_st11_d_d2_1-1744705922372-103533160.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T08:32:33.451Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fe4c26288ec887709f5218",
							"scanId": "67fe4c26288ec887709f5217",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fe4c26288ec887709f5217",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_001_st01_d_d2_1-1744708254827-991404506.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T12:08:06.231Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fe5765d78322bed8c30afa",
							"scanId": "67fe5765d78322bed8c30af9",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fe5765d78322bed8c30af9",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_005_st11_d_d2_1-1744721234378-585062375.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T12:56:05.832Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						},
						{
							"id": "67fe58f4ec2fb4b42b442d63",
							"scanId": "67fe58f4ec2fb4b42b442d62",
							"subsampleId": "67fd2b087724babc8c40bc95",
							"scan": {
								"id": "67fe58f4ec2fb4b42b442d62",
								"url": "/Volumes/sgalvagno/plankton/zooscan_zooprocess_test/Zooscan_apero_pp_2023_wp2_sn002/Zooscan_scan/_raw/apero2023_pp_wp2_005_st11_d_d1_1-1744722130000-285157118.tif",
								"type": "SCAN",
								"createdAt": "2025-04-15T13:02:44.803Z",
								"userId": "67d2a8e28d769787349edfc2",
								"instrumentId": "67d2e965b9c2783283859438",
								"background": false,
								"archived": false,
								"deleted": false,
								"deletedAt": null,
								"projectId": "67d7a84fff15a5db7ee64f9e"
							}
						}
					]
				}
			}
		],
		"user": {
			"id": "67d2a8e28d769787349edfc2",
			"email": "seb@seb.com",
			"name": "seb",
			"image": null,
			"emailVerified": null,
			"password": "$2b$10$4fPrSgkJxM438VPSvFLlWuHJXLTRRQzh294zNomu/RjyEF0Py4GPO",
			"role": "USER"
		}
	},
    */
    const formatData = (data:any) => {
    
        const scans = Object.keys(data).map( (_scan) => {
    
            try {
          console.log("scans: ", _scan);
  
          if ( _scan == "key"){
              console.error("ARRGG indey == key");
              console.log("ARRGG indey == key")
              console.debug(data);
              console.log("pfffff")
              return null
          } else {
            const s = data[_scan]
            console.debug("data[_scan]:",s)

            const scanSubsamples = s.scanSubsamples
           if ( scanSubsamples.length == 0) return null

            const  scanSubsample = scanSubsamples[0]
            const subsample:SubSample = scanSubsample.subsample

            console.log("subsample:",subsample.name)

            const metadata = subsample.metadata
            const fraction_id = metadata.find(m => m.name == "fraction_id")
            const frac_min = metadata.find(m => m.name == "fraction_min_mesh")
            const frac_sup = metadata.find(m => m.name == "fraction_max_mesh")
            const observation = metadata.find(m => m.name == "observation")
  

            const qc = s.SubSample?.qc

            return {
              id: s.id,
              name: s.scanSubsamples[0].subsample.name, 
              creator: s.user.name,
              qc: s.qc || "TODO",  
              fraction_id : fraction_id?.value || "",
              frac_min: frac_min?.value || "",
              frac_sup: frac_sup?.value || "",
              observation: observation?.value || "",
              action:s.url
            }  
        }
        } 
        catch (e){
            console.error("Error at scan ", _scan, " E=" , e)
            return null
        }
        }).filter(Boolean)
        return scans
    }



    const ShowScanData = () => {
        console.debug(scanList)
        return <ScanTable projectId={projectid} scans={scanList}/>
    }


    return (
		<>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
           

            <Card className="inline-block "
                    data-testid="backgroundCard" 
                >
                <CardHeader className="flex flex-row py-3">
                    {/* <div>
                        <h1>Available sub sample scans</h1>
                        <h4>Subsamples read from file: </h4>
                    </div> */}
                </CardHeader>
                <CardBody>
                    <ShowScanData/>
                </CardBody>

            </Card> 
        </div>
    </section>
	<section>
		<Debug params={projectid} title={"Project ID:" + projectid}  open={false}/> 
		<Debug params={scanList} title="scanList" pre={true}/>
	</section>
	</>

    );
};

export default Scans;

