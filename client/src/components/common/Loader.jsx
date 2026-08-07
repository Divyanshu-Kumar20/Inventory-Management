import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading enterprise data...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        gap: '1rem',
        color: 'var(--text-muted)'
      }}
    >
      <Loader2 size={32} className="spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
