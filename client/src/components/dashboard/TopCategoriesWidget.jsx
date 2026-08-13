import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Download, ArrowUpRight } from 'lucide-react';

export const TopCategoriesWidget = () => {
  const [filter, setFilter] = useState('Monthly');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Categories Donut Chart Card */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Top categories</h3>
          <ArrowUpRight size={16} color="var(--text-muted)" />
        </div>

        {/* SVG Donut Ring Visualization */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0', position: 'relative' }}>
          <svg viewBox="0 0 160 160" style={{ width: '150px', height: '150px', transform: 'rotate(-90deg)' }}>
            {/* 35% Electronics (Dark Graphite) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#121215" strokeWidth="24" strokeDasharray="120 230" />
            {/* 23% Furniture (Electric Orange) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#FF3B00" strokeWidth="24" strokeDasharray="80 270" strokeDashoffset="-120" />
            {/* 20% Appliances (Light Grey) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#CBD5E1" strokeWidth="24" strokeDasharray="70 280" strokeDashoffset="-200" />
            {/* 12% Stationery (Dark Textured) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#334155" strokeWidth="24" strokeDasharray="40 310" strokeDashoffset="-270" />
          </svg>

          {/* Centered % Text */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>35%</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>Electronics</div>
          </div>
        </div>

        {/* Legend Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <span><strong style={{ color: '#121215' }}>●</strong> Electronics</span>
          <span><strong style={{ color: '#FF3B00' }}>●</strong> Furniture</span>
          <span><strong style={{ color: '#CBD5E1' }}>●</strong> Appliances</span>
          <span><strong style={{ color: '#334155' }}>●</strong> Stationery</span>
        </div>

        {/* Time Filter Pills */}
        <div className="pill-selector" style={{ width: '100%', justifyContent: 'center' }}>
          {['All time', 'Weekly', 'Monthly'].map(f => (
            <div
              key={f}
              className={`pill-option ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ flex: 1, textAlign: 'center' }}
            >
              {f}
            </div>
          ))}
        </div>
      </Card>

      {/* Regional Sales Breakdown Card */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Sales by region</h3>
          <ArrowUpRight size={16} color="var(--text-muted)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem', height: '110px', margin: '1rem 0 0.5rem 0' }}>
          {[
            { country: 'USA', val: 25, height: '90%' },
            { country: 'Japan', val: 22, height: '78%' },
            { country: 'UK', val: 20, height: '70%' },
            { country: 'Korea', val: 18, height: '62%' },
            { country: 'Spain', val: 15, height: '52%' }
          ].map((c, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.675rem', fontWeight: 800, marginBottom: '4px' }}>{c.val}%</span>
              <div
                style={{
                  width: '100%',
                  height: c.height,
                  backgroundColor: i === 0 ? '#121215' : i === 1 ? '#FF3B00' : 'var(--bg-tertiary)',
                  borderRadius: '6px'
                }}
              />
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 700 }}>{c.country}</span>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          style={{ width: '100%', marginTop: '1rem', backgroundColor: '#121215', color: '#FFFFFF', borderRadius: 'var(--radius-full)' }}
          icon={Download}
        >
          Export Statistics
        </Button>
      </Card>
    </div>
  );
};
