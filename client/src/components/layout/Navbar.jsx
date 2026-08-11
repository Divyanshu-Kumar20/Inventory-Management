import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, User, Settings, LogOut, CheckCircle2, Key, Lock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const Navbar = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Password Reset Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Low Stock Alert', desc: 'Herman Miller Aeron Chair is below threshold (4 left)', time: '10m ago', read: false },
    { id: 2, title: 'New Order Received', desc: 'Order #ORD-8941 placed by Apex Corp (₹3,247.50)', time: '45m ago', read: false },
    { id: 3, title: 'Product Added', desc: 'Keychron K2 Mechanical Keyboard restocked', time: '2h ago', read: false }
  ]);

  const navigate = useNavigate();
  const toast = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read', 'Notifications');
  };

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.info(`Searching system for "${searchQuery}"`, 'Global Search');
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Account password updated securely', 'Password Reset');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowResetPasswordModal(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle-btn" onClick={toggleMobileSidebar}>
          <Menu size={22} />
        </button>

        <div className="navbar-search">
          <Search size={18} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleGlobalSearch}
          />
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="icon-badge"></span>}
          </button>

          {showNotifications && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '50px',
                width: '340px',
                zIndex: 100,
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  Notifications {unreadCount > 0 && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>({unreadCount} new)</span>}
                </h4>
                {unreadCount > 0 ? (
                  <button
                    onClick={handleMarkAllRead}
                    style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    Mark all read
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All caught up</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: n.read ? 'var(--card-bg)' : 'var(--bg-tertiary)',
                      border: n.read ? '1px solid var(--border-color)' : '1px solid transparent',
                      display: 'flex',
                      gap: '0.6rem',
                      opacity: n.read ? 0.75 : 1
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: n.read ? 'var(--text-light)' : 'var(--primary)', marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700 }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '2px' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-menu"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div className="avatar">{user?.avatar || 'AV'}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Alex Vance'}</span>
              <span className="user-role">{user?.role || 'Super Admin'}</span>
            </div>
          </div>

          {showProfileMenu && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '54px',
                width: '220px',
                zIndex: 100,
                padding: '0.5rem'
              }}
            >
              <Link
                to="/profile"
                className="nav-item"
                onClick={() => setShowProfileMenu(false)}
                style={{ color: 'var(--text-main)' }}
              >
                <User size={16} /> My Profile
              </Link>
              <button
                type="button"
                className="nav-item w-full"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowResetPasswordModal(true);
                }}
                style={{ color: 'var(--text-main)', border: 'none', background: 'transparent', textAlign: 'left' }}
              >
                <Key size={16} /> Reset Password
              </button>
              <Link
                to="/settings"
                className="nav-item"
                onClick={() => setShowProfileMenu(false)}
                style={{ color: 'var(--text-main)' }}
              >
                <Settings size={16} /> System Settings
              </Link>
              <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.35rem 0' }} />
              <button
                onClick={handleLogout}
                className="nav-item w-full"
                style={{ color: 'var(--danger-text)', border: 'none', background: 'transparent', textAlign: 'left' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Password Reset Modal from Profile Menu */}
      <Modal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        title="Reset Account Password"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowResetPasswordModal(false)}>Cancel</Button>
            <Button variant="primary" icon={Save} onClick={handleResetPasswordSubmit}>
              Update Password
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Change security password for <strong>{user?.email || 'admin@inventra.io'}</strong>.
        </p>

        <form onSubmit={handleResetPasswordSubmit}>
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={Lock}
            required
          />
          <Input
            label="New Security Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={Key}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Key}
            required
          />
        </form>
      </Modal>
    </header>
  );
};
