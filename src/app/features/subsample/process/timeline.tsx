import { CheckCircleIcon, XCircleIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/20/solid';
import type { FC } from 'react';

// import { SubsampleProcessPage_old } from 'app/features/subsample/process/page.tsx';

function Icon({
  index,
  current,
  doneUpTo,
}: Readonly<{ index: number; current: number; doneUpTo: number }>) {
  if (index <= current) {
    if (index <= doneUpTo) {
      return <CheckCircleIcon className="h-6 w-6 mx-1 stroke-green-400" />;
    } else {
      return <MagnifyingGlassCircleIcon className="h-6 w-6 mx-1 stroke-blue-400" />;
    }
  } else {
    return <XCircleIcon className="h-6 w-6 mx-1 stroke-red-400" />;
  }
}

interface PageProps {
  current: number;
  done?: number;
  list: { text: string; checked: boolean }[];
}

export const SubsampleProcessTimeline: FC<PageProps> = props => {
  const current = props.current; // || 0
  const done = props.done ?? Math.round(current) - 1;

  const defaultList = [
    // { text: 'Fill Metadata', checked: true },
    // { text: "Background", checked: false },
    // { text: 'Scan', checked: true },
    { text: 'Check Scan', checked: false }, // Show MSK and segmentation stats
    { text: 'Separate', checked: false }, // Call ML for auto separation, validate/modify each separated vignette
    { text: 'Upload', checked: false }, // Ask for EcoTaxa project and upload data to it
  ];
  let list = /*props.list ||*/ defaultList;

  const Items = () => {
    return list.map((item, index) => {
      return (
        <div key={item.text} className="flex flex-row w-full   ">
          {/* // <div key={index} className=" gap-40 border  "> */}
          {/* <div key={index} className="flex flex-row "> */}
          {/* <div className="flex-none grow-0  border border-red-400">
            <Icon index={index} />
          </div>
          <div className="grow  bg-blue-800">
            <p className="w-max  text-center">{item.text}</p>
          </div> */}
          <div className="flex-grow">
            <div className="flex  flex-row {item.text} p-1">
              <span>
                <Icon index={index} current={current} doneUpTo={done} />
              </span>
              <span className="inline-block">{item.text}</span>
            </div>
            {/* <div className="text-left bg-blue-500"> */}
            {/* <p className="text-left bg-blue-500">{item.text}</p> */}
            {/* </div> */}
          </div>
          {/* </div> */}
        </div>
      );
    });
  };

  return (
    <div className="w-full flex flex-nowrap ">
      {/* "grid grid-cols-5 gap-4"> */}
      <Items />
    </div>
  );
};
