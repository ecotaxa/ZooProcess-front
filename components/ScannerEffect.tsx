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
  const [curtainWidth, setCurtainWidth] = useState(100);
  const [showLine, setShowLine] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurtainWidth((prevWidth) => {
        if (prevWidth <= 0) {
          clearInterval(interval);
          setShowLine(false);
          onScanComplete();
          return 0;
        }
        return prevWidth - 1;
      });
    }, scanDuration / 50);

    return () => clearInterval(interval);
  }, [scanDuration, onScanComplete]);

  return (
    <div className={styles.scannerContainer}>
      <img src={imageSrc} alt="Scanned" className={styles.scannerImage} />
      <div 
        className={styles.curtain} 
        style={{ width: `${curtainWidth}%` }}
      />
      {showLine && (
        <div 
          className={styles.scannerLine} 
          style={{ left: `${100 - curtainWidth}%` }}
        />
      )}
    </div>
  );
};
