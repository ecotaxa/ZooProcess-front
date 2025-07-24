import { useState, useEffect } from 'react';

export function useHash() {
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Get initial hash
    const getHash = () => window.location.hash || '';

    // Set initial hash
    setHash(getHash());

    // Listen for hash changes
    const handleHashChange = () => {
      setHash(getHash());
    };

    window.addEventListener('hashchange', handleHashChange);

    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return hash;
}
