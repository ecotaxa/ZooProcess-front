import { Instrument } from "../network/interfaces";
import { getInstruments } from "./instrument";

/**
 * Fetches instrument data from the database
 * @param full - When true, returns instruments with their calibration settings. When false, returns only basic instrument list
 * @returns Promise containing array of Instrument objects
 */
export default async function AsyncInstrumentData(full:boolean=false): Promise<Array<Instrument>> {
  
    return  await getInstruments(full)
    
    
    }