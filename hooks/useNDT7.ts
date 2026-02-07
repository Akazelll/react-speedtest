import { useState } from "react";

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

  const runTest = async () => {
    // 1. Cek apakah library sudah siap
    // @ts-ignore
    if (typeof window === "undefined" || !window.ndt7) {
      console.error("Library ndt7 belum dimuat di window.");
      alert("Gagal memuat script. Cek koneksi internet dan refresh halaman.");
      return;
    }

    setStatus("starting");
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setLatency(0);
    setServerLocation("Mencari Server Terdekat...");

    // PENTING: Gunakan path lokal ke file di folder public
    const WORKER_PATH = "/ndt7-download-worker.js";
    const UPLOAD_WORKER_PATH = "/ndt7-upload-worker.js";

    try {
      // --- FASE 1: DOWNLOAD ---
      setStatus("download");

      // @ts-ignore
      await window.ndt7.test({
        userAcceptedDataPolicy: true,
        downloadworkerfile: WORKER_PATH,
        downloadworker: {
          onstart: (serverData: any) => {
            if (serverData?.location?.city) {
              setServerLocation(
                `${serverData.location.city}, ${serverData.location.country}`,
              );
            }
          },
          onmeasurement: (data: any) => {
            if (data.Source === "client") {
              const mbps = data.Data.MeanClientMbps;
              setDownloadSpeed(parseFloat(mbps.toFixed(2)));
            }
          },
          oncomplete: (data: any) => {
            if (data?.MinRTT) {
              setLatency(Math.round(data.MinRTT));
            }
          },
          error: (err: any) => {
            console.error("Download Worker Error:", err);
          },
        },
        uploadworker: null,
      });

      // --- FASE 2: UPLOAD ---
      setStatus("upload");

      // @ts-ignore
      await window.ndt7.test({
        userAcceptedDataPolicy: true,
        uploadworkerfile: UPLOAD_WORKER_PATH,
        downloadworker: null,
        uploadworker: {
          onmeasurement: (data: any) => {
            if (data.Source === "server") {
              const mbps = data.Data.MeanClientMbps;
              setUploadSpeed(parseFloat(mbps.toFixed(2)));
            }
          },
          error: (err: any) => {
            console.error("Upload Worker Error:", err);
          },
        },
      });

      setStatus("complete");
    } catch (error) {
      console.error("NDT7 Fatal Error:", error);
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
