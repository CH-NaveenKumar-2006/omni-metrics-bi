import React, { useMemo, useState } from 'react';

const demoData = [
  { id: 'ACC-8101', date: '2026-10-28', account: 'Datadog Systems Inc.', tier: 'Enterprise', region: 'North America', arr: 94500, status: 'Active' },
  { id: 'ACC-8102', date: '2026-10-27', account: 'Stripe Payments UK', tier: 'Enterprise', region: 'EMEA', arr: 128000, status: 'Expansion' },
  { id: 'ACC-8103', date: '2026-10-25', account: 'Canva Design Hub', tier: 'Mid-Market', region: 'APAC', arr: 42000, status: 'Active' },
  { id: 'ACC-8104', date: '2026-10-22', account: 'Nubank Financial', tier: 'Enterprise', region: 'LATAM', arr: 115000, status: 'Renewal' },
  { id: 'ACC-8105', date: '2026-10-20', account: 'Shopify Storefronts', tier: 'Mid-Market', region: 'North America', arr: 38500, status: 'Active' }
];

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—';

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function compareValues(a, b) {
  if (a == null) return 1;
  if (b == null) return -1;

  const numA = Number(a);
  const numB = Number(b);

  if (String(a).trim() !== '' && String(b).trim() !== '' &&
      Number.isFinite(numA) && Number.isFinite(numB)) {
    return numA - numB;
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base'
  });
}

export default function TableDrilldown({ data }) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const hasImportedData = Array.isArray(data);
  const records = hasImportedData ? data : demoData;

  const columns = useMemo(() => {
    return [...new Set(records.flatMap(row => Object.keys(row || {})))];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = records.filter(row =>
      columns.some(column =>
        formatValue(row?.[column]).toLowerCase().includes(query)
      )
    );

    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      const result = compareValues(
        a?.[sortConfig.key],
        b?.[sortConfig.key]
      );

      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [records, columns, search, sortConfig]);

  const handleSort = (column) => {
    setSortConfig(current => ({
      key: column,
      direction:
        current.key === column && current.direction === 'asc'
          ? 'desc'
          : 'asc'
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              Account Ledger Drilldown
            </h3>
            <span className={`text-[9px] px-2 py-0.5 rounded border ${
              hasImportedData
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {hasImportedData ? 'IMPORTED DATA' : 'DEMO DATA'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search, sort and explore transactional records
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search all columns..."
          aria-label="Search ledger records"
          className="w-full sm:w-56 bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span>
          Showing <span className="text-white font-semibold">
            {filteredRecords.length.toLocaleString()}
          </span> of {records.length.toLocaleString()} records
        </span>
        <span>{columns.length} columns</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              {columns.map(column => (
                <th key={column} className="py-3 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort(column)}
                    className="flex items-center gap-1 font-semibold hover:text-white transition"
                  >
                    {column.replace(/[_-]/g, ' ')}
                    <span className="text-indigo-400">
                      {sortConfig.key === column
                        ? sortConfig.direction === 'asc' ? '↑' : '↓'
                        : '↕'}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {filteredRecords.map((row, index) => (
              <tr
                key={row.id ?? row.ID ?? index}
                className="hover:bg-slate-800/40 transition-colors"
              >
                {columns.map(column => (
                  <td
                    key={column}
                    className="py-3 px-3 whitespace-nowrap max-w-xs truncate"
                    title={formatValue(row?.[column])}
                  >
                    {formatValue(row?.[column])}
                  </td>
                ))}
              </tr>
            ))}

            {filteredRecords.length === 0 && (
              <tr>
                <td
                  colSpan={Math.max(columns.length, 1)}
                  className="py-10 text-center text-slate-500"
                >
                  {records.length === 0
                    ? 'No records available. Import a CSV or JSON file to get started.'
                    : 'No matching records found. Try another search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-500">
        {hasImportedData
          ? 'Data is processed locally in your browser.'
          : 'Sample records are displayed for demonstration.'}
        {' '}Select a column heading to change its sorting order.
      </p>
    </div>
  );
}
