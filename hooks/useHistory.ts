import { useState, useEffect } from "react";

export interface TestResult {
  id: string;
  date: string;
  download: number;
  upload: number;
  ping: number;
  location: string;
}

export const useHistory = () => {
  const [history, setHistory] = useState<TestResult[]>([]);

  // Load dari LocalStorage saat pertama kali dibuka
  useEffect(() => {
    const stored = localStorage.getItem("speedtest_history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Gagal load history", e);
      }
    }
  }, []);

  // Fungsi simpan data baru
  const addResult = (
    download: number,
    upload: number,
    ping: number,
    location: string,
  ) => {
    const newResult: TestResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      download,
      upload,
      ping,
      location,
    };

    const updatedHistory = [newResult, ...history].slice(0, 50); // Simpan max 50 riwayat
    setHistory(updatedHistory);
    localStorage.setItem("speedtest_history", JSON.stringify(updatedHistory));
  };

  // Fungsi hapus semua history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("speedtest_history");
  };

  return { history, addResult, clearHistory };
};
