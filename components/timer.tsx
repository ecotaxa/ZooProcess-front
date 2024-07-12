

import React, { useState, useEffect } from 'react';
import CircularTimer from './CircularTimer';

interface TimerProps {
  initialTime?: number;
  onChange?: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime = 0, onChange }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0 && onChange) {
            onChange();
            setIsRunning(false);
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [isRunning, onChange]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    // return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return `${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <CircularTimer time={time} totalTime={initialTime} />
      <h1>{formatTime(time)}</h1>
    </div>
  );
};

export default Timer;

