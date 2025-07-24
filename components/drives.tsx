import { Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import AsyncDriveData from '@/app/api/data/AsyncDriveData';
import { Drive } from '@/app/api/network/interfaces';

interface Item {
  id: string;
  name: string;
}

interface FormItem {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  label: string;
  required: boolean;
  choice: Array<Item>;
  onChange: (name: string, value: string) => {};
}

const Drives = (props: FormItem) => {
  const drivelist = AsyncDriveData();
  const [drives, setDrives] = useState<Drive[]>([]);

  const [value, setValue] = useState(props.value || 0);

  useEffect(() => {
    const fetchDrives = async () => {
      const drivesData = await drivelist; // wait the Promise return
      console.log('AsyncDriveContent useEffect: ', drivesData);
      setDrives(drivesData);
    };
    fetchDrives();
  }, []);

  // manage user selection
  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  // just for log
  useEffect(() => {
    console.log('drives have changed:', drives);
  }, [drives]);

  const handleChange = (value: string /* event: SelectChangeEvent*/) => {
    console.debug('handleChange: ', value);

    if (props.onChange) {
      props.onChange(props.name, value);
    }
    //console.debug("setValue:", value)
    setValue(value);
  };

  // console.debug("Drives: ", drives);
  // console.debug("SELECT props:", props);
  let opts: any = {
    id: props.name,
    items: drives,
    label: props.label || 'Drives',
    placeholder: props.placeholder || 'Choose your folder',
    className: 'max-w-xs',
  };

  // console.debug("added props");
  if (props.value) {
    opts['defaultSelectedKeys'] = [props.value];
  }
  if (props.required == true) {
    opts['isRequired'] = true;
  }

  return (
    <>
      {/* <Debug params={[{props:props},{opts:opts},{hasError:isError}]} title={props.name} /> */}
      <Select onChange={event => handleChange(event.target.value)} {...opts}>
        {(item: Item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
      </Select>
    </>
  );
};

export default Drives;
