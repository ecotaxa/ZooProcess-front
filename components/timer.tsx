import { useEffect, useState } from 'react';
import CircularTimer from './CircularTimer';

interface TimerProps {
  initialTime?: number;
  onComplete?: () => void;
}
const Timer: React.FC<TimerProps> = ({ initialTime = 30, onComplete }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsRunning(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            console.log('Timer completed');
            // onComplete?.();
            setTimeout(() => {
              onComplete?.(); // Ensure a delay before calling onComplete
            }, 500); // Add a delay before calling onComplete
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // }, [isRunning, onComplete]);
  }, [isRunning]);

  return (
    <div>
      <CircularTimer time={time} totalTime={initialTime} />
    </div>
  );
};

export default Timer;
