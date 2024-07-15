import React, { useState, useEffect } from 'react';

interface CircularTimerProps {
  time: number;
  totalTime: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ time, totalTime }) => {
  const radius = 275;
  const pointRadius = 20;
  const strokeWidth = 0;
  const angle = 135;
  const nbPoint = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (time / totalTime) * circumference;
  const containerSize = radius * 2 + 280;
  const center = containerSize/2
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    return `${seconds.toString().padStart(2, '0')}`;
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
        <svg height={containerSize } width={containerSize } style={{ display: 'block' }}>
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
          {Array.from({ length: nbPoint }, (_, index) => (
            <circle
              key={index}
              cx={center + radius * Math.cos(((index * 6  + angle ) * Math.PI) / 90)}
              cy={center + radius * Math.sin(((index * 6  + angle ) * Math.PI) / 90)}
              r={pointRadius}
              fill={getPointColor(index)}
            />
          ))}
          <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fontSize="40">
            {formatTime(time)}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default CircularTimer;
