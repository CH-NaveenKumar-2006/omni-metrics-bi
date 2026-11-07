import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function ChartWidget({ title, subtitle, className = '', data, defaultType = 'bar' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState(defaultType);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: chartType === 'doughnut',
            position: 'bottom',
            labels: { color: '#94a3b8' }
          }
        },
        scales: chartType === 'doughnut' ? {} : {
          x: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, chartType]);

  const handleExportPNG = () => {
    if (!chartRef.current) return;
    const a = document.createElement('a');
    a.href = chartRef.current.toBase64Image();
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-slate-950 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="doughnut">Doughnut</option>
          </select>
          <button
            onClick={handleExportPNG}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            title="Save PNG"
          >
            PNG
          </button>
        </div>
      </div>
      <div className="relative h-64 w-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
