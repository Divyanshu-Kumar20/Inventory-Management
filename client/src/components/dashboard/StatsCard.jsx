import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../common/Card';

export const StatsCard = ({ title, value, growth, icon: Icon, color = '#2563EB', isPositive = true }) => {
  return (
    <Card className="stats-card">
      <div className="stats-header">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{title}</span>
          <div className="stats-value">{value}</div>
        </div>
        <div className="stats-icon-wrapper" style={{ backgroundColor: color }}>
          {Icon && <Icon size={24} />}
        </div>
      </div>

      <div className="stats-footer">
        <div className={`growth-indicator ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{growth}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>vs last month</span>
      </div>
    </Card>
  );
};
