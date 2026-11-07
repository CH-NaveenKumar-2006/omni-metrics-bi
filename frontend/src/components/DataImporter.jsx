import React, { useState } from 'react';
import Papa from 'papaparse';

export default function DataImporter({ onClose, onDataIngested }) {
  const [statusMsg, setStatusMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusType, setStatusType] = useState('info');

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();

    if (!['csv', 'json'].includes(extension)) {
      setStatusType('error');
      setStatusMsg('Please select a CSV or JSON file.');
      e.target.value = '';
      return;
    }

    setIsLoading(true);
    setStatusType('info');
    setStatusMsg(`Reading ${file.name}...`);

    try {
      let records = [];

      if (extension === 'csv') {
        records = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy',
            dynamicTyping: true,
            transformHeader: (header) => header.trim(),
            complete: (results) => {
              if (results.errors.length > 0) {
                reject(new Error(results.errors[0].message));
                return;
              }

              resolve(results.data);
            },
            error: (error) => reject(error)
          });
        });
      } else {
        const content = await file.text();
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed)) {
          records = parsed;
        } else if (Array.isArray(parsed.data)) {
          records = parsed.data;
        } else if (Array.isArray(parsed.rows)) {
          records = parsed.rows;
        } else {
          throw new Error('JSON must contain an array of records, data, or rows.');
        }
      }

      records = records.filter(
        (row) =>
          row &&
          typeof row === 'object' &&
          !Array.isArray(row) &&
          Object.keys(row).length > 0
      );

      if (records.length === 0) {
        throw new Error('No valid records were found in the selected file.');
      }

      const headers = Object.keys(records[0]);

      if (headers.length === 0) {
        throw new Error('The imported records contain no columns.');
      }

      if (typeof onDataIngested !== 'function') {
        throw new Error('Dashboard import handler is unavailable.');
      }

      onDataIngested({
        data: records,
        totalRows: records.length,
        columns: headers,
        fileName: file.name
      });

      setStatusType('success');
      setStatusMsg(
        `Successfully imported ${records.length.toLocaleString()} records from ${file.name}.`
      );
    } catch (error) {
      setStatusType('error');
      setStatusMsg(`Import failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm">Import Data Sources</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs"
          >
            Close
          </button>
        </div>

        <div className="flex gap-4 border-b border-slate-800 text-xs">
          <span className="pb-2 text-indigo-400 border-b-2 border-indigo-400 font-semibold">
            Upload CSV / JSON
          </span>

          <span
            className="pb-2 text-slate-600 cursor-not-allowed"
            title="PostgreSQL requires a hosted backend."
          >
            PostgreSQL Query (Unavailable)
          </span>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-slate-400">
            Select a CSV or JSON file. Your data is processed locally in your browser.
          </div>

          <input
            type="file"
            accept=".csv,.json,application/json,text/csv"
            disabled={isLoading}
            onChange={handleFileUpload}
            className="text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer disabled:opacity-50"
          />

          {isLoading && (
            <p className="text-xs text-indigo-400 font-mono">
              Processing file...
            </p>
          )}

          {statusMsg && (
            <p
              role="status"
              className={`text-xs font-mono ${
                statusType === 'error'
                  ? 'text-rose-400'
                  : statusType === 'success'
                    ? 'text-emerald-400'
                    : 'text-indigo-400'
              }`}
            >
              {statusMsg}
            </p>
          )}

          <p className="text-[11px] text-slate-500">
            PostgreSQL queries are disabled in the static GitHub Pages version.
            No file data is uploaded to a server.
          </p>
        </div>
      </div>
    </div>
  );
}
