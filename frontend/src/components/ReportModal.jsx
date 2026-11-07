import React, { useState } from 'react';
import { scheduleReport } from '../services/api';

export default function ReportModal({ onClose }) {
  const [email, setEmail] = useState('ops@acme.io');
  const [frequency, setFrequency] = useState('weekly');
  const [status, setStatus] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleSchedule = async () => {
    try {
      await scheduleReport({ reportName: 'Executive Performance Brief', frequency, recipients: [email] });
      setStatus(`Scheduled ${frequency} report delivery to ${email}`);
    } catch (err) {
      setStatus('Failed to save schedule');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm">Export Reports</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">Close</button>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-semibold text-white">Executive PDF Brief</div>
              <div className="text-slate-400 text-[11px]">Formatted summary for board review</div>
            </div>
            <button onClick={handlePrint} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-medium">
              Print / Save PDF
            </button>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="font-semibold text-white">Schedule Automated Brief</div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
              />
            </div>
            <button onClick={handleSchedule} className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium">
              Save Delivery Trigger
            </button>
            {status && <p className="text-emerald-400 font-mono text-[11px]">{status}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
