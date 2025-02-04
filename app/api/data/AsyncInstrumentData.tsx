import { Instrument } from "../network/interfaces";
import { getInstruments } from "./instrument";

export default async function AsyncInstrumentData(): Promise<Array<Instrument>> {
  
    return  await getInstruments()
    
    
    }