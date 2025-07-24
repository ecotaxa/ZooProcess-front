import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';

interface TimedScanButtonProps {
  onScan: () => void;
  onPreview: () => Promise<void>;
  initialTime: number;
  scanCompleted: boolean;
}

export const TimedScanButton: React.FC<TimedScanButtonProps> = ({
  onScan,
  onPreview,
  initialTime,
  scanCompleted,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (scanCompleted) {
      setTimeLeft(initialTime);
      setIsRunning(true);
    }
  }, [scanCompleted, initialTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handlePreview = async () => {
    await onPreview();
    setTimeLeft(initialTime);
    setIsRunning(true);
  };

  return (
    <>
      <Button
        isDisabled={timeLeft === 0 ? false : true}
        onPress={timeLeft === 0 ? onScan : () => {}}
        color="primary"
      >
        {timeLeft > 0 ? `Wait (${timeLeft}s)` : 'Scan'}
      </Button>
      <Button onPress={handlePreview} color="secondary">
        Preview
      </Button>
    </>
  );
};
