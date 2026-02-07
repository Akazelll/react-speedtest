import { useState, useRef, useEffect } from "react";

export type TestState =
  | "idle"
  | "starting"
  | "download"
  | "upload"
  | "complete"
  | "error";

export const useNDT7 = () => {
  const [status, setStatus] = useState<TestState>("idle");
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [latency, setLatency] = useState(0);
  const [serverLocation, setServerLocation] = useState<string>("");

  // Gunakan Ref untuk variabel yang berubah cepat agar tidak re-render berlebih
  const speedRef = useRef(0);
  const totalBytesRef = useRef(0);
  const lastBytesRef = useRef(0);
  const lastTimeRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const runTest = async () => {
    setStatus("starting");
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setLatency(0);
    setServerLocation("Local High-Performance Server");

    // Reset Refs
    speedRef.current = 0;
    totalBytesRef.current = 0;
    lastBytesRef.current = 0;
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      // --- FASE 1: PING (LATENCY) ---
      const pingStart = performance.now();
      await fetch("/api/speedtest", {
        method: "HEAD",
        cache: "no-store",
        signal,
      });
      const pingEnd = performance.now();
      setLatency(Math.round(pingEnd - pingStart));

      // --- FASE 2: DOWNLOAD (TIME BASED - 10 Detik) ---
      setStatus("download");
      totalBytesRef.current = 0;
      lastBytesRef.current = 0;
      lastTimeRef.current = performance.now();
      const dlDuration = 10000; // 10 Detik durasi tes
      const dlDeadline = Date.now() + dlDuration;

      // Timer Update GUI (Jalan terpisah dari proses download)
      const uiTimer = setInterval(() => {
        const now = performance.now();
        const duration = (now - lastTimeRef.current) / 1000;

        if (duration > 0.1) {
          // Update setiap 100ms+
          const bytesDiff = totalBytesRef.current - lastBytesRef.current;
          const currentSpeed = (bytesDiff * 8) / duration / 1000000; // Mbps

          // Smoothing (Biar grafik tidak loncat-loncat)
          if (currentSpeed > 0) {
            speedRef.current = speedRef.current * 0.6 + currentSpeed * 0.4;
          }

          setDownloadSpeed(parseFloat(speedRef.current.toFixed(2)));

          lastBytesRef.current = totalBytesRef.current;
          lastTimeRef.current = now;
        }
      }, 100);

      // Loop Download Paralel (4 Threads)
      // Terus fetch ulang sampai waktu habis
      const dlPromises = Array(4)
        .fill(0)
        .map(async (_, i) => {
          while (Date.now() < dlDeadline) {
            try {
              const res = await fetch(`/api/speedtest?t=${Date.now()}-${i}`, {
                signal,
              });
              const reader = res.body?.getReader();
              if (!reader) break;

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                totalBytesRef.current += value.length;

                // Cek waktu di dalam loop juga agar responsif stop-nya
                if (Date.now() >= dlDeadline) {
                  reader.cancel();
                  break;
                }
              }
            } catch (e) {
              // Ignore error abort/cancel
              break;
            }
          }
        });

      await Promise.all(dlPromises);
      clearInterval(uiTimer);

      // Set Speed Akhir (Rata-rata total)
      // const finalDlSpeed = (totalBytesRef.current * 8) / (dlDuration / 1000) / 1000000;
      // setDownloadSpeed(parseFloat(finalDlSpeed.toFixed(2)));

      // --- FASE 3: UPLOAD (TIME BASED - 5 Detik) ---
      setStatus("upload");
      speedRef.current = 0;
      totalBytesRef.current = 0;
      lastBytesRef.current = 0;
      lastTimeRef.current = performance.now();

      const ulDuration = 5000; // 5 Detik upload
      const ulDeadline = Date.now() + ulDuration;

      const ulUiTimer = setInterval(() => {
        const now = performance.now();
        const duration = (now - lastTimeRef.current) / 1000;

        if (duration > 0.1) {
          const bytesDiff = totalBytesRef.current - lastBytesRef.current;
          const currentSpeed = (bytesDiff * 8) / duration / 1000000;

          if (currentSpeed > 0) {
            speedRef.current = speedRef.current * 0.6 + currentSpeed * 0.4;
          }
          setUploadSpeed(parseFloat(speedRef.current.toFixed(2)));

          lastBytesRef.current = totalBytesRef.current;
          lastTimeRef.current = now;
        }
      }, 100);

      const ulPromises = Array(2)
        .fill(0)
        .map(async (_, i) => {
          // Data chunk 2MB untuk diupload berulang
          const chunk = new Uint8Array(2 * 1024 * 1024);

          while (Date.now() < ulDeadline) {
            try {
              // Pakai XHR agar bisa track progress upload real-time
              await new Promise<void>((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", `/api/speedtest?t=${Date.now()}-${i}`, true);

                let prevLoaded = 0;
                xhr.upload.onprogress = (ev) => {
                  const diff = ev.loaded - prevLoaded;
                  totalBytesRef.current += diff;
                  prevLoaded = ev.loaded;
                };

                xhr.onload = () => resolve();
                xhr.onerror = () => resolve();
                xhr.send(chunk);
              });
            } catch (e) {
              break;
            }
          }
        });

      await Promise.all(ulPromises);
      clearInterval(ulUiTimer);

      setStatus("complete");
    } catch (error) {
      console.error("Test Error:", error);
      setStatus("error");
    }
  };

  return {
    runTest,
    status,
    downloadSpeed,
    uploadSpeed,
    latency,
    serverLocation,
  };
};
