import React from 'react';
import { User, Mail, Shield, Key, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  const activityLogs = [
    { id: 1, action: 'Updated Product Stock Level (MacBook Pro 16")', time: '15m ago', ip: '192.168.1.45' },
    { id: 2, action: 'Exported Executive Sales Report to CSV', time: '1h ago', ip: '192.168.1.45' },
    { id: 3, action: 'User Authenticated via SSO Portal', time: '3h ago', ip: '192.168.1.45' },
    { id: 4, action: 'Created New Vendor Record (TechSource Global)', time: 'Yesterday 16:30', ip: '192.168.1.45' }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Administrator Profile</h1>
          <p className="page-subtitle">User credentials, access levels, and security audit log.</p>
        </div>
      </div>

      <div className="grid grid-cols-3">
        {/* Left Column: User Card */}
        <Card style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: '1.75rem', margin: '0 auto 1rem auto' }}>
            {user?.avatar || 'AV'}
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{user?.name || 'Alex Vance'}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email || 'alex.vance@inventra.io'}</p>
          
          <div style={{ marginTop: '1rem' }}>
            <Badge variant="success" icon={Shield}>{user?.role || 'Super Admin'}</Badge>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>MFA Status:</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Enforced (TOTP)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Last Login:</span>
              <span style={{ fontWeight: 600 }}>Just Now</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Security Activity Audit Log */}
        <div style={{ gridColumn: 'span 2' }}>
          <Card title="Security Audit & Activity Trail">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {activityLogs.map(log => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{log.action}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IP: {log.ip}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{log.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
