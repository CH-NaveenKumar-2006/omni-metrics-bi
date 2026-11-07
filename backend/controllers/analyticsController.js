const db = require('../config/db');

exports.getKPIs = async (req, res, next) => {
  try {
    const kpiSummary = {
      totalRevenue: { value: 2845200, currency: '$', deltaPercent: 14.8, target: 3000000, status: 'on_track' },
      mrr: { value: 237100, currency: '$', deltaPercent: 8.5, target: 250000, status: 'on_track' },
      cac: { value: 284, currency: '$', deltaPercent: -6.4, target: 320, status: 'optimal' },
      ltv: { value: 4850, currency: '$', deltaPercent: 11.2, target: 4500, status: 'exceeded' },
      netRetentionRate: { value: 118.4, unit: '%', deltaPercent: 2.1, target: 115, status: 'exceeded' },
      churnRate: { value: 1.15, unit: '%', deltaPercent: -0.3, target: 1.5, status: 'optimal' }
    };
    res.json({ success: true, data: kpiSummary });
  } catch (err) {
    next(err);
  }
};

exports.getTimeSeries = async (req, res, next) => {
  try {
    const data = [
      { month: 'Jan', revenue: 180000, target: 175000, expenses: 120000, newCustomers: 142 },
      { month: 'Feb', revenue: 195000, target: 190000, expenses: 125000, newCustomers: 158 },
      { month: 'Mar', revenue: 210000, target: 200000, expenses: 130000, newCustomers: 175 },
      { month: 'Apr', revenue: 205000, target: 210000, expenses: 128000, newCustomers: 164 },
      { month: 'May', revenue: 228000, target: 220000, expenses: 135000, newCustomers: 189 },
      { month: 'Jun', revenue: 245000, target: 240000, expenses: 140000, newCustomers: 205 },
      { month: 'Jul', revenue: 260000, target: 255000, expenses: 145000, newCustomers: 228 },
      { month: 'Aug', revenue: 280000, target: 275000, expenses: 150000, newCustomers: 245 },
      { month: 'Sep', revenue: 295000, target: 290000, expenses: 155000, newCustomers: 260 },
      { month: 'Oct', revenue: 315000, target: 310000, expenses: 160000, newCustomers: 280 }
    ];
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getBreakdowns = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        tiers: [
          { name: 'Enterprise', percentage: 52, revenue: 1479500 },
          { name: 'Mid-Market', percentage: 28, revenue: 796650 },
          { name: 'SMB', percentage: 20, revenue: 569050 }
        ],
        channels: [
          { name: 'Organic Search', percentage: 34, conversionRate: 4.8 },
          { name: 'Direct Referrals', percentage: 28, conversionRate: 6.5 },
          { name: 'Paid Campaigns', percentage: 20, conversionRate: 3.2 },
          { name: 'Events & Field', percentage: 10, conversionRate: 5.1 },
          { name: 'Partner Ecosystem', percentage: 8, conversionRate: 7.2 }
        ],
        funnel: [
          { stage: 'Unique Visitors', count: 184500, conversion: '100%' },
          { stage: 'Product Signups', count: 24200, conversion: '13.1%' },
          { stage: 'Product Qualified Leads', count: 9800, conversion: '40.5%' },
          { stage: 'Sales Opportunities', count: 3200, conversion: '32.6%' },
          { stage: 'Closed Deals', count: 1420, conversion: '44.4%' }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};
