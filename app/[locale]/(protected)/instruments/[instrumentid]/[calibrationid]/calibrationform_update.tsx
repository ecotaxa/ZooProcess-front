import { calibrationUpdate } from '@/app/api/instruments';
import { ICalibration, Instrument } from '@/app/api/network/interfaces';
import { MyForm } from '@/components/myForm';
import { scannerCalibrationElements } from '@/config/formElements';
import { FC } from 'react';

// export const forms = [scannerCalibrationElements]

interface pageProps {
  params: {
    instrument: Instrument;
    calibration: ICalibration;
    onRefresh: () => void;
  };
}

const UpdateCalibrationForm: FC<pageProps> = ({ params }) => {
  const { instrument, calibration } = params;
  const navigate = useNavigate();

  const onChange = async (value: any) => {
    // onChange it calls by myForm that manage the promise returned
    console.log('onChange: ', value);
    return calibrationUpdate({ data: value });
  };

  const onCancel = () => {
    router.back();
  };

  const formButtons = {
    submit: 'Update',
  };

  const formatData = (instrument: Instrument) => {
    // const updatedForm = forms
    const myCalibration = instrument?.ZooscanCalibration?.find(
      (cal: ICalibration) => cal.id == calibration.id
    );

    const form: any = [];
    form['forms'] = [scannerCalibrationElements];
    form['value'] = myCalibration;
    form['title'] = 'Settings';
    form['subtitle'] = 'Fill all the mandatory fields.';

    return form;
  };

  const showForm = (instrument: Instrument | never[], calibration: ICalibration) => {
    const form = formatData(instrument as Instrument);

    return <MyForm {...form} onChange={onChange} onCancel={onCancel} button={formButtons} />;
  };

  return <>{showForm(instrument, calibration)}</>;
};

export default UpdateCalibrationForm;
