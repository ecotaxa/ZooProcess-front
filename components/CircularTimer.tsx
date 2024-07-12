import React from 'react';

interface CircularTimerProps {
  time: number;
  totalTime: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ time, totalTime }) => {
  const radius = 50; // Adjust this value to change the size of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (time / totalTime) * circumference;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="transparent"
          stroke="#ccc"
          strokeWidth={4}
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="transparent"
          stroke="#4caf50"
          strokeWidth={4}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s linear' }}
        />
        {Array.from({ length: 60 }, (_, index) => (
          <circle
            key={index}
            cx={radius + radius * Math.cos((index * 6 * Math.PI) / 180)}
            cy={radius + radius * Math.sin((index * 6 * Math.PI) / 180)}
            r={2}
            fill="#333"
          />
        ))}
        <text x={radius} y={radius} textAnchor="middle" dominantBaseline="central" fontSize="16">
          {formatTime(time)}
        </text>
      </svg>
    </div>
  );
};

export default CircularTimer;
