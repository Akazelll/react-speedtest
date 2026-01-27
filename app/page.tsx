"use client";

import { useEffect } from "react";
import { Wifi, ArrowDown, ArrowUp, Globe, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNDT7 } from "@/hooks/useNDT7";

export default function Home() {
  const {
    runTest,
    status,
    downloadSpeed,
    uploadSpeed,
    latency,
    serverLocation,
  } = useNDT7();

  const isTesting =
    status === "download" || status === "upload" || status === "starting";

  return (
    <main className='min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans'>
      {/* Header */}
      <div className='mb-10 text-center'>
        <h1 className='text-4xl font-bold tracking-tighter mb-2'>
          Open<span className='text-blue-500'>Speed</span>
        </h1>
        <p className='text-gray-400 text-sm'>
          Powered by Measurement Lab (M-Lab)
        </p>
      </div>

      {/* Main Gauge Area */}
      <div className='relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-8'>
        {/* Lingkaran border */}
        <div
          className={`absolute inset-0 rounded-full border-4 border-gray-800 ${isTesting ? "animate-pulse" : ""}`}
        ></div>

        {/* Indikator Status */}
        <div className='text-center z-10'>
          {status === "idle" && (
            <Wifi className='w-16 h-16 text-gray-700 mx-auto mb-2' />
          )}
          {status === "starting" && (
            <span className='text-sm text-yellow-500'>Mencari Server...</span>
          )}

          {(status === "download" ||
            status === "upload" ||
            status === "complete") && (
            <>
              <div className='text-6xl font-black tabular-nums'>
                {status === "upload"
                  ? uploadSpeed.toFixed(1)
                  : downloadSpeed.toFixed(1)}
              </div>
              <div className='text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest'>
                Mbps {status === "upload" ? "Upload" : "Download"}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8'>
        {/* Download Card */}
        <Card className='bg-gray-900 border-gray-800 text-white'>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <div className='flex items-center gap-2 mb-2 text-blue-400'>
              <ArrowDown className='w-4 h-4' />{" "}
              <span className='text-xs font-bold uppercase'>Download</span>
            </div>
            <span className='text-2xl font-bold'>{downloadSpeed}</span>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card className='bg-gray-900 border-gray-800 text-white'>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <div className='flex items-center gap-2 mb-2 text-purple-400'>
              <ArrowUp className='w-4 h-4' />{" "}
              <span className='text-xs font-bold uppercase'>Upload</span>
            </div>
            <span className='text-2xl font-bold'>{uploadSpeed}</span>
          </CardContent>
        </Card>

        {/* Ping/Server Card */}
        <Card className='bg-gray-900 border-gray-800 text-white'>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <div className='flex items-center gap-2 mb-2 text-green-400'>
              <Globe className='w-4 h-4' />{" "}
              <span className='text-xs font-bold uppercase'>Ping / Loc</span>
            </div>
            <div className='text-center'>
              <span className='text-xl font-bold'>
                {latency > 0 ? `${latency} ms` : "--"}
              </span>
              <p className='text-[10px] text-gray-500 mt-1 max-w-[100px] truncate'>
                {serverLocation || "Auto"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <Button
        size='lg'
        className={`w-48 h-14 rounded-full font-bold text-lg transition-all ${
          isTesting
            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
            : "bg-white text-black hover:bg-gray-200 hover:scale-105"
        }`}
        onClick={runTest}
        disabled={isTesting}
      >
        {isTesting ? (
          <Loader2 className='w-6 h-6 animate-spin' />
        ) : status === "complete" ? (
          "Tes Lagi"
        ) : (
          "Mulai Tes"
        )}
      </Button>
    </main>
  );
}
