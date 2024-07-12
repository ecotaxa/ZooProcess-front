import React from 'react';

interface CircularTimerProps {
  time: number;
  totalTime: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ time, totalTime }) => {
  const radius = 275;
  const strokeWidth = 0;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (time / totalTime) * circumference;
  const containerSize = radius * 2 + 20; // Add desired margin/padding value

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ margin: '20px', padding: '20px' }}> {/* Added a container div with margin */}

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

    <div style={{ width: containerSize, height: containerSize }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ display: 'block', margin: '0 auto' }}
      >
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
        {Array.from({ length: 60 }, (_, index) => (
          <circle
            key={index}
            cx={radius + radius * Math.cos(((index * 6 + 270) * Math.PI) / 180)}
            cy={radius + radius * Math.sin(((index * 6 + 270) * Math.PI) / 180)}
            r={4}
            fill="#333"
          />
        ))}
        <text x={radius} y={radius} textAnchor="middle" dominantBaseline="central" fontSize="20">
          {formatTime(time)}
        </text>
      </svg>
    </div>
    </div>
    </div>
  );
};

export default CircularTimer;
