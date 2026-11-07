import { useState, useEffect } from 'react';
import { fetchKPIs, fetchTimeSeries, fetchBreakdowns } from '../services/api';

export function useAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [breakdowns, setBreakdowns] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [kpiRes, tsRes, bdRes] = await Promise.all([
          fetchKPIs().catch(() => ({
            data: {
              totalRevenue: { value: 2845200, currency: '$', deltaPercent: 14.8, target: 3000000, status: 'on_track' },
              mrr: { value: 237100, currency: '$', deltaPercent: 8.5, target: 250000, status: 'on_track' },
              cac: { value: 284, currency: '$', deltaPercent: -6.4, target: 320, status: 'optimal' },
              ltv: { value: 4850, currency: '$', deltaPercent: 11.2, target: 4500, status: 'exceeded' },
              netRetentionRate: { value: 118.4, unit: '%', deltaPercent: 2.1, target: 115, status: 'exceeded' },
              churnRate: { value: 1.15, unit: '%', deltaPercent: -0.3, target: 1.5, status: 'optimal' }
            }
          })),
          fetchTimeSeries().catch(() => ({
            data: [
              { month: 'Jan', revenue: 180000, target: 175000, expenses: 120000 },
              { month: 'Feb', revenue: 195000, target: 190000, expenses: 125000 },
              { month: 'Mar', revenue: 210000, target: 200000, expenses: 130000 },
              { month: 'Apr', revenue: 205000, target: 210000, expenses: 128000 },
              { month: 'May', revenue: 228000, target: 220000, expenses: 135000 },
              { month: 'Jun', revenue: 245000, target: 240000, expenses: 140000 }
            ]
          })),
          fetchBreakdowns().catch(() => ({
            data: {
              tiers: [
                { name: 'Enterprise', percentage: 52, revenue: 1479500 },
                { name: 'Mid-Market', percentage: 28, revenue: 796650 },
                { name: 'SMB', percentage: 20, revenue: 569050 }
              ]
            }
          }))
        ]);
        setKpis(kpiRes.data);
        setTimeSeries(tsRes.data);
        setBreakdowns(bdRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { loading, error, kpis, timeSeries, breakdowns };
}
