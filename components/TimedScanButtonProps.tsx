import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";

interface TimedScanButtonProps {
  onScan: () => void;
  onValidate: () => void;
  onPreview: () => void;
  scanDuration: number;
  waitDuration: number;

}

export const TimedScanButton: React.FC<TimedScanButtonProps> = ({
  onScan,
  onValidate,
  onPreview,
  scanDuration,
  waitDuration
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(waitDuration);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWaiting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isWaiting && timeLeft === 0) {
      setIsWaiting(false);
    }
    return () => clearInterval(timer);
  }, [isWaiting, timeLeft]);

  const handleScan = () => {
    setIsScanning(true);
    onScan();
    setTimeout(() => {
      setIsScanning(false);
      setIsWaiting(true);
      setTimeLeft(waitDuration);
    }, scanDuration);
  };

  const handlePreview = () => {
    setIsWaiting(false);
    setTimeLeft(waitDuration);
    onPreview();
  };

  return (
    <>
    <Button
      onPress={isWaiting ? onValidate : handleScan}
      disabled={isScanning}
      color={isWaiting ? "primary" : "secondary"}
    >
      {isScanning ? "Scanning..." : isWaiting ? `Validate (${timeLeft}s)` : "Scan"}
    </Button>
    <Button
          onPress={handlePreview}
          disabled={isScanning}
          color="secondary"
        >
          Preview
    </Button>
    </>
  );
};
