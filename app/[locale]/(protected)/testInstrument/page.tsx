import Instruments from '@/components/instruments';

const TestInstrumentPage = () => {
  const params = {
    name: 'instrument',
    placeholder: 'Instrument',
    label: 'Intrument',
    tag: 'Instrument',
    required: true,
    disabled: false,
    variant: 'outlined',
    fullWidth: true,
    xs: 12,
    sm: 12,
    size: 'small',
  };

  const onChange = (name: string, value: string) => {
    console.log('name: ', name, ' value: ', value);
  };

  const p = {
    ...params,
    onChange: onChange,
  };

  return (
    <>
      <h1>Test Instrument</h1>
      <Instruments FormItem={params} />
    </>
  );
};

export default TestInstrumentPage;
