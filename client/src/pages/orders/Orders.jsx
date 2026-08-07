import React, { useState, useEffect } from 'react';
import { Eye, FileText, CheckCircle2, Download, Printer } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { mockApi } from '../../services/mockApi';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();

  const loadOrders = () => {
    setOrders(mockApi.getOrders());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = (newStatus) => {
    if (!selectedOrder) return;
    const current = mockApi.getOrders();
    const updated = current.map(o => o.id === selectedOrder.id ? { ...o, fulfillmentStatus: newStatus } : o);
    mockApi.saveOrders(updated);
    setSelectedOrder(prev => ({ ...prev, fulfillmentStatus: newStatus }));
    toast.success(`Updated order ${selectedOrder.id} status to ${newStatus}`, 'Order Status Updated');
    loadOrders();
  };

  const handlePrintInvoice = () => {
    toast.success(`Generated Official Tax Invoice PDF for ${selectedOrder.id}`, 'Invoice Ready');
    window.print();
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'All' && o.fulfillmentStatus !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (row) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{row.id}</span>
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customer}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.customerEmail}</div>
        </div>
      )
    },
    { header: 'Date', accessor: 'date', render: (row) => formatDate(row.date) },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => <span style={{ fontWeight: 700 }}>{formatCurrency(row.amount)}</span>
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      render: (row) => (
        <Badge variant={row.paymentStatus === 'Paid' ? 'success' : row.paymentStatus === 'Pending' ? 'warning' : 'danger'}>
          {row.paymentStatus} ({row.paymentMethod})
        </Badge>
      )
    },
    {
      header: 'Fulfillment',
      accessor: 'fulfillmentStatus',
      render: (row) => (
        <Badge
          variant={
            row.fulfillmentStatus === 'Completed' ? 'success' :
            row.fulfillmentStatus === 'Processing' ? 'info' :
            row.fulfillmentStatus === 'Shipped' ? 'info' :
            row.fulfillmentStatus === 'Pending' ? 'warning' : 'danger'
          }
        >
          {row.fulfillmentStatus}
        </Badge>
      )
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <Button size="sm" variant="outline" icon={Eye} onClick={() => setSelectedOrder(row)}>
          Details
        </Button>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Orders</h1>
          <p className="page-subtitle">Track customer purchase orders, payment verification, and dispatch fulfillment status.</p>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Search order ID or customer name..."
        exportFilename="inventra_sales_orders"
        filters={
          <select
            className="form-select"
            style={{ width: '160px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        }
      />

      {/* Order Details & Invoice Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder.id}`}
          maxWidth="680px"
          footer={
            <>
              <Button variant="outline" icon={Printer} onClick={handlePrintInvoice}>
                Print Invoice
              </Button>
              <Button variant="primary" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>CUSTOMER INFO</h4>
              <p style={{ fontWeight: 700, fontSize: '1rem', margin: '0.2rem 0' }}>{selectedOrder.customer}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedOrder.customerEmail}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ORDER DATE</h4>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0.2rem 0' }}>{formatDate(selectedOrder.date)}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>FULFILLMENT STATUS</h4>
              <select
                className="form-select"
                style={{ marginTop: '0.2rem', padding: '0.25rem 0.5rem', fontWeight: 700 }}
                value={selectedOrder.fulfillmentStatus}
                onChange={(e) => handleUpdateStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Purchased Items</h4>
          <div className="table-responsive" style={{ marginBottom: '1.25rem' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Item</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td style={{ fontWeight: 700 }}>x{item.quantity}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: 'flex',
              justify: 'flex-end',
              gap: '1.5rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-tertiary)',
              fontWeight: 700
            }}
          >
            <span>Total Amount Paid:</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{formatCurrency(selectedOrder.amount)}</span>
          </div>
        </Modal>
      )}
    </div>
  );
};
