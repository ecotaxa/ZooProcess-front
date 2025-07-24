import * as React from 'react';
import DebugStore from '@/lib/debug-store.ts';
import {debug} from '@/config/settings.js';
import {useNavigate} from 'react-router-dom';
import '@/lib/i18n.config';

export interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({children}: ProvidersProps) {
    useNavigate();
    React.useEffect(() => {
        DebugStore.init(debug);

        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                DebugStore.getInstance().toggle();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <>
            {children}
        </>
    );
}
