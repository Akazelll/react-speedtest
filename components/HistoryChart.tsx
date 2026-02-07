import { TestResult } from "@/hooks/useHistory";

export const HistoryChart = ({ data }: { data: TestResult[] }) => {
  if (data.length === 0) return null;

  // Ambil 10 data terakhir saja & balik urutannya untuk grafik (kiri ke kanan)
  const recentData = [...data].slice(0, 10).reverse();
  const maxSpeed = Math.max(
    ...recentData.map((d) => Math.max(d.download, d.upload)),
    100,
  );

  return (
    <div className='w-full h-32 flex items-end justify-between gap-2 mt-4 px-2'>
      {recentData.map((item) => (
        <div
          key={item.id}
          className='flex flex-col items-center gap-1 flex-1 group relative'
        >
          {/* Tooltip */}
          <div className='absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-800 text-xs p-2 rounded border border-slate-700 z-10 whitespace-nowrap'>
            <span className='text-cyan-400'>DL: {item.download}</span>
            <span className='text-purple-400'>UL: {item.upload}</span>
            <span className='text-slate-400'>{item.date}</span>
          </div>

          {/* Bars */}
          <div className='w-full flex items-end gap-0.5 h-full'>
            <div
              style={{ height: `${(item.download / maxSpeed) * 100}%` }}
              className='w-1/2 bg-cyan-500/80 rounded-t-sm transition-all duration-500 hover:bg-cyan-400'
            />
            <div
              style={{ height: `${(item.upload / maxSpeed) * 100}%` }}
              className='w-1/2 bg-purple-500/80 rounded-t-sm transition-all duration-500 hover:bg-purple-400'
            />
          </div>
        </div>
      ))}
    </div>
  );
};
