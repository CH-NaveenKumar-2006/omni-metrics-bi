const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('bi_auth_token') || 'demo-token';
  return {
    'Authorization': `Bearer ${token}`,
    ...extraHeaders
  };
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('bi_auth_token', data.token);
  }
  return data;
}

export async function fetchDemoToken() {
  const res = await fetch(`${API_BASE}/auth/demo-token`);
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('bi_auth_token', data.token);
  }
  return data;
}

export async function fetchKPIs() {
  const res = await fetch(`${API_BASE}/analytics/kpis`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch KPIs');
  return res.json();
}

export async function fetchTimeSeries() {
  const res = await fetch(`${API_BASE}/analytics/timeseries`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch time series');
  return res.json();
}

export async function fetchBreakdowns() {
  const res = await fetch(`${API_BASE}/analytics/breakdowns`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch breakdowns');
  return res.json();
}

export async function uploadCSV(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/import/csv`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload CSV');
  return res.json();
}

export async function runQuery(queryText) {
  const res = await fetch(`${API_BASE}/import/sql-query`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ queryText }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to execute SQL query');
  }
  return res.json();
}

export async function scheduleReport(data) {
  const res = await fetch(`${API_BASE}/reports/schedule`, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to schedule report');
  return res.json();
}
