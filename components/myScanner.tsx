import { useCallback, useEffect, useState } from "react";
import ScannerComponent from "./Scanner";
import { Debug } from "./Debug";

interface IScanner {
    id: string
    settingsId?: string
}
export function MyScanner(props: any) {
    console.log("MyScanner props: ", props);
    const [value, setValue] = useState<string|IScanner|null>(props.value);

    const handleChange = useCallback( (value:IScanner) => {
        console.log("handleChange value: ", value)
        setValue(value);
        if (props.onChange){
            props.onChange(props.name, value)
        }
    }, []);

    useEffect(() => {
        console.debug("MyScanner useEffect[] value: ", value)
        if (props.value !== undefined) {
          setValue(props.value);
        }
      }, [props]);

      return (
        <>
        {/* <Debug title="MyScanner" params={{value,props}} /> */}

        <ScannerComponent value={value} onChange={handleChange} />
        </>
      );

}
