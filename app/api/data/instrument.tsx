"use server";

import { ICalibration, Instrument } from "../network/interfaces";
import * as api from '@/app/api/network/zooprocess-api' 


export async function getInstruments(): Promise<Array<Instrument>>{  

    try {
      const instruments = await api.getInstruments()
      return instruments;
    } catch (error) {
      console.error("Error - getDrives()", error);
      throw error;
    } 
}


export async function getInstrument(instrumentId:string): Promise<Instrument>{  

    try {
      const instruments = await api.getInstrument(`/instruments/${instrumentId}`)
      return instruments;
    } catch (error) {
      console.error("Error - getDrives()", error);
      throw error;
    } 
}


export async function getCalibration(instrument:Instrument, calibrationId:string): Promise<ICalibration>{
    // try {
    // const calibration = await api.getCalibration(`/calibrations/${calibrationId}`) 
    //     return calibration;
    // } catch (error) {
    //     console.error("Error - getCalibration()", error);
    //     throw error;
    // }

    const calibrations = instrument.ZooscanCalibration
    if ( calibrations ) {
        const calibration = calibrations.find(c => c.id === calibrationId)
        if (calibration) {
        return Promise.resolve(calibration)
        }
        else {
        return Promise.reject(new Error(`Calibration ${calibrationId} not found`))
        }
    }

    // const calibration = find(c => c.id === calibrationId)
    return Promise.reject(new Error(`Calibration ${calibrationId} not found`))

}


export async function updateInstrument(instrument:Instrument) { //}: Promise<Instrument>{
    // try {
    //   const updatedInstrument = await api.updateInstrument(instrument)
    //   return updatedInstrument;
    // } catch (error) {
    //   console.error("Error - updateInstrument()", error);
    //   //throw error;
    //   return Promise.reject(error);
    // }

    return api.updateInstrument(instrument)
    .then((response) => {
      console.log("Instrument added OK");
      return Promise.resolve( { data:response, message:"Instrument have been added"})
    })
    .catch ((error) =>  {
      console.error("Instrument added NOK: ", error);
      console.log("instrument: ", instrument);
      throw (error.message)
    })
}


