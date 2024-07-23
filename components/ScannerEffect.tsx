import React, { useState, useEffect } from 'react';
import styles from './ScannerEffect.module.css';

interface ScannerEffectProps {
  imageSrc: string;
  scanDuration?: number;
  onScanComplete: () => void;
}

export const ScannerEffect: React.FC<ScannerEffectProps> = ({ 
  imageSrc, 
  scanDuration = 3000,
  onScanComplete 
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [showLine, setShowLine] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setShowLine(false);
          onScanComplete();
          return 100;
        }
        return prevProgress + 1;
      });
    }, scanDuration / 100);

    return () => clearInterval(interval);
  }, [scanDuration, onScanComplete]);

  return (
    <div className={styles.scannerContainer}>
      <div className={styles.scannerImageContainer}>
        <div 
          className={styles.scannerImage} 
          style={{ 
            backgroundImage: `url(${imageSrc})`,
            width: `${scanProgress}%`
          }} 
        />
      </div>
      {showLine && <div className={styles.scannerLine} style={{ left: `${scanProgress}%` }} />}
    </div>
  );
  
};
