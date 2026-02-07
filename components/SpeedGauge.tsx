"use client";

import { useEffect, useState } from "react";

export const SpeedGauge = ({
  value,
  status,
}: {
  value: number;
  status: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      const diff = value - displayValue;
      if (Math.abs(diff) > 0.1) {
        setDisplayValue((prev) => prev + diff * 0.1);
      } else {
        setDisplayValue(value);
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [value, displayValue]);

  // Skala visual max 100mbps (logaritmik visual)
  const percentage = Math.min(displayValue / 100, 1) * 180;

  const getColor = () => {
    if (status === "upload") return "text-indigo-400";
    if (status === "download") return "text-sky-400";
    return "text-slate-400";
  };

  const getStrokeColor = () => {
    if (status === "upload") return "#818cf8"; // Indigo
    if (status === "download") return "#38bdf8"; // Sky
    return "#94a3b8"; // Slate
  };

  return (
    <div className='relative w-72 h-40 flex items-end justify-center overflow-hidden pb-2'>
      {/* Background Arc (Abu-abu lembut) */}
      <svg className='absolute w-full h-full bottom-0' viewBox='0 0 200 110'>
        <path
          d='M 20 100 A 80 80 0 0 1 180 100'
          fill='none'
          stroke='#334155' // Slate-700 (Soft Dark)
          strokeWidth='12'
          strokeLinecap='round'
        />
        {/* Active Arc */}
        <path
          d='M 20 100 A 80 80 0 0 1 180 100'
          fill='none'
          stroke={getStrokeColor()}
          strokeWidth='12'
          strokeLinecap='round'
          strokeDasharray={251}
          strokeDashoffset={251 - (percentage / 180) * 251}
          className='transition-all duration-100 ease-out'
          style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.3))" }}
        />
      </svg>

      {/* Text Value */}
      <div className='absolute bottom-6 flex flex-col items-center z-30'>
        <div
          className={`text-6xl font-bold tabular-nums tracking-tight ${getColor()} transition-colors duration-300`}
        >
          {displayValue.toFixed(1)}
        </div>
        <span className='text-sm font-medium text-slate-500 uppercase tracking-widest mt-1'>
          Mbps
        </span>
      </div>
    </div>
  );
};
