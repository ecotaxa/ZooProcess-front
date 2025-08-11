import { CheckCircleIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/20/solid';
import type { FC } from 'react';
import { ViewfinderCircleIcon } from '@heroicons/react/16/solid';

function Icon({ index, doneUpTo }: Readonly<{ index: number; doneUpTo: number }>) {
  if (index < doneUpTo) {
    return <CheckCircleIcon className="h-6 w-6 mx-1 stroke-green-400" />;
  }
  if (index == doneUpTo) {
    return <ViewfinderCircleIcon className="h-6 w-6 mx-1 stroke-blue-400" />;
  }
  return <MagnifyingGlassCircleIcon className="h-6 w-6 mx-1 stroke-blue-400" />;
}

interface PageProps {
  current: number;
}

export const SubsampleProcessTimeline: FC<PageProps> = props => {
  const current = props.current; // || 0

  const defaultList = [
    { text: 'Check Scan', checked: false }, // Show MSK and segmentation stats
    { text: 'Separate', checked: false }, // Call ML for auto separation, validate/modify each separated vignette
    { text: 'Upload', checked: false }, // Ask for EcoTaxa project and upload data to it
  ];
  let list = defaultList;

  const Items = () => {
    return list.map((item, index) => {
      return (
        <div key={item.text} className="flex flex-row w-full   ">
          <div className="flex-grow">
            <div className="flex  flex-row {item.text} p-1">
              <span>
                <Icon index={index} doneUpTo={current} />
              </span>
              <span className="inline-block">{item.text}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full flex flex-nowrap ">
      <Items />
    </div>
  );
};
