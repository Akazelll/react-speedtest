"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

type DataPoint = {
  value: number;
  status: string;
};

export const RealtimeChart = ({
  value,
  status,
}: {
  value: number;
  status: string;
}) => {
  // Buffer data berisi objek { value, status }
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(
    new Array(50).fill({ value: 0, status: "idle" }),
  );

  // Update data saat tes berjalan
  useEffect(() => {
    if (status === "download" || status === "upload") {
      setDataPoints((prev) => {
        const newData = [...prev.slice(1), { value, status }];
        return newData;
      });
    }
  }, [value, status]);

  // Reset grafik saat status starting
  useEffect(() => {
    if (status === "starting") {
      setDataPoints(new Array(50).fill({ value: 0, status: "idle" }));
    }
  }, [status]);

  const maxVal = Math.max(...dataPoints.map((d) => d.value), 10) * 1.2;

  // Logic SVG Path Halus
  const points = dataPoints
    .map((d, i) => {
      const x = (i / (dataPoints.length - 1)) * 100;
      const y = 100 - (d.value / maxVal) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const isUpload = status === "upload";

  // --- LOGIC GRADIENT 2 WARNA ---
  // Kita cari titik di mana status berubah dari 'download' ke 'upload'
  const uploadStartIndex = dataPoints.findIndex((d) => d.status === "upload");

  // Warna Definisi
  const colorDownload = "#38bdf8"; // Sky-400
  const colorUpload = "#818cf8"; // Indigo-400

  // Default: Full Download Color
  let stopOffset = 0;

  if (uploadStartIndex !== -1) {
    // Jika ada data upload, hitung persentase posisi transisinya
    stopOffset = (uploadStartIndex / (dataPoints.length - 1)) * 100;
  } else if (status === "upload" && uploadStartIndex === -1) {
    // Jika status upload tapi buffer penuh upload (kasus jarang), full upload color
    stopOffset = 0;
  } else {
    // Jika belum ada upload, full download color (offset 100%)
    stopOffset = 100;
  }

  // Jika sedang full upload (download data sudah lewat/hilang dari buffer)
  if (uploadStartIndex === 0) stopOffset = 0;

  return (
    <div className='w-full h-full relative overflow-hidden rounded-xl bg-slate-900/40 border border-slate-800'>
      {/* Legend & Max Value */}
      <div className='absolute top-2 left-3 z-10 flex flex-col gap-1'>
        <span className='text-[10px] font-mono text-slate-500'>
          Scale: 0 - {maxVal.toFixed(0)} Mbps
        </span>
      </div>

      <div className='absolute top-2 right-3 flex gap-2 z-10'>
        <div
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-opacity duration-300 ${status === "download" ? "bg-sky-500/20 text-sky-400 opacity-100" : "text-slate-600 opacity-50"}`}
        >
          <ArrowDown className='w-3 h-3' />{" "}
          <span className='text-[10px] font-bold'>DOWN</span>
        </div>
        <div
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-opacity duration-300 ${status === "upload" ? "bg-indigo-500/20 text-indigo-400 opacity-100" : "text-slate-600 opacity-50"}`}
        >
          <ArrowUp className='w-3 h-3' />{" "}
          <span className='text-[10px] font-bold'>UP</span>
        </div>
      </div>

      {/* Grafik SVG */}
      <svg
        className='w-full h-full absolute inset-0 pt-6 px-0 pb-0'
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
      >
        <defs>
          {/* Gradient untuk Garis (Stroke) - Berubah warna di tengah jalan */}
          <linearGradient id='strokeGradient' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor={colorDownload} />
            <stop offset={`${stopOffset}%`} stopColor={colorDownload} />
            <stop offset={`${stopOffset}%`} stopColor={colorUpload} />
            <stop offset='100%' stopColor={colorUpload} />
          </linearGradient>

          {/* Gradient untuk Isi (Fill) - Sama tapi transparan ke bawah */}
          <linearGradient id='fillGradient' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor={colorDownload} stopOpacity='0.4' />
            <stop
              offset={`${stopOffset}%`}
              stopColor={colorDownload}
              stopOpacity='0.4'
            />
            <stop
              offset={`${stopOffset}%`}
              stopColor={colorUpload}
              stopOpacity='0.4'
            />
            <stop offset='100%' stopColor={colorUpload} stopOpacity='0.4' />
          </linearGradient>

          {/* Masking untuk Fade Out vertikal (agar fill tidak blok warna solid) */}
          <linearGradient id='fadeGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='white' stopOpacity='1' />
            <stop offset='100%' stopColor='white' stopOpacity='0' />
          </linearGradient>
          <mask id='fadeMask'>
            <rect
              x='0'
              y='0'
              width='100'
              height='100'
              fill='url(#fadeGradient)'
            />
          </mask>
        </defs>

        {/* Grid Lines Horizontal */}
        <line
          x1='0'
          y1='25'
          x2='100'
          y2='25'
          stroke='#fff'
          strokeOpacity='0.05'
          strokeWidth='0.5'
          vectorEffect='non-scaling-stroke'
        />
        <line
          x1='0'
          y1='50'
          x2='100'
          y2='50'
          stroke='#fff'
          strokeOpacity='0.05'
          strokeWidth='0.5'
          vectorEffect='non-scaling-stroke'
        />
        <line
          x1='0'
          y1='75'
          x2='100'
          y2='75'
          stroke='#fff'
          strokeOpacity='0.05'
          strokeWidth='0.5'
          vectorEffect='non-scaling-stroke'
        />

        {/* Area Fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill='url(#fillGradient)'
          mask='url(#fadeMask)'
        />

        {/* Garis Grafik Utama */}
        <polyline
          points={points}
          fill='none'
          stroke='url(#strokeGradient)'
          strokeWidth='2.5'
          vectorEffect='non-scaling-stroke'
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        {/* Titik Terakhir (Pulse Dot) - Warnanya mengikuti status saat ini */}
        {dataPoints.length > 0 && (
          <circle
            cx='100'
            cy={100 - (dataPoints[dataPoints.length - 1].value / maxVal) * 100}
            r='2'
            fill={isUpload ? colorUpload : colorDownload}
            className='animate-ping'
          />
        )}
      </svg>
    </div>
  );
};
