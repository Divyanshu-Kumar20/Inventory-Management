import React, { useState, useEffect } from 'react';
import { Truck, Plus, Mail, Phone, MapPin, Star, Package } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { mockApi } from '../../services/mockApi';
import { useToast } from '../../context/ToastContext';

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const toast = useToast();

  const loadSuppliers = () => {
    setSuppliers(mockApi.getSuppliers());
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSaveSupplier = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Supplier Company Name and Email are required');
      return;
    }

    const current = mockApi.getSuppliers();
    const newSup = {
      id: `SUP-${Date.now().toString().slice(-3)}`,
      ...formData,
      productsSupplied: 1,
      rating: 4.8
    };

    current.unshift(newSup);
    mockApi.saveSuppliers(current);
    toast.success(`Registered vendor ${formData.name}`);
    setIsAddModalOpen(false);
    loadSuppliers();
  };

  const columns = [
    {
      header: 'Supplier Vendor',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Truck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact: {row.contactPerson}</div>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    {
      header: 'Products',
      accessor: 'productsSupplied',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.productsSupplied} catalog items</span>
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedSupplier(row)}>
          Vendor Details
        </Button>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Vendor & Supplier Management</h1>
          <p className="page-subtitle">Track wholesale suppliers, purchase order contacts, and lead times.</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
            setIsAddModalOpen(true);
          }}
        >
          Add Supplier
        </Button>
      </div>

      <Table
        columns={columns}
        data={suppliers}
        searchPlaceholder="Search vendor name or contact person..."
        exportFilename="inventra_suppliers"
      />

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Vendor / Supplier"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveSupplier}>Save Supplier</Button>
          </>
        }
      >
        <form onSubmit={handleSaveSupplier}>
          <Input
            label="Company / Vendor Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. TechSource Wholesale Ltd"
            required
          />
          <Input
            label="Primary Contact Person"
            value={formData.contactPerson}
            onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
            placeholder="Alex Rivera"
          />
          <div className="grid grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="orders@vendor.com"
              required
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (800) 555-0199"
            />
          </div>
          <Input
            label="Warehouse / Facility Address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="450 Logistics Way, San Jose, CA"
          />
        </form>
      </Modal>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <Modal
          isOpen={!!selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          title={`Supplier Details: ${selectedSupplier.name}`}
          maxWidth="600px"
          footer={<Button variant="primary" onClick={() => setSelectedSupplier(null)}>Close</Button>}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedSupplier.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contact: {selectedSupplier.contactPerson}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--text-muted)' }} />
              <span>{selectedSupplier.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--text-muted)' }} />
              <span>{selectedSupplier.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
              <span>{selectedSupplier.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Package size={18} style={{ color: 'var(--text-muted)' }} />
              <span>{selectedSupplier.productsSupplied} products linked in active catalog</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
