import React, { useState, useEffect } from 'react';
import { UserPlus, User, Mail, Phone, MapPin, Trash2, Edit } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { mockApi } from '../../services/mockApi';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  const toast = useToast();

  const loadCustomers = () => {
    setCustomers(mockApi.getCustomers());
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Customer Name and Email are required');
      return;
    }

    const current = mockApi.getCustomers();
    const newCust = {
      id: `CUST-${Date.now().toString().slice(-3)}`,
      ...formData,
      ordersCount: 0,
      totalSpent: 0,
      status: 'Active'
    };

    current.unshift(newCust);
    mockApi.saveCustomers(current);
    toast.success(`Customer ${formData.name} registered successfully`);
    setIsAddModalOpen(false);
    loadCustomers();
  };

  const handleDeleteCustomer = () => {
    if (!deletingCustomer) return;
    const current = mockApi.getCustomers();
    const filtered = current.filter(c => c.id !== deletingCustomer.id);
    mockApi.saveCustomers(filtered);

    toast.success(`Customer record for ${deletingCustomer.name} has been permanently removed`, 'Customer Removed');
    setDeletingCustomer(null);
    if (selectedCustomer && selectedCustomer.id === deletingCustomer.id) {
      setSelectedCustomer(null);
    }
    loadCustomers();
  };

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="avatar" style={{ fontSize: '0.8rem' }}>
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.city}</div>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Orders',
      accessor: 'ordersCount',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.ordersCount} orders</span>
    },
    {
      header: 'Total Spent',
      accessor: 'totalSpent',
      render: (row) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(row.totalSpent)}</span>
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <Button size="sm" variant="outline" icon={User} onClick={() => setSelectedCustomer(row)}>
            Profile
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={Trash2}
            style={{ color: 'var(--danger)' }}
            onClick={() => setDeletingCustomer(row)}
            title="Remove Customer Record"
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Relationship Directory</h1>
          <p className="page-subtitle">Manage customer profiles, contact info, lifetime order history, and account activity.</p>
        </div>
        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => {
            setFormData({ name: '', email: '', phone: '', city: '' });
            setIsAddModalOpen(true);
          }}
        >
          Add Customer
        </Button>
      </div>

      <Table
        columns={columns}
        data={customers}
        searchPlaceholder="Search customer by name, email, or city..."
        exportFilename="inventra_customers"
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Customer"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveCustomer}>Save Customer</Button>
          </>
        }
      >
        <form onSubmit={handleSaveCustomer}>
          <Input
            label="Full Name / Organization"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Apex Corp / Jane Doe"
            required
          />
          <div className="grid grid-cols-2">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="contact@company.com"
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 98765 43210"
            />
          </div>
          <Input
            label="City & State / Location"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Mumbai, MH"
          />
        </form>
      </Modal>

      {/* Customer Profile View Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile: ${selectedCustomer.name}`}
          maxWidth="600px"
          footer={
            <>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => {
                  setDeletingCustomer(selectedCustomer);
                }}
              >
                Remove Customer
              </Button>
              <Button variant="primary" onClick={() => setSelectedCustomer(null)}>Close</Button>
            </>
          }
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="avatar" style={{ width: 64, height: 64, fontSize: '1.25rem' }}>
              {selectedCustomer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedCustomer.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {selectedCustomer.id}</p>
              <Badge variant="success" style={{ marginTop: '0.35rem' }}>{selectedCustomer.status} Client</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Purchases</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedCustomer.ordersCount} Orders</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lifetime Account Value</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(selectedCustomer.totalSpent)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <span>{selectedCustomer.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--text-muted)' }} />
              <span>{selectedCustomer.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
              <span>{selectedCustomer.city}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Customer Modal */}
      {deletingCustomer && (
        <Modal
          isOpen={!!deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          title="Remove Customer Record"
          footer={
            <>
              <Button variant="outline" onClick={() => setDeletingCustomer(null)}>Cancel</Button>
              <Button variant="danger" icon={Trash2} onClick={handleDeleteCustomer}>Confirm Removal</Button>
            </>
          }
        >
          <p style={{ color: 'var(--text-muted)' }}>
            Are you sure you want to permanently remove customer record <strong>{deletingCustomer.name}</strong> ({deletingCustomer.email}) from your directory?
          </p>
        </Modal>
      )}
    </div>
  );
};
