import React, { useState } from 'react';
import { ShieldCheck, FileText, Headphones, Send, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'support' | null
  
  // Support Ticket Form State
  const [ticketData, setTicketData] = useState({
    subject: '',
    severity: 'Medium',
    description: ''
  });

  const toast = useToast();

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketData.subject || !ticketData.description) {
      toast.error('Please fill in ticket subject and issue description');
      return;
    }

    const ticketId = `TICKET-${Math.floor(100000 + Math.random() * 900000)}`;
    toast.success(`Priority Ticket ${ticketId} created! Support team assigned.`, 'Ticket Dispatched');
    setTicketData({ subject: '', severity: 'Medium', description: '' });
    setActiveModal(null);
  };

  return (
    <>
      <footer
        style={{
          padding: '1.25rem 2rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div>
          © {new Date().getFullYear()} <strong>INVENTRA SaaS Enterprise</strong>. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <button
            onClick={() => setActiveModal('privacy')}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveModal('terms')}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveModal('support')}
            style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Enterprise Support 🎧
          </button>
        </div>
      </footer>

      {/* 1. Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Enterprise Data Protection & Privacy Policy"
        maxWidth="640px"
        footer={<Button variant="primary" onClick={() => setActiveModal(null)}>Acknowledge & Close</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Badge variant="success" icon={ShieldCheck}>SOC-2 Type II Certified</Badge>
            <Badge variant="info">GDPR Compliant</Badge>
            <Badge variant="secondary">AES-256 Bit Encryption</Badge>
          </div>

          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>1. Data Storage & Security Protocols</h4>
          <p style={{ color: 'var(--text-muted)' }}>
            Inventra SaaS Enterprise enforces end-to-end data encryption in transit (TLS 1.3) and at rest (AES-256). All customer database tenant data is isolated in private cloud virtual networks.
          </p>

          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>2. Data Retention & Backups</h4>
          <p style={{ color: 'var(--text-muted)' }}>
            Automated multi-region database snapshots occur hourly with a 90-day point-in-time recovery SLA. Customers retain 100% ownership of catalog, order, and audit log data.
          </p>

          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>3. Privacy Rights & Compliance</h4>
          <p style={{ color: 'var(--text-muted)' }}>
            We never share or sell tenant telemetry or inventory metadata. Enterprise administrators hold complete authority to export or permanently purge organizational records.
          </p>
        </div>
      </Modal>

      {/* 2. Terms of Service Modal */}
      <Modal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title="Enterprise Service Level Agreement & Terms"
        maxWidth="640px"
        footer={<Button variant="primary" onClick={() => setActiveModal(null)}>I Accept Terms</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Badge variant="success" icon={CheckCircle2}>99.99% Uptime Guarantee</Badge>
            <Badge variant="info">Enterprise License</Badge>
          </div>

          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>1. Service Level Agreement (SLA)</h4>
          <p style={{ color: 'var(--text-muted)' }}>
            Inventra guarantees 99.99% monthly infrastructure availability. Planned system maintenance windows are communicated 72 hours in advance via executive notification broadcasts.
          </p>

          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>2. Acceptable Use & Account Limits</h4>
          <p style={{ color: 'var(--text-muted)' }}>
            Licenses are granted per authorized enterprise seat. Super Administrators manage role-based access control (RBAC) and system API rate limits for internal staff accounts.
          </p>

          <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>3. Billing & Support Commitments</h4>
          <p style={{ color: 'var(--text-muted)' }}>
            Enterprise billing is invoiced annually or monthly. Priority response time SLAs range from 15 minutes (Critical Incidents) to 4 hours (General Enquiries).
          </p>
        </div>
      </Modal>

      {/* 3. Enterprise Support Modal & Ticket Dispatch */}
      <Modal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        title="24/7 Enterprise Support Portal"
        maxWidth="620px"
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button variant="primary" icon={Send} onClick={handleTicketSubmit}>Submit Priority Ticket</Button>
          </>
        }
      >
        <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Phone size={16} style={{ color: 'var(--primary)' }} />
            <span>Priority Hotline: <strong>+1 (800) 555-INVENTRA</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Mail size={16} style={{ color: 'var(--primary)' }} />
            <span>Email: <strong>enterprise-support@inventra.io</strong></span>
          </div>
        </div>

        <form onSubmit={handleTicketSubmit}>
          <div className="grid grid-cols-2">
            <Input
              label="Ticket Subject"
              value={ticketData.subject}
              onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g. Warehouse API Sync Delay"
              required
            />
            <Input
              label="Severity Level"
              type="select"
              value={ticketData.severity}
              onChange={(e) => setTicketData(prev => ({ ...prev, severity: e.target.value }))}
              options={[
                { label: '🟢 Low - General Inquiry', value: 'Low' },
                { label: '🔵 Medium - Feature / Minor Issue', value: 'Medium' },
                { label: '🟠 High - Operational Blocker', value: 'High' },
                { label: '🔴 Critical - System Down (15m SLA)', value: 'Critical' }
              ]}
            />
          </div>

          <Input
            label="Detailed Description of Issue"
            type="textarea"
            rows={4}
            value={ticketData.description}
            onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the issue, error messages, affected warehouse SKUs or API routes..."
            required
          />
        </form>
      </Modal>
    </>
  );
};
