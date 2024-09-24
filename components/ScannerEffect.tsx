import React, { useState, useEffect } from 'react';
import styles from './ScannerEffect.module.css';

interface ScannerEffectProps {
  imageSrc: string;
  scanDuration?: number;
  onScanComplete: () => void;
  triggerScan: boolean;
}

export const ScannerEffect: React.FC<ScannerEffectProps> = ({ 
  imageSrc, 
  scanDuration = 3000,
  onScanComplete,
  triggerScan
}) => {
  const [curtainWidth, setCurtainWidth] = useState(100);
  const [showLine, setShowLine] = useState(true);
  const [blackLayerVisible, setBlackLayerVisible] = useState(true);


  useEffect(() => {
    if (triggerScan) {
        setBlackLayerVisible(true);
        setCurtainWidth(120);
        setShowLine(true);
    //   setEnable(false);
    //   setTime(timer);
    }
  }, [triggerScan]);//, timer]);
  

  useEffect(() => {
    // if (triggerScan) {
    //   setCurtainWidth(100);
    //   setShowLine(true);
      const interval = setInterval(() => {
        setBlackLayerVisible(false);
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
    // }
  }, [scanDuration, onScanComplete]);

  return (
    <div className={styles.scannerContainer}>
      <img src={imageSrc} alt="Scanned" className={styles.scannerImage} />
      {blackLayerVisible && <div className={styles.blackLayer} />}
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
