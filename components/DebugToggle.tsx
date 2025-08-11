import { useEffect, useState } from 'react';
import DebugStore from '@/lib/debug-store';
import { NODE_ENV } from '@/constants';

export default function DebugToggle() {
  const [enabled, setEnabled] = useState(DebugStore.getInstance().get());

  useEffect(() => {
    const unsubscribe = DebugStore.getInstance().subscribe(setEnabled);
    return unsubscribe;
  }, []);

  if (NODE_ENV === 'production') return null;

  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
      <label>
        Debug:
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => DebugStore.getInstance().toggle()}
        />
      </label>
    </div>
  );
}
