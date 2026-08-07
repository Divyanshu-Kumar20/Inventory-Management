import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ id, title, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />;
      case 'warning': return <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />;
      case 'danger': return <AlertCircle size={20} style={{ color: 'var(--danger)' }} />;
      default: return <Info size={20} style={{ color: 'var(--info)' }} />;
    }
  };

  return (
    <div className="toast">
      {getIcon()}
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{title}</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ color: 'var(--text-light)', padding: 0 }}>
        <X size={16} />
      </button>
    </div>
  );
};
