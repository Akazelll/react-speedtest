import { useState, useRef } from "react";
import ndt7 from "@m-lab/ndt7";

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
  const [latency, setLatency] = useState(0); // Min RTT
  const [serverLocation, setServerLocation] = useState<string>("");

  // Ref untuk menyimpan instance tes agar bisa di-stop jika perlu
  const abortControllerRef = useRef<AbortController | null>(null);

  const runTest = async () => {
    setStatus("starting");
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setLatency(0);
    setServerLocation("Mencari Server Terdekat...");

    try {
      // 1. DOWNLOAD TEST
      setStatus("download");

      // Callback untuk update UI real-time saat download berjalan
      await ndt7.test({
        userAcceptedDataPolicy: true, // Wajib policy M-Lab
        downloadworker: {
          onstart: (serverData: any) => {
            // Mendapatkan info server lokasi
            if (serverData?.location?.city) {
              setServerLocation(
                `${serverData.location.city}, ${serverData.location.country}`,
              );
            }
          },
          onmeasurement: (data: any) => {
            if (data.Source === "client") {
              // Kecepatan dalam Mbps
              const mbps = data.Data.MeanClientMbps;
              setDownloadSpeed(parseFloat(mbps.toFixed(2)));
            }
          },
          oncomplete: (data: any) => {
            // Ambil latency (MinRTT) dari hasil akhir
            if (data?.MinRTT) {
              setLatency(Math.round(data.MinRTT));
            }
          },
        },
        uploadworker: null, // Matikan upload dulu saat fase download
      });

      // 2. UPLOAD TEST
      setStatus("upload");

      await ndt7.test({
        userAcceptedDataPolicy: true,
        downloadworker: null, // Matikan download
        uploadworker: {
          onmeasurement: (data: any) => {
            if (data.Source === "server") {
              // Untuk upload, data speed diukur oleh server (server-side measurement)
              // Data dikirim balik ke client via pesan websocket
              const mbps = data.Data.MeanClientMbps;
              setUploadSpeed(parseFloat(mbps.toFixed(2)));
            }
          },
        },
      });

      setStatus("complete");
    } catch (error) {
      console.error("NDT7 Error:", error);
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
