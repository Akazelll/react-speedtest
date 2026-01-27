import { useState } from "react";

export type SpeedTestState =
  | "idle"
  | "ping"
  | "download"
  | "upload"
  | "complete";

export type ServerInfo = {
  name: string;
  sponsor: string;
  location: string;
};

export type TestResult = {
  id: string;
  date: string;
  ping: number;
  jitter: number;
  download: number; // Mbps
  upload: number; // Mbps
  server: ServerInfo;
};

export const useSpeedTest = () => {
  const [status, setStatus] = useState<SpeedTestState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);

  // Real-time values untuk UI
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const runTest = async () => {
    setStatus("ping");
    setProgress(0);
    setCurrentSpeed(0);

    try {
      // --- PHASE 0: GET SERVER INFO ---
      const serverRes = await fetch("/api/speedtest?type=server");
      const serverInfo: ServerInfo = await serverRes.json();

      // --- PHASE 1: PING & JITTER ---
      // Melakukan 5x ping kecil untuk menghitung rata-rata dan jitter
      const pings: number[] = [];
      for (let i = 0; i < 5; i++) {
        const start = performance.now();
        await fetch("/api/speedtest?type=server", { cache: "no-store" }); // fetch kecil
        const end = performance.now();
        pings.push(end - start);
      }

      const minPing = Math.min(...pings);
      // Hitung Jitter (standar deviasi sederhana dari selisih antar ping)
      const pingDiffs = pings.slice(1).map((p, i) => Math.abs(p - pings[i]));
      const jitter = pingDiffs.reduce((a, b) => a + b, 0) / pingDiffs.length;

      setProgress(20);

      // --- PHASE 2: DOWNLOAD (40MB) ---
      setStatus("download");
      const startDl = performance.now();

      // Request 40MB data
      const dlResponse = await fetch("/api/speedtest?type=download");
      const dlBlob = await dlResponse.blob();

      const endDl = performance.now();
      const dlDuration = (endDl - startDl) / 1000; // seconds
      const dlBits = dlBlob.size * 8;
      const dlSpeedMbps = dlBits / dlDuration / (1024 * 1024);

      setCurrentSpeed(dlSpeedMbps);
      setProgress(60);

      // --- PHASE 3: UPLOAD (Chunked Simulation) ---
      // Vercel membatasi body size, jadi kita kirim beberapa chunk kecil
      // (misal 2MB x 5 request = 10MB sample) untuk estimasi upload.
      setStatus("upload");
      setCurrentSpeed(0);

      const chunkBytes = 2 * 1024 * 1024; // 2MB Chunk
      const chunksCount = 3; // Kirim 3 kali (Total 6MB sample untuk tes cepat)
      const uploadData = new Uint8Array(chunkBytes); // Dummy data

      let totalUploadTime = 0;

      for (let i = 0; i < chunksCount; i++) {
        const startUl = performance.now();
        await fetch("/api/speedtest", {
          method: "POST",
          body: uploadData,
        });
        const endUl = performance.now();
        totalUploadTime += endUl - startUl;
        // Update progress visual sedikit
        setProgress(60 + ((i + 1) / chunksCount) * 40);
      }

      const totalBitsUploaded = chunkBytes * chunksCount * 8;
      const totalSeconds = totalUploadTime / 1000;
      const ulSpeedMbps = totalBitsUploaded / totalSeconds / (1024 * 1024);

      setCurrentSpeed(ulSpeedMbps);
      setProgress(100);

      // --- FINALIZE ---
      const finalResult: TestResult = {
        id: crypto.randomUUID(),
        date:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
        ping: Math.round(minPing),
        jitter: Math.round(jitter),
        download: parseFloat(dlSpeedMbps.toFixed(2)),
        upload: parseFloat(ulSpeedMbps.toFixed(2)),
        server: serverInfo,
      };

      setResult(finalResult);
      setStatus("complete");
      return finalResult;
    } catch (error) {
      console.error("Test failed", error);
      setStatus("idle");
      setProgress(0);
    }
  };

  return { runTest, status, progress, result, currentSpeed };
};
