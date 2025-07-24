import { Code, Switch, Tooltip } from '@heroui/react';
import { useEffect, useState } from 'react';
import DebugStore from '@/lib/debug-store';

export const Debug = ({
  params,
  title = 'debug',
  open = false,
  pre = false,
}: {
  params: any;
  title?: string;
  open?: boolean;
  pre?: boolean;
}) => {
  const [enabled, setEnabled] = useState(false); // from DebugStore
  const [isSelected, setIsSelected] = useState(open); // local toggle

  useEffect(() => {
    try {
      const store = DebugStore.getInstance();
      setEnabled(store.get());
      const unsubscribe = store.subscribe(setEnabled);
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.warn('DebugStore not initialized');
    }
  }, []);
  if (!enabled) return null;

  const ShowError = () => {
    if (!isSelected) return null;

    return (
      <div className="xm-sm-max-100 w-50">
        {pre ? (
          <div className="w-1/2 mx-auto text-left bg-gray-100 p-3 rounded shadow overflow-auto">
            <pre>{JSON.stringify(params, null, 2)}</pre>
          </div>
        ) : (
          <>{JSON.stringify(params, null, 2)}</>
        )}
      </div>
    );
  };

  return (
    <>
      <Tooltip
        delay={1000}
        color="primary"
        content={<div className="xm-sm-max-100">{JSON.stringify(params)}</div>}
      >
        <div className="flex flex-col gap-2">
          <Switch isSelected={isSelected} onValueChange={setIsSelected} size="sm" color="secondary">
            {title}
          </Switch>
        </div>
      </Tooltip>

      <ShowError />
    </>
  );
};
