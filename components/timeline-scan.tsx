import { CheckCircleIcon, XCircleIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/20/solid"
import { FC } from "react"

interface pageProps {
      current: number
      done?: number
  }
export const Timeline_scan: FC<pageProps> = (props) => {
  const current = props.current; // || 0
  const done = props.done || Math.round(current) - 1;

  const list = [
    { text: "Fill Metadata", checked: true },
    { text: "Background", checked: false },
    { text: "Preview", checked: false },
    { text: "Scan", checked: true },
    { text: "Process", checked: false },
    { text: "Check", checked: false },
  ];

  // function Icon(index: number) {
  function Icon({ index }: { index: number }) {
    if (index <= current) {
      if (index <= done) {
        return <CheckCircleIcon className="h-6 w-6 mx-1 stroke-green-400" />;
      } else {
        return (
          <MagnifyingGlassCircleIcon className="h-6 w-6 mx-1 stroke-blue-400" />
        );
      }
    } else {
      return <XCircleIcon className="h-6 w-6 mx-1 stroke-red-400" />;
    }
  }

  const Items = () => {
    return list.map((item, index) => {
      return (
        <div key={index} className="flex flex-row   gap-40 border  ">
          {/* <div className="flex flex-row   gap-40 border"> */}
          <div className="flex-none grow-0  border border-red-400">
            {/* {item.checked? ( */}
            {/* { index <= current? (
                        if ( done && index <= done ) {
                            <CheckCircleIcon className="h-6 w-6 mx-1 stroke-green-400"/>
                        } else {
                            <MagnifyingGlassCircleIcon className="h-6 w-6 mx-1 stroke-blue-400"/>
                        }

                    ) : (
                        <XCircleIcon className="h-6 w-6 mx-1 stroke-red-400" color="red"/>
                    )} */}
            <Icon index={index} />
          </div>
          <div className="grow  bg-blue-800">
            <p className="w-max  text-center">{item.text}</p>
          </div>
          {/* <div className="grow bg-yellow-200"></div> */}
          {/* </div> */}
        </div>
      );
    });
  };

  return (
    <div className="w-full flex flex-nowrap border">
      {/* "grid grid-cols-5 gap-4"> */}

      <Items />
    </div>
  );
};
