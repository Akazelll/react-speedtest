"use client";

import { useNDT7 } from "@/hooks/useNDT7";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, ArrowDown, ArrowUp, Globe, Activity } from "lucide-react";

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
    status === "starting" || status === "download" || status === "upload";

  return (
    <main className='min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans'>
      {/* Header */}
      <div className='mb-12 text-center space-y-2'>
        <h1 className='text-4xl md:text-5xl font-black tracking-tight'>
          SPEED<span className='text-cyan-500'>TEST</span>
        </h1>
        <p className='text-slate-400 text-sm'>Professional Network Analysis</p>
      </div>

      {/* Main Speed Gauge */}
      <div className='relative w-72 h-72 mb-12 flex items-center justify-center'>
        {/* Decorative Ring */}
        <div
          className={`absolute inset-0 rounded-full border-[6px] border-slate-800 ${isTesting ? "animate-pulse" : ""}`}
        ></div>
        {isTesting && (
          <div
            className={`absolute inset-0 rounded-full border-t-[6px] border-cyan-500 animate-spin transition-all duration-1000`}
          ></div>
        )}

        <div className='text-center z-10 flex flex-col items-center'>
          {status === "idle" && (
            <Wifi className='w-20 h-20 text-slate-700 mb-4' />
          )}

          {status !== "idle" && (
            <>
              <div className='text-7xl font-black tabular-nums tracking-tighter text-white'>
                {status === "upload"
                  ? uploadSpeed.toFixed(1)
                  : downloadSpeed.toFixed(1)}
              </div>
              <div className='flex items-center gap-2 mt-2 text-cyan-400 font-bold text-sm uppercase tracking-widest bg-cyan-950/30 px-3 py-1 rounded-full'>
                {status === "upload" ? (
                  <ArrowUp className='w-4 h-4' />
                ) : (
                  <ArrowDown className='w-4 h-4' />
                )}
                {status === "upload" ? "Upload" : "Download"}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-12'>
        {/* Download Result */}
        <Card className='bg-slate-900/50 border-slate-800'>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <div className='flex items-center gap-2 mb-2 text-cyan-400'>
              <ArrowDown className='w-5 h-5' />{" "}
              <span className='text-xs font-bold uppercase tracking-wider'>
                Download
              </span>
            </div>
            <span className='text-3xl font-bold text-white'>
              {downloadSpeed}{" "}
              <span className='text-sm font-normal text-slate-500'>Mbps</span>
            </span>
          </CardContent>
        </Card>

        {/* Upload Result */}
        <Card className='bg-slate-900/50 border-slate-800'>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <div className='flex items-center gap-2 mb-2 text-purple-400'>
              <ArrowUp className='w-5 h-5' />{" "}
              <span className='text-xs font-bold uppercase tracking-wider'>
                Upload
              </span>
            </div>
            <span className='text-3xl font-bold text-white'>
              {uploadSpeed}{" "}
              <span className='text-sm font-normal text-slate-500'>Mbps</span>
            </span>
          </CardContent>
        </Card>

        {/* Ping Result */}
        <Card className='bg-slate-900/50 border-slate-800'>
          <CardContent className='flex flex-col items-center justify-center p-6'>
            <div className='flex items-center gap-2 mb-2 text-green-400'>
              <Activity className='w-5 h-5' />{" "}
              <span className='text-xs font-bold uppercase tracking-wider'>
                Ping
              </span>
            </div>
            <span className='text-3xl font-bold text-white'>
              {latency > 0 ? latency : "--"}{" "}
              <span className='text-sm font-normal text-slate-500'>ms</span>
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Location Info */}
      <div className='mb-8 flex items-center gap-2 text-slate-500 text-sm bg-slate-900 px-4 py-2 rounded-full border border-slate-800'>
        <Globe className='w-4 h-4' />
        {serverLocation || "Server location will appear here"}
      </div>

      {/* Action Button */}
      <Button
        size='lg'
        className={`w-48 h-14 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] ${
          isTesting
            ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700"
            : "bg-cyan-500 text-white hover:bg-cyan-400 hover:scale-105 border-0"
        }`}
        onClick={runTest}
        disabled={isTesting}
      >
        {isTesting ? "Testing..." : "START TEST"}
      </Button>
    </main>
  );
}
