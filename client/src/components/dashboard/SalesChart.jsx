import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card } from '../common/Card';
import { Sliders } from 'lucide-react';

const monthlyOrdersData = [
  { month: 'Jan', income: 45, profit: 25 },
  { month: 'Feb', income: 55, profit: 30 },
  { month: 'Mar', income: 70, profit: 35 },
  { month: 'Apr', income: 65, profit: 28 },
  { month: 'May', income: 50, profit: 20 },
  { month: 'Jun', income: 75, profit: 25 }, // Highlight month
  { month: 'Jul', income: 85, profit: 40 },
  { month: 'Aug', income: 60, profit: 30 },
  { month: 'Sep', income: 40, profit: 18 },
  { month: 'Oct', income: 90, profit: 45 },
  { month: 'Nov', income: 80, profit: 38 },
  { month: 'Dec', income: 95, profit: 50 }
];

export const SalesChart = () => {
  const [activeTab, setActiveTab] = useState('Income');

  return (
    <Card style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Total Orders & Revenue</h3>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Monthly sales performance & order fulfillment volume</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <strong style={{ color: '#FF3B00', fontSize: '1.1rem' }}>●</strong> Income
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <strong style={{ color: '#121215', fontSize: '1.1rem' }}>●</strong> Profit Margin
            </span>
          </div>
          <button style={{ color: 'var(--text-muted)', padding: '0.35rem' }}>
            <Sliders size={16} />
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 310, marginTop: '0.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyOrdersData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="month" tickLine={false} stroke="var(--text-muted)" fontSize={12} fontWeight={600} />
            <YAxis tickLine={false} stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121215',
                borderColor: '#121215',
                borderRadius: '10px',
                color: '#FFFFFF',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                fontSize: '0.825rem',
                fontWeight: 700
              }}
              formatter={(value, name) => [`${value}%`, name === 'income' ? 'Gross Income' : 'Net Margin']}
            />
            <Bar dataKey="profit" stackId="a" fill="#121215" radius={[0, 0, 0, 0]} barSize={18} />
            <Bar dataKey="income" stackId="a" fill="#FF3B00" radius={[6, 6, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
