import { extend } from "dayjs"
import { string } from "zod"

export interface Drive {
    id:string,
    name:string,
    url:string
}

export interface Ecotaxa {
    id:string
}

interface MinProject {
  id:string,
  name:string,
  acronym: string,
  description: string,
  driveId: string,
  ecotaxaId?: string,
  ecotaxa?: Ecotaxa,
  instrumentId?: string,
  instrument?: Instrument,
  scanningOptions?: string,
  samples?: Array<Sample>,
  qc?: string
}

export interface Project extends MinProject {
  drive:Drive,
  updatedAt: Date,
  createdAt: Date,
}

export interface ProjectUpdate extends MinProject {
  updatedAt: string,
}

export interface User {
  id: string,
  name?: string,
  email?: string,
  image?: string,
  token?: string,
  role?: string
}

export interface MetadataTemplate {
  id: string
  name: string
  description: string
  // countSample: number
  // countSubSample: number 
}

export interface IMetadata {
    name: string
    value: string
    type: string
}

export interface SubSample {
  id: string
  name: string
  metadata: Array<IMetadata>
  // scan: Array<Scan>
  scan: Array<Scan>
}

export interface Scan {
  id: string
  url: string
  type: string
  archived: boolean
  deleted: boolean
  metadata: Array<IMetadata>
}



export interface Background {
  id: string
  name: string
  url: string
  user: User
  instrument: Instrument
  createdAt: string // Date
  error?:object
}

export interface ICalibrationForm {
  instrumentId: string
  frame: string
  xOffset: number
  yOffset: number
  xSize: number
  ySize: number
  archived?: boolean
}

export interface ICalibration extends ICalibrationForm {
    id: string
}

export interface Instrument {
  id: string
  model: string
  name: string
  sn: string
  ZooscanCalibration?: Array<ICalibration>
}

export interface Sample {
    id: string
    name: string
    metadata: Array<IMetadata>
    subsample: Array<SubSample>
    projectId: string
    project: Project
}

export interface Vignette {
  id: string
  url: string
  type: string
}

export interface Separator {
  id: string
  scanId?: string
  vignette: Array<Vignette>
}

export interface ITask {
  id: String
  exec: string
  params: Object
  log?: string // url to log file
  percent:number
  status:string
  createdAt: string
  updatedAt: string
}

// [
//     {
//       "id": "655d3062983b92b6e29b3369",
//       "name": "monproject",
//       "acronym": null,
//       "description": null,
//       "ecotaxaId": null,
//       "updatedAt": null,
//       "createdAt": "2023-11-21T22:34:10.972Z",
//       "driveId": "655c5b54457834999b769d06",
//       "drive": {
//         "id": "655c5b54457834999b769d06",
//         "name": "Zooscan",
//         "url": "file://drives/zooscan"
//       },
//       "ecotaxa": null
//     }
//   ]


export interface Projects {
    data:Array<Project>
}

export interface Samples {
    data:Array<Sample>
}

export interface SubSamples {
  data:Array<SubSample>
}

export interface IProcess {
  status:string,
  vignettes:Array<Vignette>,
}

// interface IPath {
//   path:string
// }

export interface IProcessMultiple extends IProcess {
  mask?: string
  out?: string,
  vis?: string, 
  log?: string
}

// export async function getProject(id:string){

//     const response = await api.get<Project>(`/projects/${id}`);

//     console.log("getProject response: ", response);

//     return response.data; 
// }

export interface IScan {
  url:string, 
  type:string, // scan type : PRISMA.type.typescan SCAN, VIGNETTE, SEPARATOR
  instrumentId:string, 
  projectId:string
}

