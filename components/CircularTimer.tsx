import React, { useState, useEffect } from 'react';

interface CircularTimerProps {
  time: number;
  totalTime: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ time, totalTime }) => {
  const radius = 275;
  const strokeWidth = 0;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (time / totalTime) * circumference;
  const containerSize = radius * 2 + 40;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPointColor = (index: number) => {
    if (index < elapsedSeconds) {
      return '#4caf50'; // Green color for elapsed seconds
    } else {
      return '#ccc'; // Gray color for remaining seconds
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: containerSize, height: containerSize }}>
        <svg height={radius * 2} width={radius * 2} style={{ display: 'block' }}>
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="transparent"
            stroke="#ccc"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="transparent"
            stroke="#4caf50"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
          {Array.from({ length: 30 }, (_, index) => (
            <circle
              key={index}
              cx={radius + radius * Math.cos(((index * 6  + 90 ) * Math.PI) / 90)}
              cy={radius + radius * Math.sin(((index * 6  + 90 ) * Math.PI) / 90)}
              r={4}
              fill={getPointColor(index)}
            />
          ))}
          <text x={radius} y={radius} textAnchor="middle" dominantBaseline="central" fontSize="20">
            {formatTime(time)}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default CircularTimer;
