import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';

export function MySelect(props) {
  const [value, setValue] = useState(
    // props.value!==null ? props.value : 0
    props.value || 0
  );
  // setValue(props.value)

  // if ( props.value==='' ){ setValue(0)}

  const handleChange = (value /* event: SelectChangeEvent*/) => {
    if (props.onChange) {
      props.onChange(props.name, value);
    }
    setValue(value);
  };

  const opts = {};
  if (props.required === true) {
    opts['required'] = true;
  }

  opts['xs'] = props.xs;
  opts['sm'] = props.sm;

  const sxValue = () => {
    var sx = {};
    if (props.sx !== undefined) {
      return props.sx;
    }
    return sx;
  };

  // const renderValue = () =>{
  //     if (value===''){return ''}

  //     return props.choice[value]
  // }

  return (
    <FormControl {...opts} fullWidth={props.fullWidth} sx={sxValue()} size="regular">
      <InputLabel id="demo-select-small-label">{props.name}</InputLabel>
      <Select
        value={value}
        // key={value}
        onChange={event => handleChange(event.target.value)}
        displayEmpty={true}
        // renderValue={ () => renderValue() }
        // renderValue={ () => {if (value===''){return ''} } }
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {
          // console.log(props.choice)
        }
        <MenuItem key={0} value={0}></MenuItem>
        {props.choice.map(choix => (
          // <MenuItem value={choix.id} key={choix.id}>{choix.value}</MenuItem> // ne change rien pour le warning 'list should have a unique "key" prop'
          //<MenuItem key={choix.id} value={choix.id.toString()}>{choix.value}</MenuItem>
          <MenuItem key={choix.id} value={choix.id}>
            {choix.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
