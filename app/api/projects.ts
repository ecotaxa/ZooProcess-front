import * as api from '@/app/api/network/zooprocess-api';
import { Project, ProjectUpdate } from './network/interfaces';

export async function addProject(project: any) {
  console.debug('addProject starting with:', project);

  try {
    const response = await api.addProject(project);
    console.debug('addProject success:', response);
    return response;
  } catch (error: any) {
    console.debug('addProject caught error:', error);
    // Extract message from error object
    const errorMessage =
      error.message ||
      error.response?.data?.message ||
      (typeof error === 'object' ? JSON.stringify(error) : error);
    throw new Error(errorMessage);
  }
}

const convertData2api = (data: any) => {
  console.debug('convertData2api(', data, ')');

  const date = new Date();

  let dataConverted: ProjectUpdate = {
    id: data.id,
    name: data.name,
    acronym: data.acronym,
    driveId: data.drive, //Id,
    description: data.description,

    // driveId:data.drive, //Id,
    // instrumentId:data.instrument,

    // only manager options
    scanningOptions: data.scanningOptions, //.currentKey,
    updatedAt: date.toISOString(),

    // instrument
    // instrumentId: data.serial,
    // serial: data.serial,

    // ecotaxa
    ///TODO  copie ecotaxa fields
    // ecotaxa_project_title: data.ecotaxa_project_title,
    // ecotaxa_project_name: data.ecotaxa_project_name,

    ecotaxaId: undefined,
  };

  if (data.instrument) {
    dataConverted.instrumentId = data.instrument;
  }
  if (data.scanningOptions) {
    dataConverted.scanningOptions = data.scanningOptions;
  }
  console.debug('Search data.scanner');
  if (data.scanner) {
    console.debug('found data.scanner');
    dataConverted.instrumentId = data.scanner.id;
    if (data.scanner.settingsId) {
      dataConverted.scanningOptions = data.scanner.settingsId;
    }
  }

  if (data.ecotaxa_project) {
    dataConverted.ecotaxaId = data.ecotaxa_project;
    // dataConverted = {...dataConverted, ecotaxaId : data.ecotaxa_project}
  }

  console.debug('convertData2api dataConverted: ', dataConverted);

  return dataConverted;
};

export async function updateProject(data: any) {
  console.log('updating Project... with: ', data);

  // TODO added info box

  const dataConverted = convertData2api(data);

  console.debug('dataConverted: ', dataConverted);

  return api
    .updateProject(dataConverted)
    .then(response => {
      console.log('Project updated OK', response);
      return Promise.resolve({ data: response, message: 'Project updated' });
    })
    .catch(error => {
      console.error('Project updated NOK: ', error);
      throw error.message;
    });
}
