// "use server";

import useSWR from 'swr';

import * as api from '@/app/api/network/zooprocess-api';

export async function addCalibration({ instrumentId /*:string*/, data /*:any*/ }) {
  console.log('adding Calibration...');
  console.log(instrumentId);
  console.log(data);

  if (!instrumentId) {
    console.error('Instrument ID is required');
    return Promise.reject('Instrument ID is required');
  }

  if (!data) {
    console.error('Data is required');
    return Promise.reject('Data is required');
  }

  if (data.instrumentId !== instrumentId) {
    console.error('Instrument ID in data does not match');
    return Promise.reject('Instrument ID in data does not match');
  }

  if (!data.instrumentId) {
    data.instrumentId = instrumentId;
  }

  return api
    .addCalibration(data)
    .then(response => {
      console.log('Calibration added OK');
      return Promise.resolve({ data: response, message: 'Calibration added' });
    })
    .catch(error => {
      console.error('Calibration added NOK: ', error);
      throw error.message;
    });
}

// @obsolette
// keep it, but unused at this moment. we forbid the calibration/setting update if a scan has been linked to it
export async function calibrationUpdate({ data /*:any*/ }) {
  console.trace('calibrationUpdate stack trace:');
  console.log('calibrationUpdate...', data);
  // console.log("instrumentId:",instrumentId);
  console.log('data:', data);

  if (!data) {
    console.error('Data is required');
    return Promise.reject('Data is required');
  }

  return api
    .updateCalibration(data)
    .then(response => {
      console.log('Calibration updated OK');
      return Promise.resolve({ data: response, message: 'Calibration updated' });
    })
    .catch(error => {
      console.error('Calibration updated NOK: ', error);
      throw error.message;
    });
}
