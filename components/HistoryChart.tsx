"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestResult } from "@/hooks/useSpeedTest";

interface HistoryChartProps {
  data: TestResult[];
}

export function HistoryChart({ data }: HistoryChartProps) {
  // Kita perlu membalik urutan data agar yang lama di kiri, yang baru di kanan
  // (Asumsi data history masuknya [terbaru, lama, lama...])
  const chartData = [...data].reverse();

  if (data.length < 2) return null; // Jangan tampilkan kalau data cuma 1 atau 0

  return (
    <Card className='w-full max-w-2xl mt-4'>
      <CardHeader>
        <CardTitle className='text-sm font-medium'>
          Tren Kecepatan (Mbps)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[200px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='date'
                hide // Sembunyikan label bawah agar bersih
              />
              <YAxis
                tickFormatter={(value) => `${value} Mbps`}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type='monotone'
                dataKey='download'
                stroke='#2563eb' // Blue-600
                strokeWidth={2}
                dot={{ fill: "#2563eb", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
