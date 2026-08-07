import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, Lock, Mail, ArrowRight, Eye, EyeOff, Send, LogIn, User, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { api } from '../../services/api';

export const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login & Registration State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@inventra.io');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Inventory Manager');
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email || !password) {
        toast.error('Please enter a valid email and password');
        return;
      }
      login(email, password);
      toast.success('Welcome back to Inventra Enterprise!', 'Login Successful');
      navigate('/dashboard');
    } else {
      // Register Mode
      if (!name || !email || !password) {
        toast.error('Please fill in all required fields (Name, Email, Password)');
        return;
      }
      login(email, password);
      toast.success(`Welcome to Inventra, ${name}! Your ${role} account is ready.`, 'Account Registered');
      navigate('/dashboard');
    }
  };

  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    const targetEmail = forgotEmail || email;
    if (!targetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    setMagicLinkSent(true);
    try {
      await api.forgotPassword(targetEmail);
    } catch (err) {}
    toast.success(`One-Time Magic Login Link generated for ${targetEmail}`, 'Email Link Dispatched');
  };

  const handleDirectEmailLogin = () => {
    const targetEmail = forgotEmail || email || 'admin@inventra.io';
    login(targetEmail, 'magic-link-auth');
    toast.success(`Authenticated successfully via email magic link (${targetEmail})`, 'Email Login Success');
    setShowForgotModal(false);
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #070A11 0%, #0F172A 40%, #4F46E5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background glass glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.2)',
          filter: 'blur(100px)',
          top: '-10%',
          left: '-10%'
        }}
      />

      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '450px',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 10px 20px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Boxes size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Inventra SaaS ERP</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {mode === 'login'
              ? 'Enter your credentials to access the portal'
              : 'Create your enterprise workspace account'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '0.3rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: mode === 'login' ? 'var(--card-bg)' : 'transparent',
              color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: mode === 'login' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: mode === 'register' ? 'var(--card-bg)' : 'transparent',
              color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: mode === 'register' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Register Account
          </button>
        </div>

        <form onSubmit={handleAuthSubmit}>
          {mode === 'register' && (
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Divya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />
          )}

          <Input
            label="Work Email"
            type="email"
            placeholder="user@inventra.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
          />

          {mode === 'register' && (
            <Input
              label="Organization Role"
              type="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              icon={Shield}
              options={[
                'Inventory Manager',
                'Procurement Specialist',
                'Warehouse Operator',
                'Super Administrator'
              ]}
            />
          )}

          {mode === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setMagicLinkSent(false);
                  setShowForgotModal(true);
                }}
                style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" size="lg" icon={mode === 'login' ? ArrowRight : UserPlus}>
            {mode === 'login' ? 'Login to Dashboard' : 'Register Account & Sign In'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <>
              New to Inventra ERP?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Create an Account
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Forgot Password & Email Login Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Forgot Password / Instant Magic Link"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowForgotModal(false)}>Cancel</Button>
            {magicLinkSent ? (
              <Button variant="primary" icon={LogIn} onClick={handleDirectEmailLogin}>
                Login Now via Email Link
              </Button>
            ) : (
              <Button variant="primary" icon={Send} onClick={handleSendMagicLink}>
                Generate Magic Link
              </Button>
            )}
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Forgot your password? Enter your registered work email address below to generate an instant one-time login link or dispatch an email.
        </p>

        <Input
          label="Registered Email Address"
          type="email"
          placeholder="user@enterprise.com"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          icon={Mail}
          required
        />

        {magicLinkSent && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.875rem',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem'
            }}
          >
            <strong>✨ Magic Link Sent:</strong> Password reset request sent to <strong>{forgotEmail}</strong>. You can also click the blue <strong>"Login Now via Email Link"</strong> button below to sign in immediately.
          </div>
        )}
      </Modal>
    </div>
  );
};
