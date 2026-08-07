import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Card } from '../common/Card';

const data = [
  { month: 'Jan', sales: 42000, revenue: 68000 },
  { month: 'Feb', sales: 38000, revenue: 59000 },
  { month: 'Mar', sales: 55000, revenue: 84000 },
  { month: 'Apr', sales: 48000, revenue: 76000 },
  { month: 'May', sales: 62000, revenue: 98000 },
  { month: 'Jun', sales: 75000, revenue: 115000 },
  { month: 'Jul', sales: 89000, revenue: 128450 }
];

export const SalesChart = () => {
  return (
    <Card
      title="Monthly Sales & Revenue Overview"
      action={
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Updated 1 hour ago
        </span>
      }
    >
      <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="month" tickLine={false} stroke="var(--text-muted)" fontSize={12} />
            <YAxis tickLine={false} stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                borderRadius: '8px',
                color: 'var(--text-main)'
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, '']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="sales"
              name="Sales Volume"
              stroke="#22C55E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
