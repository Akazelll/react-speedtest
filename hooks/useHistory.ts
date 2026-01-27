import { useState, useEffect } from "react";
import { TestResult } from "./useSpeedTest";

export const useHistory = () => {
  const [history, setHistory] = useState<TestResult[]>([]);

  // Load saat pertama kali buka
  useEffect(() => {
    const saved = localStorage.getItem("speedtest_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newResult: TestResult) => {
    const updatedHistory = [newResult, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("speedtest_history", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("speedtest_history");
  };

  return { history, saveToHistory, clearHistory };
};
