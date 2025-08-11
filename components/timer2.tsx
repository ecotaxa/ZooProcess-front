import { useEffect, useState } from 'react';
import CircularTimer from './CircularTimer';

const Timer = ({ duration, onComplete }: { duration: number; onComplete?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [timeLeft]);

  return (
    <div>
      {/* <CircularTimer time={timeLeft} totalTime={duration} /> */}
      Time remaining: {timeLeft} seconds
    </div>
  );
};

export default Timer;
