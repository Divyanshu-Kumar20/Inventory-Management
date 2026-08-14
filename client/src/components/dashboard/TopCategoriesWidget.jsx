import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Download, ArrowUpRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const TopCategoriesWidget = () => {
  const [filter, setFilter] = useState('Monthly');
  const toast = useToast();

  // Dynamic Category Breakdown Data based on Time Horizon
  const categoryData = {
    'All time': {
      topPercent: '42%',
      topCategory: 'Electronics',
      stroke1: '145 205', // 42%
      stroke2: '90 260',  // 28%
      offset2: '-145',
      stroke3: '60 290',  // 18%
      offset3: '-235',
      stroke4: '40 310',  // 12%
      offset4: '-295',
      electronics: '42%',
      furniture: '28%',
      appliances: '18%',
      stationery: '12%'
    },
    'Weekly': {
      topPercent: '48%',
      topCategory: 'Electronics',
      stroke1: '165 185', // 48%
      stroke2: '80 270',  // 24%
      offset2: '-165',
      stroke3: '60 290',  // 18%
      offset3: '-245',
      stroke4: '35 315',  // 10%
      offset4: '-305',
      electronics: '48%',
      furniture: '24%',
      appliances: '18%',
      stationery: '10%'
    },
    'Monthly': {
      topPercent: '35%',
      topCategory: 'Electronics',
      stroke1: '120 230', // 35%
      stroke2: '80 270',  // 23%
      offset2: '-120',
      stroke3: '70 280',  // 20%
      offset3: '-200',
      stroke4: '75 275',  // 22%
      offset4: '-270',
      electronics: '35%',
      furniture: '23%',
      appliances: '20%',
      stationery: '22%'
    }
  };

  const activeData = categoryData[filter];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    toast.info(`Switched category breakdown view to ${newFilter}`, 'Filter Updated');
  };

  const handleExportStatistics = () => {
    const csvRows = [
      ['Region', 'Sales Volume Share (%)', 'Target Fulfillment Status'],
      ['USA', '25%', 'Optimal'],
      ['Japan', '22%', 'Exceeding Target'],
      ['UK', '20%', 'Optimal'],
      ['Korea', '18%', 'Steady'],
      ['Spain', '15%', 'Growth Target']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventra_regional_sales_statistics_${filter.toLowerCase().replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Downloaded Regional Sales Statistics CSV report', 'Export Complete');
  };

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
          <svg viewBox="0 0 160 160" style={{ width: '150px', height: '150px', transform: 'rotate(-90deg)', transition: 'all 0.4s ease' }}>
            {/* Slice 1: Electronics (Dark Graphite) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#121215" strokeWidth="24" strokeDasharray={activeData.stroke1} style={{ transition: 'all 0.4s ease' }} />
            {/* Slice 2: Furniture (Electric Orange) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#FF3B00" strokeWidth="24" strokeDasharray={activeData.stroke2} strokeDashoffset={activeData.offset2} style={{ transition: 'all 0.4s ease' }} />
            {/* Slice 3: Appliances (Light Grey) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#CBD5E1" strokeWidth="24" strokeDasharray={activeData.stroke3} strokeDashoffset={activeData.offset3} style={{ transition: 'all 0.4s ease' }} />
            {/* Slice 4: Stationery (Dark Textured) */}
            <circle cx="80" cy="80" r="55" fill="transparent" stroke="#334155" strokeWidth="24" strokeDasharray={activeData.stroke4} strokeDashoffset={activeData.offset4} style={{ transition: 'all 0.4s ease' }} />
          </svg>

          {/* Centered % Text */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', transition: 'all 0.3s ease' }}>
              {activeData.topPercent}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {activeData.topCategory}
            </div>
          </div>
        </div>

        {/* Dynamic Legend Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <span><strong style={{ color: '#121215' }}>●</strong> Electronics ({activeData.electronics})</span>
          <span><strong style={{ color: '#FF3B00' }}>●</strong> Furniture ({activeData.furniture})</span>
          <span><strong style={{ color: '#CBD5E1' }}>●</strong> Appliances ({activeData.appliances})</span>
          <span><strong style={{ color: '#334155' }}>●</strong> Stationery ({activeData.stationery})</span>
        </div>

        {/* Time Filter Pills */}
        <div className="pill-selector" style={{ width: '100%', justifyContent: 'center' }}>
          {['All time', 'Weekly', 'Monthly'].map(f => (
            <div
              key={f}
              className={`pill-option ${filter === f ? 'active' : ''}`}
              onClick={() => handleFilterChange(f)}
              style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
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
          onClick={handleExportStatistics}
          style={{ width: '100%', marginTop: '1rem', backgroundColor: '#121215', color: '#FFFFFF', borderRadius: 'var(--radius-full)', cursor: 'pointer' }}
          icon={Download}
        >
          Export Statistics
        </Button>
      </Card>
    </div>
  );
};
