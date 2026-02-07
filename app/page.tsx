"use client";

import { useEffect } from "react";
import { useNDT7 } from "@/hooks/useNDT7";
import { useHistory } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SpeedGauge } from "@/components/SpeedGauge";
import { RealtimeChart } from "@/components/RealtimeChart";
import {
  ArrowDown,
  ArrowUp,
  Zap,
  Trash2,
  Activity,
  PlayCircle,
  Server,
  Globe,
} from "lucide-react";

export default function Home() {
  const {
    runTest,
    status,
    downloadSpeed,
    uploadSpeed,
    latency,
    serverLocation,
  } = useNDT7();
  const { history, addResult, clearHistory } = useHistory();

  // Simpan history otomatis
  useEffect(() => {
    if (status === "complete") {
      addResult(downloadSpeed, uploadSpeed, latency, serverLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const isTesting =
    status === "starting" || status === "download" || status === "upload";
  const currentSpeed = status === "upload" ? uploadSpeed : downloadSpeed;

  return (
    <main className='min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden'>
      {/* Background Ambience */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full opacity-50'></div>
        <div className='absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full opacity-30'></div>
        {/* Grid Pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]'></div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col min-h-screen'>
        {/* Header */}
        <header className='flex justify-between items-center mb-10 border-b border-white/5 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-cyan-950/50 border border-cyan-500/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]'>
              <Zap className='w-5 h-5 text-cyan-400 fill-current' />
            </div>
            <div>
              <h1 className='font-bold text-xl tracking-tight leading-none'>
                TURBO<span className='text-cyan-400'>NET</span>
              </h1>
              <span className='text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium'>
                Network Telemetry
              </span>
            </div>
          </div>
          <Badge
            variant='outline'
            className={`border-slate-800 bg-black/50 backdrop-blur ${isTesting ? "text-green-400 border-green-900/50" : "text-slate-400"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-2 ${isTesting ? "bg-green-500 animate-pulse" : "bg-slate-600"}`}
            ></span>
            {isTesting ? "LIVE TEST" : "READY"}
          </Badge>
        </header>

        {/* --- MAIN DASHBOARD --- */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 flex-grow'>
          {/* LEFT: GAUGE & CONTROLS (Cols 7) */}
          <div className='lg:col-span-7 flex flex-col gap-6'>
            {/* Main Display Card */}
            <Card className='bg-black/40 border-white/10 backdrop-blur-md h-full flex flex-col justify-between relative overflow-hidden group'>
              <div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none'></div>

              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2'>
                  <Activity className='w-4 h-4' /> Realtime Speed
                </CardTitle>
                {serverLocation && (
                  <div className='flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-white/5 px-2 py-1 rounded'>
                    <Server className='w-3 h-3' /> {serverLocation}
                  </div>
                )}
              </CardHeader>

              <CardContent className='flex flex-col items-center justify-center flex-grow py-8 relative'>
                <SpeedGauge value={currentSpeed} status={status} />

                {/* Status Indicator text under gauge */}
                <div className='mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5'>
                  {status === "download" && (
                    <ArrowDown className='w-4 h-4 text-cyan-400 animate-bounce' />
                  )}
                  {status === "upload" && (
                    <ArrowUp className='w-4 h-4 text-purple-400 animate-bounce' />
                  )}
                  <span className='text-xs font-bold uppercase text-slate-300'>
                    {status === "idle"
                      ? "Start Test to Begin"
                      : status === "complete"
                        ? "Test Completed"
                        : `Testing ${status}...`}
                  </span>
                </div>
              </CardContent>

              {/* Action Area */}
              <div className='p-6 pt-0 flex justify-center'>
                <Button
                  size='lg'
                  onClick={runTest}
                  disabled={isTesting}
                  className={`w-full md:w-2/3 h-14 text-base font-bold rounded-xl transition-all duration-300 tracking-wide border ${
                    isTesting
                      ? "bg-slate-900/50 text-slate-500 border-slate-800 cursor-not-allowed"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500/50 shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)]"
                  }`}
                >
                  {isTesting ? (
                    <span className='flex items-center gap-2'>
                      <Globe className='animate-spin w-5 h-5' /> INITIALIZING
                      LINK...
                    </span>
                  ) : (
                    <span className='flex items-center gap-2'>
                      <PlayCircle className='w-5 h-5' /> START SPEEDTEST
                    </span>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* RIGHT: LIVE GRAPH & STATS (Cols 5) */}
          <div className='lg:col-span-5 flex flex-col gap-6'>
            {/* Live Chart */}
            {/* Live Chart Area */}
            <Card className='bg-slate-900 border-slate-800 shadow-lg flex flex-col h-64 relative overflow-hidden'>
              {/* Hapus Header lama, kita gunakan space penuh untuk chart yang sudah ada legendnya */}
              <div className='p-1 w-full h-full'>
                <RealtimeChart value={currentSpeed} status={status} />
              </div>
            </Card>

            {/* Stat Cards Grid */}
            <div className='grid grid-cols-2 gap-4 flex-grow'>
              <div className='bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-cyan-500/30 transition-colors'>
                <div className='flex items-center gap-2 text-cyan-400 mb-2'>
                  <ArrowDown className='w-4 h-4' />
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-cyan-400 transition-colors'>
                    Download
                  </span>
                </div>
                <div className='text-3xl font-mono font-medium text-white tracking-tighter'>
                  {downloadSpeed.toFixed(0)}{" "}
                  <span className='text-sm font-sans text-slate-500'>Mbps</span>
                </div>
              </div>

              <div className='bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-purple-500/30 transition-colors'>
                <div className='flex items-center gap-2 text-purple-400 mb-2'>
                  <ArrowUp className='w-4 h-4' />
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-purple-400 transition-colors'>
                    Upload
                  </span>
                </div>
                <div className='text-3xl font-mono font-medium text-white tracking-tighter'>
                  {uploadSpeed.toFixed(0)}{" "}
                  <span className='text-sm font-sans text-slate-500'>Mbps</span>
                </div>
              </div>

              <div className='col-span-2 bg-gradient-to-r from-slate-900 to-black border border-white/10 rounded-xl p-4 flex items-center justify-between'>
                <div className='flex flex-col'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1'>
                    Latency
                  </span>
                  <div className='text-2xl font-mono font-medium text-white'>
                    {latency || "--"}{" "}
                    <span className='text-sm font-sans text-slate-500'>ms</span>
                  </div>
                </div>
                <div className='h-full w-[1px] bg-white/10 mx-4'></div>
                <div className='flex flex-col text-right'>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1'>
                    Jitter
                  </span>
                  <div className='text-2xl font-mono font-medium text-slate-300'>
                    {latency ? (latency * 0.2).toFixed(0) : "--"}{" "}
                    <span className='text-sm font-sans text-slate-500'>ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM: HISTORY TABLE --- */}
        <div className='mt-auto'>
          <Card className='bg-black/20 border-white/5 backdrop-blur-sm'>
            <CardHeader className='flex flex-row items-center justify-between py-4'>
              <CardTitle className='text-sm font-medium text-slate-400 uppercase tracking-widest'>
                Recent Tests
              </CardTitle>
              {history.length > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={clearHistory}
                  className='h-8 text-xs text-red-900 hover:text-red-400 hover:bg-red-950/20'
                >
                  <Trash2 className='w-3 h-3 mr-2' /> CLEAR
                </Button>
              )}
            </CardHeader>
            <CardContent className='p-0'>
              <div className='max-h-64 overflow-y-auto custom-scrollbar'>
                <Table>
                  <TableHeader className='bg-white/5 sticky top-0 backdrop-blur-md z-10'>
                    <TableRow className='border-white/5 hover:bg-transparent'>
                      <TableHead className='text-slate-500 text-xs w-[150px]'>
                        TIMESTAMP
                      </TableHead>
                      <TableHead className='text-cyan-500 text-xs'>
                        DOWNLOAD
                      </TableHead>
                      <TableHead className='text-purple-500 text-xs'>
                        UPLOAD
                      </TableHead>
                      <TableHead className='text-slate-500 text-xs text-right'>
                        PING
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className='h-24 text-center text-slate-600 text-sm italic'
                        >
                          No data recorded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      history.map((row) => (
                        <TableRow
                          key={row.id}
                          className='border-white/5 hover:bg-white/5 transition-colors group'
                        >
                          <TableCell className='font-mono text-xs text-slate-400 group-hover:text-white transition-colors'>
                            {row.date}
                          </TableCell>
                          <TableCell className='font-mono text-sm text-cyan-200 group-hover:text-cyan-400 font-bold'>
                            {row.download}
                          </TableCell>
                          <TableCell className='font-mono text-sm text-purple-200 group-hover:text-purple-400 font-bold'>
                            {row.upload}
                          </TableCell>
                          <TableCell className='font-mono text-xs text-slate-400 text-right'>
                            {row.ping} ms
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
