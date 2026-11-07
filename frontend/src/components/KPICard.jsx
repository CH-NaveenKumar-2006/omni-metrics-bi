import React from 'react';

export default function KPICard({ label, value, delta, targetText, progressPct, status }) {
  const isPositive = delta && delta.startsWith('+');
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition shadow-sm hover:border-slate-700">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        {delta && (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          }`}>
            {delta}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-mono text-white mb-2">{value}</div>
      {targetText && (
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{targetText}</span>
            <span className="text-slate-300 font-medium">{status || `${progressPct}%`}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, progressPct || 80)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
