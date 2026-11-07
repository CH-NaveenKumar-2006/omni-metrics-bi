import React, { useState } from 'react';
import { useAnalytics } from './hooks/useAnalytics';
import KPIGrid from './components/KPIGrid';
import ChartWidget from './components/ChartWidget';
import TableDrilldown from './components/TableDrilldown';
import DataImporter from './components/DataImporter';
import ReportModal from './components/ReportModal';

export default function App() {
  const { kpis, timeSeries, breakdowns } = useAnalytics();
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [importedDataset, setImportedDataset] = useState(null);

  const revenueChartData = {
    labels: (timeSeries && timeSeries.length > 0)
      ? timeSeries.map(t => t.month)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Gross Revenue ($k)',
        data: (timeSeries && timeSeries.length > 0)
          ? timeSeries.map(t => Math.round(t.revenue / 1000))
          : [180, 195, 210, 205, 228, 245, 260, 280, 295, 315],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: '#6366f1',
        borderWidth: 1.5,
        borderRadius: 6
      },
      {
        label: 'Target ($k)',
        data: (timeSeries && timeSeries.length > 0)
          ? timeSeries.map(t => Math.round((t.target || t.revenue * 0.95) / 1000))
          : [175, 190, 200, 210, 220, 240, 255, 275, 290, 310],
        borderColor: '#34d399',
        borderWidth: 2,
        type: 'line',
        tension: 0.3
      }
    ]
  };

  const tierChartData = {
    labels: (breakdowns?.tiers)
      ? breakdowns.tiers.map(t => t.name)
      : ['Enterprise', 'Mid-Market', 'SMB'],
    datasets: [
      {
        data: (breakdowns?.tiers)
          ? breakdowns.tiers.map(t => t.percentage)
          : [52, 28, 20],
        backgroundColor: ['#6366f1', '#38bdf8', '#34d399'],
        borderColor: '#0f172a',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-white">OmniMetrics</span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            BI
          </span>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowImport(true)}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Import Data
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition font-medium"
          >
            Export Report
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {importedDataset && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-emerald-400">
                Local dataset loaded
              </p>
              <p className="text-[11px] text-slate-400">
                {importedDataset.fileName} · {importedDataset.totalRows.toLocaleString()} records
              </p>
            </div>
            <button
              onClick={() => setImportedDataset(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear imported data
            </button>
          </div>
        )}

        <KPIGrid kpis={kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartWidget
            title="Revenue & Target Trajectory"
            subtitle="Monthly gross revenue compared to forecasted targets"
            className="lg:col-span-2"
            data={revenueChartData}
            defaultType="bar"
          />
          <ChartWidget
            title="Tier Share"
            subtitle="Revenue contribution by tier"
            data={tierChartData}
            defaultType="doughnut"
          />
        </div>

        <TableDrilldown data={importedDataset?.data || null} />
      </main>

      {showImport && (
        <DataImporter
          onClose={() => setShowImport(false)}
          onDataIngested={setImportedDataset}
        />
      )}

      {showExport && <ReportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}
