import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Sliders, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

export const StatsCard = ({ title: defaultTitle, value: defaultValue, growth: defaultGrowth, icon: Icon, type = 'dark', subtext: defaultSubtext, isPositive = true }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(5); // Default to Saturday (Index 5)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [metricViewMode, setMetricViewMode] = useState('Default');
  const toast = useToast();

  const dailyRevenueData = [
    { day: 'Mon', val: '₹420.00', h: 35 },
    { day: 'Tue', val: '₹580.50', h: 45 },
    { day: 'Wed', val: '₹790.00', h: 60 },
    { day: 'Thu', val: '₹640.25', h: 50 },
    { day: 'Fri', val: '₹980.00', h: 85 },
    { day: 'Sat', val: '₹1,210.60', h: 95 },
    { day: 'Sun', val: '₹510.00', h: 40 }
  ];

  const handleSliderClick = (e) => {
    e.stopPropagation();
    setIsFilterModalOpen(true);
  };

  const handleDayClick = (index, item) => {
    setSelectedDayIdx(index);
    toast.success(`${item.day} Revenue: ${item.val}`, 'Day Selected');
  };

  // Dynamic Data Configurations based on selected filter option
  const getCardMetrics = () => {
    if (type === 'dark') {
      switch (metricViewMode) {
        case 'Gross Revenue Volume':
          return { title: 'Gross Revenue Volume', value: '₹18,450.00', growth: '12.4%', subtext: '₹15,200 last month' };
        case 'Net Orders Count':
          return { title: 'Net Orders Count', value: '154 Orders', growth: '8.5%', subtext: '142 orders last month' };
        case 'Fulfillment Completed Rate':
          return { title: 'Fulfillment Completed Rate', value: '98.2%', growth: '2.1%', subtext: '96.1% last month' };
        case 'MoM Growth Rate':
          return { title: 'MoM Growth Rate', value: '+14.8%', growth: '3.2%', subtext: '11.6% last month' };
        default:
          return { title: defaultTitle, value: defaultValue, growth: defaultGrowth, subtext: defaultSubtext || '15.650 last month' };
      }
    }

    if (type === 'orange') {
      switch (metricViewMode) {
        case 'New Account Registrations':
          return { title: 'New Account Registrations', value: '+12 Accounts', growth: '+15.4%', subtext: '8 new accounts last month', p1: '40%', p2: '60%', l1: '● B2B Corporate', l2: '● Direct Retail' };
        case 'Enterprise vs Retail Share':
          return { title: 'Enterprise vs Retail Share', value: '35% / 65%', growth: '+4.2%', subtext: 'Enterprise Account Dominance', p1: '35%', p2: '65%', l1: '● Enterprise B2B', l2: '● Direct Retail' };
        case 'Customer LTV':
          return { title: 'Customer Avg LTV', value: '₹12,850.00', growth: '+18.9%', subtext: '₹10,800 last month', p1: '50%', p2: '50%', l1: '● Premium SaaS', l2: '● Standard Tier' };
        default:
          return { title: defaultTitle, value: defaultValue, growth: defaultGrowth, subtext: defaultSubtext || '683 accounts active', p1: '35%', p2: '65%', l1: '● Enterprise B2B', l2: '● Direct Retail' };
      }
    }

    if (type === 'light') {
      switch (metricViewMode) {
        case 'Daily Breakdown (Mon-Sun)':
          const dayItem = dailyRevenueData[selectedDayIdx];
          return { title: `Daily Revenue (${dayItem.day})`, value: dayItem.val, growth: '+21%', subtext: 'Peak daily performance' };
        case 'Weekly Revenue Summary':
          return { title: 'Weekly Revenue Summary', value: '₹8,920.00', growth: '+14.5%', subtext: '₹7,780 last week' };
        case 'Category Share Distribution':
          return { title: 'Top Category Revenue', value: '₹4,250.00', growth: '+35%', subtext: 'Electronics revenue share' };
        case 'Tax & Invoice Breakdown':
          return { title: 'Net Invoiced Revenue', value: '₹5,820.00', growth: '+9.8%', subtext: 'Excluding GST taxes' };
        default:
          return { title: defaultTitle, value: defaultValue, growth: defaultGrowth, subtext: defaultSubtext || '₹73 925 last month' };
      }
    }

    return { title: defaultTitle, value: defaultValue, growth: defaultGrowth, subtext: defaultSubtext };
  };

  const activeMetrics = getCardMetrics();

  if (type === 'dark') {
    return (
      <>
        <div className="stats-card-dark" style={{ transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600, transition: 'all 0.3s ease' }}>{activeMetrics.title}</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', letterSpacing: '-0.03em', transition: 'all 0.3s ease' }}>
                {activeMetrics.value}
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F43F5E', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowDownRight size={12} /> {activeMetrics.growth}
                </span>
              </div>
              <div style={{ fontSize: '0.725rem', color: '#6B7280', marginTop: '0.15rem', transition: 'all 0.3s ease' }}>{activeMetrics.subtext}</div>
            </div>
            <button
              onClick={handleSliderClick}
              style={{ color: '#9CA3AF', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
              title="Filter & Change Metric View"
            >
              <Sliders size={16} />
            </button>
          </div>

          {/* SVG Sparkline Curve with Tooltip Badge */}
          <div style={{ position: 'relative', marginTop: '1.25rem' }}>
            <div
              style={{
                position: 'absolute',
                top: '-26px',
                right: '25%',
                backgroundColor: '#FFFFFF',
                color: '#111827',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <span>{activeMetrics.value.startsWith('₹') ? activeMetrics.value : '₹1,210.60'}</span>
            </div>

            <svg viewBox="0 0 300 60" style={{ width: '100%', height: '48px', overflow: 'visible' }}>
              <path
                d="M 0,35 Q 40,55 80,40 T 160,25 T 220,10 T 300,45"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="225" cy="10" r="4" fill="#FFFFFF" />
              <line x1="225" y1="10" x2="225" y2="60" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: '#6B7280', marginTop: '0.25rem' }}>
              <span>1Feb</span>
              <span>8Feb</span>
              <span>16Feb</span>
              <span>25Feb</span>
              <span>30Feb</span>
            </div>
          </div>
        </div>

        {isFilterModalOpen && (
          <Modal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title={`Customize ${defaultTitle} Metric View`}
            footer={<Button variant="primary" onClick={() => setIsFilterModalOpen(false)}>Apply Options</Button>}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select a metric view to update the <strong>{defaultTitle}</strong> card on your dashboard:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Default', 'Gross Revenue Volume', 'Net Orders Count', 'Fulfillment Completed Rate', 'MoM Growth Rate'].map(opt => (
                <div
                  key={opt}
                  onClick={() => {
                    setMetricViewMode(opt);
                    toast.success(`Dashboard updated to show ${opt}`, 'Filter Applied');
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: metricViewMode === opt ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                    border: metricViewMode === opt ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{opt === 'Default' ? `Default (${defaultTitle})` : opt}</span>
                  {metricViewMode === opt && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓ Selected</span>}
                </div>
              ))}
            </div>
          </Modal>
        )}
      </>
    );
  }

  if (type === 'orange') {
    return (
      <>
        <div className="stats-card-orange" style={{ transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, transition: 'all 0.3s ease' }}>{activeMetrics.title}</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', letterSpacing: '-0.03em', transition: 'all 0.3s ease' }}>
                {activeMetrics.value}
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '12px' }}>
                  <ArrowUpRight size={12} /> {activeMetrics.growth}
                </span>
              </div>
              <div style={{ fontSize: '0.725rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.15rem', transition: 'all 0.3s ease' }}>{activeMetrics.subtext}</div>
            </div>
            <button
              onClick={handleSliderClick}
              style={{ color: '#FFFFFF', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
              title="Filter & Change Metric View"
            >
              <Sliders size={16} />
            </button>
          </div>

          {/* Demographic Two-Tone Progress Bar */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', height: '36px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#1A1A1E', padding: '3px' }}>
              <div style={{ width: activeMetrics.p1 || '35%', backgroundColor: '#FFFFFF', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#111827', transition: 'all 0.4s ease' }}>
                {activeMetrics.p1 || '35%'}
              </div>
              <div style={{ width: activeMetrics.p2 || '65%', backgroundColor: '#27272A', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF', transition: 'all 0.4s ease' }}>
                {activeMetrics.p2 || '65%'}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.4rem', fontWeight: 700 }}>
              <span>{activeMetrics.l1 || '● Enterprise B2B'}</span>
              <span>{activeMetrics.l2 || '● Direct Retail'}</span>
            </div>
          </div>
        </div>

        {isFilterModalOpen && (
          <Modal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title={`Customize ${defaultTitle} Metric View`}
            footer={<Button variant="primary" onClick={() => setIsFilterModalOpen(false)}>Apply Options</Button>}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select a metric view to update the <strong>{defaultTitle}</strong> card on your dashboard:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Default', 'Active Customer Accounts', 'New Account Registrations', 'Enterprise vs Retail Share', 'Customer LTV'].map(opt => (
                <div
                  key={opt}
                  onClick={() => {
                    setMetricViewMode(opt);
                    toast.success(`Dashboard updated to show ${opt}`, 'Filter Applied');
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: metricViewMode === opt ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                    border: metricViewMode === opt ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{opt === 'Default' ? `Default (${defaultTitle})` : opt}</span>
                  {metricViewMode === opt && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓ Selected</span>}
                </div>
              ))}
            </div>
          </Modal>
        )}
      </>
    );
  }

  if (type === 'light') {
    const selectedDayData = dailyRevenueData[selectedDayIdx];

    return (
      <>
        <div className="stats-card-light" style={{ transition: 'all 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, transition: 'all 0.3s ease' }}>{activeMetrics.title}</div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', letterSpacing: '-0.03em', color: 'var(--text-main)', transition: 'all 0.3s ease' }}>
                {activeMetrics.value}
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'var(--success-bg)', padding: '2px 6px', borderRadius: '12px' }}>
                  <ArrowUpRight size={12} /> {activeMetrics.growth}
                </span>
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem', transition: 'all 0.3s ease' }}>{activeMetrics.subtext}</div>
            </div>
            <button
              onClick={handleSliderClick}
              style={{ color: 'var(--text-muted)', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              title="Filter & Change Metric View"
            >
              <Sliders size={16} />
            </button>
          </div>

          {/* Interactive Bar Matrix Graphics (Mon - Sun) */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '52px', marginTop: '1.25rem', position: 'relative' }}>
            {dailyRevenueData.map((item, i) => (
              <div
                key={i}
                onClick={() => handleDayClick(i, item)}
                style={{
                  flex: 1,
                  height: `${item.h}%`,
                  backgroundColor: selectedDayIdx === i ? '#FF3B00' : 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {selectedDayIdx === i && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#111827',
                      color: '#FFF',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      zIndex: 10
                    }}
                  >
                    {item.val}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Days Selectors */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {dailyRevenueData.map((item, i) => (
              <span
                key={i}
                onClick={() => handleDayClick(i, item)}
                style={{
                  cursor: 'pointer',
                  fontWeight: selectedDayIdx === i ? 900 : 600,
                  color: selectedDayIdx === i ? '#FF3B00' : 'var(--text-muted)',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.day}
              </span>
            ))}
          </div>
        </div>

        {isFilterModalOpen && (
          <Modal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            title={`Customize ${defaultTitle} Metric View`}
            footer={<Button variant="primary" onClick={() => setIsFilterModalOpen(false)}>Apply Options</Button>}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select a metric view to update the <strong>{defaultTitle}</strong> card on your dashboard:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Default', 'Daily Breakdown (Mon-Sun)', 'Weekly Revenue Summary', 'Category Share Distribution', 'Tax & Invoice Breakdown'].map(opt => (
                <div
                  key={opt}
                  onClick={() => {
                    setMetricViewMode(opt);
                    toast.success(`Dashboard updated to show ${opt}`, 'Filter Applied');
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: metricViewMode === opt ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                    border: metricViewMode === opt ? '1px solid var(--primary)' : '1px solid transparent',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{opt === 'Default' ? `Default (${defaultTitle})` : opt}</span>
                  {metricViewMode === opt && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓ Selected</span>}
                </div>
              ))}
            </div>
          </Modal>
        )}
      </>
    );
  }

  return null;
};
