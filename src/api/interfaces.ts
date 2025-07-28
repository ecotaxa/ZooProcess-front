export interface Drive {
  id: string;
  name: string;
  url: string;
}

interface MinProject {
  id: string;
  name: string;
  acronym: string;
  description: string;
  driveId: string;
  ecotaxaId?: string;
  ecotaxa?: Ecotaxa;
  instrumentId?: string;
  instrument?: Instrument;
  scanningOptions?: string;
  samples: Array<Sample>;
  qc?: string;
}

export interface Project extends MinProject {
  drive: Drive;
  createdAt: Date;
  updatedAt: Date;
}

export type Projects = Array<Project>;

export interface Sample {
  id: string;
  name: string;
  metadata: Array<IMetadata>;
  subsample: Array<SubSample>;
  projectId: string;
  project: Project;
}

export type Samples = Array<Samples>;

export interface SubSample {
  id: string;
  name: string;
  metadata: Array<IMetadata>;
  createdAt: Date;
  updatedAt: Date;
  scan: Array<Scan>;
}

export type SubSamples = Array<SubSample>;

export enum ScanTypeEnum {
  RAW_BACKGROUND = 'RAW_BACKGROUND', // From scanner, up to 2 of them with names "back_large_raw_1.tif" and "back_large_raw_2.tif"
  BACKGROUND = 'BACKGROUND', // 8-bit version of the raw backgrounds, same name without "_raw"
  MEDIUM_BACKGROUND = 'MEDIUM_BACKGROUND', // Addition of the 2
  SCAN = 'SCAN',
  MASK = 'MASK',
  VIS = 'VIS',
  CHECK_BACKGROUND = 'CHECK_BACKGROUND',
  OUT = 'OUT',
  SEP = 'SEP', // Separator GIF
}

export interface Scan {
  id: string;
  url: string;
  type: ScanTypeEnum;
  archived: boolean;
  deleted: boolean;
  metadata: Array<IMetadata>;
}

export interface Ecotaxa {
  id: string;
}

export interface ProjectUpdate extends MinProject {
  updatedAt: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  token?: string;
  role?: string;
}

export interface MetadataTemplate {
  id: string;
  name: string;
  description: string;
  // countSample: number
  // countSubSample: number
}

export interface IMetadata {
  name: string;
  value: string;
  type: string;
}

export interface Background {
  id: string;
  name: string;
  url: string;
  user: User;
  instrument: Instrument;
  createdAt: string; // Date
  error?: object;
}

export interface ICalibrationForm {
  instrumentId: string;
  frame: string;
  xOffset: number;
  yOffset: number;
  xSize: number;
  ySize: number;
  archived?: boolean;
}

export interface ICalibration extends ICalibrationForm {
  id: string;
}

export interface Instrument {
  id: string;
  model: string;
  name: string;
  sn: string;
  ZooscanCalibration?: Array<ICalibration>;
}

export interface Vignette {
  id: string;
  url: string;
  type: string;
}

export interface Separator {
  id: string;
  scanId?: string;
  vignette: Array<Vignette>;
}

export interface ITask {
  id: String;
  exec: string;
  params: Object;
  log?: string; // url to log file
  percent: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProcess {
  status: string;
  vignettes: Array<Vignette>;
}

export interface IProcessMultiple extends IProcess {
  mask?: string;
  out?: string;
  vis?: string;
  log?: string;
}

export interface IScan {
  url: string;
  type: string; // scan type : PRISMA.type.typescan SCAN, VIGNETTE, SEPARATOR
  instrumentId: string;
  projectId: string;
}
