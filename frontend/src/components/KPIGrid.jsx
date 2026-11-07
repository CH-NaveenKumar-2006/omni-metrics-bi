import React from 'react';
import KPICard from './KPICard';

export default function KPIGrid({ kpis }) {
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard
        label="Total ARR"
        value={`$${(kpis.totalRevenue?.value / 1000000).toFixed(2)}M`}
        delta="+14.8% YoY"
        targetText="Goal: $3.0M"
        progressPct={94.8}
      />
      <KPICard
        label="Net MRR"
        value={`$${(kpis.mrr?.value / 1000).toFixed(1)}k`}
        delta="+8.5% MoM"
        targetText="Target: $250k"
        progressPct={94.8}
      />
      <KPICard
        label="Blended CAC"
        value={`$${kpis.cac?.value}`}
        delta="-6.4% Efficiency"
        targetText="Cap: $320"
        status="Optimal"
        progressPct={88}
      />
      <KPICard
        label="Average LTV"
        value={`$${kpis.ltv?.value?.toLocaleString()}`}
        delta="+11.2%"
        targetText="LTV:CAC"
        status="17.1x"
        progressPct={100}
      />
      <KPICard
        label="Net Retention (NRR)"
        value={`${kpis.netRetentionRate?.value}%`}
        delta="+2.1%"
        targetText="Target: >115%"
        status="Exceeded"
        progressPct={100}
      />
      <KPICard
        label="Monthly Churn"
        value={`${kpis.churnRate?.value}%`}
        delta="-0.3%"
        targetText="Threshold: <1.5%"
        status="Healthy"
        progressPct={75}
      />
    </div>
  );
}
