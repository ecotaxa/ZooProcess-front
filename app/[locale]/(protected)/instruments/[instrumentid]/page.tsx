// import { ErrorComponent } from "@/components/ErrorComponent";
// import { MySpinner } from "@/components/mySpinner";
// import { scannerCalibrationElements, scannerForm, scanningOptions } from "@/config/formElements";
import { FC, useState } from 'react';
// import { Stack } from '@mui/material';
// import { MyForm } from '@/components/myForm';
// import { useInstrument } from '@/app/api/instruments';
// import { CalibrationTable } from './calibration-table';
// import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { getInstrument } from '@/app/api/data/instrument';

// import InstrumentDetail, { instrumentDetail } from './instrumentDetail';
import InstrumentDetail from './instrumentDetail';
// import { Instrument } from '@/app/api/network/interfaces';
interface pageProps {
  params: {
    // instrument: Instrument,
    instrumentid: string;
    // onChange: ()=>void,
    // onCancel: ()=>void
  };
}

const InstrumentPage: FC<pageProps> = async ({ params }) => {
  // const navigate = useNavigate();
  const instrumentId = params.instrumentid;
  // const { instrument, isLoading, isError } = useInstrument(instrumentId)
  const instrument = await getInstrument(instrumentId);

  // const onChange = (value: any) => {
  //   console.log("Instrument metadata onChange:", value)
  //   return // TODO updateProject(value);
  // }

  // const onCancel = () => {
  //     // Implement cancel logic here if needed
  // }

  // const p = {
  //   instrument,
  //   // onChange:()=>{},
  //   // onCancel:()=>{}

  // }

  return (
    // <>
    // <Head>
    //     <title>Instrument | ZooProcess</title>
    // </Head>
    // <h1>{instrumentId}</h1>
    // <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
    //   <div className="text-center justify-center">
    //     <Stack spacing={3}>
    //     <h1>Instrument</h1>
    //         <InstrumentForm/>
    //         <Card className="inline-block" data-testid="calibrationCard">
    //         <CardHeader className="flex flex-row-reverse py-3">
    //             <Button
    //                 href={`/instruments/${instrumentId}/new`}
    //                 as={Link}
    //                 color="primary"
    //                 data-testid="newBtn"
    //                 >Add new calibration</Button>
    //         </CardHeader>
    //          <CardBody>
    //         {instrument && 'id' in instrument && <CalibrationTable calibrations={instrument.ZooscanCalibration} instrument={{
    //           id: instrument.id,
    //             model: instrument.model,
    //             name: instrument.name,
    //             sn: instrument.sn
    //         }} refreshTrigger={refreshTrigger}/>}
    //         </CardBody>
    //         </Card>
    //     </Stack>
    //   </div>
    // </section>
    // </>
    <div>
      {/* <InstrumentDetail params={p}/> */}
      <InstrumentDetail {...{ instrument: instrument }} />
    </div>
  );
};

export default InstrumentPage;
