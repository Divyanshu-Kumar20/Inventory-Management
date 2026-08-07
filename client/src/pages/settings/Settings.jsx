import React, { useState } from 'react';
import { User, Lock, Moon, Sun, Bell, Shield, Save, RefreshCw, Trash2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';

export const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'alex.vance@inventra.io');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Notification toggles
  const [notifications, setNotifications] = useState({
    lowStockAlerts: true,
    newOrders: true,
    dailyReportSummary: false,
    systemUpdates: true
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Enterprise profile settings updated successfully', 'Profile Saved');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      toast.error('Please enter current and new password');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Account password updated securely', 'Password Updated');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved', 'Preferences Saved');
  };

  const handleResetWorkspaceData = () => {
    mockApi.resetWorkspaceData();
    toast.success('Sales reports, orders, and customer data reset to ₹0 for this workspace', 'Workspace Reset');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enterprise System Settings</h1>
          <p className="page-subtitle">Configure organization profile, security policies, visual theme, and event triggers.</p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <Button
          variant={activeTab === 'profile' ? 'primary' : 'outline'}
          size="sm"
          icon={User}
          onClick={() => setActiveTab('profile')}
        >
          Profile Details
        </Button>
        <Button
          variant={activeTab === 'security' ? 'primary' : 'outline'}
          size="sm"
          icon={Lock}
          onClick={() => setActiveTab('security')}
        >
          Security & Password
        </Button>
        <Button
          variant={activeTab === 'theme' ? 'primary' : 'outline'}
          size="sm"
          icon={Sun}
          onClick={() => setActiveTab('theme')}
        >
          Appearance & Theme
        </Button>
        <Button
          variant={activeTab === 'notifications' ? 'primary' : 'outline'}
          size="sm"
          icon={Bell}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </Button>
      </div>

      {/* Tab 1: Profile & Workspace Reset */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Organization User Profile" maxWidth="640px">
            <form onSubmit={handleSaveProfile} style={{ marginTop: '1rem' }}>
              <div className="grid grid-cols-2">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Work Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Input label="Role / Permission Level" value={user?.role || 'Super Administrator'} disabled />
              <Input label="Organization / Department" value="Global Procurement & Operations" disabled />
              
              <div style={{ marginTop: '1.25rem' }}>
                <Button type="submit" variant="primary" icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Workspace Data Management" maxWidth="640px">
            <div style={{ marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Want a clean slate for this account? Reset all sales orders, customer transactions, and sales report metrics back to <strong>₹0 (zero)</strong>.
              </p>
              <Button variant="danger" icon={RefreshCw} onClick={handleResetWorkspaceData}>
                Reset Sales & Orders Data to Zero (₹0)
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'security' && (
        <Card title="Change Security Password">
          <form onSubmit={handleSavePassword} style={{ marginTop: '1rem', maxWidth: '500px' }}>
            <Input
              label="Current Password"
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />

            <div style={{ marginTop: '1.25rem' }}>
              <Button type="submit" variant="primary" icon={Lock}>
                Update Account Password
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Appearance & Theme */}
      {activeTab === 'theme' && (
        <Card title="System Display & Color Mode">
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Choose your preferred portal theme layout mode.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div
                onClick={() => theme !== 'light' && toggleTheme()}
                style={{
                  padding: '1.25rem 2rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${theme === 'light' ? 'var(--primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: 700
                }}
              >
                <Sun size={24} style={{ color: '#F59E0B' }} />
                <span>Light Mode</span>
              </div>

              <div
                onClick={() => theme !== 'dark' && toggleTheme()}
                style={{
                  padding: '1.25rem 2rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  backgroundColor: '#0B0F19',
                  color: '#F9FAFB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: 700
                }}
              >
                <Moon size={24} style={{ color: '#3B82F6' }} />
                <span>Dark Mode</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <Card title="Event Alerts & Email Triggers">
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '550px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Low Stock Warnings</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Send instant alert when inventory falls below 10 units</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.lowStockAlerts}
                onChange={(e) => setNotifications(prev => ({ ...prev, lowStockAlerts: e.target.checked }))}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700 }}>New Purchase Orders</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Notify when a customer submits a new order</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.newOrders}
                onChange={(e) => setNotifications(prev => ({ ...prev, newOrders: e.target.checked }))}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Daily Executive Briefing</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive morning email summary of daily revenue and activity</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.dailyReportSummary}
                onChange={(e) => setNotifications(prev => ({ ...prev, dailyReportSummary: e.target.checked }))}
              />
            </label>

            <div style={{ marginTop: '1rem' }}>
              <Button variant="primary" icon={Save} onClick={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
