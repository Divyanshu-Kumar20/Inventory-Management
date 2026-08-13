import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sliders, TrendingUp, Users, DollarSign, Package } from 'lucide-react';

export const StatsCard = ({ title, value, growth, icon: Icon, type = 'dark', subtext, isPositive = true }) => {
  if (type === 'dark') {
    return (
      <div className="stats-card-dark">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', letterSpacing: '-0.03em' }}>
              {value}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F43F5E', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <ArrowDownRight size={12} /> {growth}
              </span>
            </div>
            <div style={{ fontSize: '0.725rem', color: '#6B7280', marginTop: '0.15rem' }}>{subtext || 'vs. last month'}</div>
          </div>
          <button style={{ color: '#6B7280', padding: '0.35rem' }}>
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
            <span>₹1210.6</span>
          </div>

          <svg viewBox="0 0 300 60" style={{ width: '100%', height: '48px', overflow: 'visible' }}>
            <path
              d="M 0,35 Q 40,55 80,40 T 160,25 T 220,10 T 300,45"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Pulsing dot marker */}
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
    );
  }

  if (type === 'orange') {
    return (
      <div className="stats-card-orange">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', letterSpacing: '-0.03em' }}>
              {value}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '12px' }}>
                <ArrowUpRight size={12} /> {growth}
              </span>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.15rem' }}>{subtext || '683 active accounts'}</div>
          </div>
          <button style={{ color: 'rgba(255, 255, 255, 0.8)', padding: '0.35rem' }}>
            <Sliders size={16} />
          </button>
        </div>

        {/* Demographic Two-Tone Progress Bar */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', height: '36px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#1A1A1E', padding: '3px' }}>
            <div style={{ width: '35%', backgroundColor: '#FFFFFF', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#111827' }}>
              35%
            </div>
            <div style={{ width: '65%', backgroundColor: '#27272A', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#FFFFFF' }}>
              65%
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.4rem', fontWeight: 700 }}>
            <span>● Enterprise B2B</span>
            <span>● Direct Retail</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'light') {
    return (
      <div className="stats-card-light">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
              {value}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'var(--success-bg)', padding: '2px 6px', borderRadius: '12px' }}>
                <ArrowUpRight size={12} /> {growth}
              </span>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{subtext || 'vs. last month'}</div>
          </div>
          <button style={{ color: 'var(--text-muted)', padding: '0.35rem' }}>
            <Sliders size={16} />
          </button>
        </div>

        {/* Bar Matrix Graphics */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '48px', marginTop: '1.25rem' }}>
          {[35, 45, 60, 50, 85, 95, 40].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                backgroundColor: i === 5 ? '#FF3B00' : 'var(--bg-tertiary)',
                borderRadius: '4px',
                position: 'relative'
              }}
            >
              {i === 5 && (
                <div style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#111827', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '1px 4px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                  ₹1210.6
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    );
  }

  // Fallback / Standard Card
  return (
    <div className="stats-card-light">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--text-main)' }}>{value}</div>
        </div>
        <div style={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 700, color: isPositive ? '#10B981' : '#F43F5E' }}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{growth} vs last month</span>
      </div>
    </div>
  );
};
