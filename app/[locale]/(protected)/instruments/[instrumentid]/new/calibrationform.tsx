import { addCalibration } from '@/app/api/instruments';
import { ICalibration, ICalibrationForm, Instrument } from '@/app/api/network/interfaces';
import { MyForm } from '@/components/myForm';
import { scannerCalibrationElements } from '@/config/formElements';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const forms = [scannerCalibrationElements];

interface pageProps {
  params: {
    instrument: Instrument;
  };
}

const CalibrationForm: FC<pageProps> = ({ params }) => {
  console.debug('params: ', params);
  const { instrument } = params;
  console.debug('~instrumentId: ', instrument.id);
  const navigate = useNavigate();

  const [stringifiedData, setData] = useState('');

  const onChange = async (value: any) => {
    console.log('onChange: ', value);

    setData(JSON.stringify(value, null, 2));
    console.log('App onChange:', stringifiedData);

    addCalibration({ instrumentId: instrument.id, data: value }).then(
      (response: any) => {
        console.log('response: ', response);
        console.log('Return to the instrument page');
        // router.back()
        navigate(`/instruments/${instrument.id}`);
        // params.onRefresh()
      },
      (error: any) => {
        console.log('error: ', error);
        // return await Promise.reject(error)
      }
    );
  };

  const onCancel = () => {
    navigate.back();
  };

  const formButtons = {
    submit: 'Add',
  };

  const empty: ICalibrationForm = {
    instrumentId: instrument.id,
    frame: '',
    xOffset: 0,
    yOffset: 0,
    xSize: 0,
    ySize: 0,
  };

  console.debug('empty: ', empty);

  const formatData = (calibration: ICalibration) => {
    console.log('formatData(calibration =', calibration);

    const updatedForm = forms;

    const sn = (instrument as Instrument).name;

    const form: any = [];
    form['forms'] = updatedForm;
    form['value'] = calibration;
    form['title'] = 'Setting' + ' for ' + sn;
    form['subtitle'] = 'Fill all the mandatory fields.';

    return form;
  };

  const showForm = (calibration: ICalibration | any) => {
    const form = formatData(calibration);

    return <MyForm {...form} onChange={onChange} onCancel={onCancel} button={formButtons} />;
    // }
  };

  return <>{showForm(empty)}</>;
};

export default CalibrationForm;
