import { MySelect } from './mySelect5';
import { MyInputSelect } from './myInputSelect';
import { MyTextField } from './myTextField2';
import { MyTextArea } from './myTextArea';

import { MyDatePicker } from './myDatePicker.old';

import Drives from './drives';
import Instruments from './instruments';
import { Input } from '@heroui/input';
import MyMap from './myMap';
import ScannerComponent from './Scanner';
import { MyScanner } from './myScanner';

export function FormElements(props) {
  const mui = false;

  switch (props.tag) {
    case 'DisabledField':
      let propsUpdated = { ...props };
      if (props.myValues) {
        console.log('props.myValues:', props.myValues);
        if (props.myValues[props.name]) {
          propsUpdated.value = props.myValues[props.name];
        } else {
          console.debug('props.myValues[props.name] is undefined');
        }
      } else {
        console.debug('props.myValues is undefined');
      }

      let opt = {};
      if (props.fn2) {
        const params = props.fn2.params.slice(1).slice(0, -1).split(',');
        let param = {};
        params.forEach(element => {
          if ((!element) in props) {
            throw `params error in fn2. ${element} don't exist`;
          }
          param[element] = props[element];
        });

        const prefix = new Function(props.fn2.params, props.fn2.func);
        opt['startContent'] = prefix(param);
      }

      return (
        <>
          <Input readOnly={true} value={props.myValues[props.name]} {...opt} />
        </>
      );

    case 'TextField':
      let opts = {};
      if (props.update) {
        opts.onChange = props.onChange;
      }

      return (
        <MyTextField
          {...props}
          key={props.name}
          project={props.project}
          sample={props.sample}
          subsample={props.subsample}
          {...opts}
        />
      );

    case 'Drives':
      return <Drives key={props.name} {...props} onChange={props.onChange} />;

    case 'Instruments':
      return <Instruments key={props.name} {...props} onChange={props.onChange} />;

    case 'Map':
      console.log('MAP props: ', props);
      return <MyMap key={props.name} {...props} onChange={props.onChange} />;

    case 'Scanner':
      console.log('MAP props: ', props);
      return <MyScanner key={props.name} {...props} onChange={props.onChange} />;

    case 'Select':
      return <MySelect {...props} key={props.name} onChange={props.onChange} />;

    case 'InputSelect':
      return <MyInputSelect {...props} key={props.name} onChange={props.onChange} />;

    case 'DateField':
      <MyDatePicker {...props} key={props.name} onChange={props.onChange} />;

    case 'TextArea':
      return <MyTextArea {...props} key={props.name} onChange={props.onChange} />;

    case 'Empty':
      return <div></div>;
  }

  return (
    <div>
      <div>Issue on input field :</div>
      <div>
        <ul>
          <li>Name:{props.name || 'no name'} </li>
          <li>Tag: {props.tag || 'no tag'}</li>
        </ul>
      </div>
      <div>{JSON.stringify(props)}</div>
    </div>
  );
}
