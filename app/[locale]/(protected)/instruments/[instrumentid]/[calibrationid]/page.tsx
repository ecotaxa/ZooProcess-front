import { FC } from 'react';

import UpdateCalibrationForm from './calibrationform_update';
import { getCalibration, getInstrument } from '@/app/api/data/instrument';

interface pageProps {
  params: {
    instrumentid: string;
    calibrationid: string;
  };
}

const UpdateCalibrationPage: FC<pageProps> = async ({ params }) => {
  const instrument = await getInstrument(params.instrumentid);
  const calibration = await getCalibration(instrument, params.calibrationid);

  const updatedParams = {
    calibration,
    instrument,
    onRefresh: () => {},
  };

  return (
    <>
      <UpdateCalibrationForm params={updatedParams} />
    </>
  );
};

export default UpdateCalibrationPage;
