import React, { useState, useEffect } from 'react';
import { Boxes, ArrowUpRight, ArrowDownRight, History, SlidersHorizontal, AlertTriangle, Plus, Minus, PackageCheck, FileSpreadsheet, Eye } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { mockApi } from '../../services/mockApi';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'logs'
  
  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('increase'); // 'increase' | 'reduce'
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('Supplier Restock');

  // KPI Breakdown Modals
  const [activeKpiModal, setActiveKpiModal] = useState(null); // 'units' | 'lowStock' | 'logsModal' | null
  
  // Quick Restock inside Low Stock Modal
  const [quickRestockItem, setQuickRestockItem] = useState(null);
  const [quickRestockQty, setQuickRestockQty] = useState(20);

  const toast = useToast();

  const loadData = () => {
    setProducts(mockApi.getProducts());
    setLogs(mockApi.getInventoryLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockAdjustment = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || Number(quantity) <= 0) {
      toast.error('Please select a product and valid adjustment quantity');
      return;
    }

    const targetProduct = products.find(p => p.id === selectedProduct || p.name === selectedProduct);
    if (!targetProduct) return;

    const oldStock = targetProduct.stock;
    const changeQty = Number(quantity);
    const newStock = adjustmentType === 'increase' ? oldStock + changeQty : Math.max(0, oldStock - changeQty);

    // Save updated product stock
    const updatedProducts = products.map(p => {
      if (p.id === targetProduct.id) {
        return {
          ...p,
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock <= 10 ? 'Low Stock' : 'In Stock'
        };
      }
      return p;
    });
    mockApi.saveProducts(updatedProducts);

    // Create Audit Log entry
    const newLog = {
      id: `LOG-${Date.now()}`,
      product: targetProduct.name,
      oldStock,
      newStock,
      change: `${adjustmentType === 'increase' ? '+' : '-'}${changeQty}`,
      reason: `${reason} (${adjustmentType.toUpperCase()})`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const currentLogs = mockApi.getInventoryLogs();
    currentLogs.unshift(newLog);
    mockApi.saveInventoryLogs(currentLogs);

    toast.success(
      `Adjusted stock for ${targetProduct.name} from ${oldStock} to ${newStock}`,
      'Inventory Adjusted'
    );

    setIsAdjustModalOpen(false);
    loadData();
  };

  const handleQuickRestockSubmit = (e) => {
    e.preventDefault();
    if (!quickRestockItem) return;
    const qty = Number(quickRestockQty);
    const updatedProducts = products.map(p => {
      if (p.id === quickRestockItem.id) {
        const newStock = p.stock + qty;
        return {
          ...p,
          stock: newStock,
          status: newStock > 10 ? 'In Stock' : 'Low Stock'
        };
      }
      return p;
    });
    mockApi.saveProducts(updatedProducts);

    const currentLogs = mockApi.getInventoryLogs();
    currentLogs.unshift({
      id: `LOG-${Date.now()}`,
      product: quickRestockItem.name,
      oldStock: quickRestockItem.stock,
      newStock: quickRestockItem.stock + qty,
      change: `+${qty}`,
      reason: 'Quick Restock Action',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    mockApi.saveInventoryLogs(currentLogs);

    toast.success(`Restocked ${qty} units for ${quickRestockItem.name}`, 'Stock Replenished');
    setQuickRestockItem(null);
    loadData();
  };

  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalStockValuation = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const lowStockItems = products.filter(p => p.stock <= 10);

  const currentStockColumns = [
    { header: 'Product ID / SKU', accessor: 'sku', render: (row) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{row.sku}</span> },
    { header: 'Product Name', accessor: 'name', render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Available Stock',
      accessor: 'stock',
      render: (row) => (
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: row.stock === 0 ? 'var(--danger)' : row.stock <= 10 ? 'var(--warning)' : 'var(--text-main)' }}>
          {row.stock} units
        </span>
      )
    },
    {
      header: 'Stock Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'In Stock' ? 'success' : row.status === 'Low Stock' ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      )
    }
  ];

  const logColumns = [
    { header: 'Log ID', accessor: 'id', render: (row) => <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.id}</span> },
    { header: 'Product Item', accessor: 'product', render: (row) => <span style={{ fontWeight: 700 }}>{row.product}</span> },
    { header: 'Previous Stock', accessor: 'oldStock' },
    { header: 'New Stock', accessor: 'newStock', render: (row) => <span style={{ fontWeight: 700 }}>{row.newStock}</span> },
    {
      header: 'Adjustment',
      accessor: 'change',
      render: (row) => (
        <Badge variant={row.change.startsWith('+') ? 'success' : 'danger'}>
          {row.change}
        </Badge>
      )
    },
    { header: 'Adjustment Reason', accessor: 'reason' },
    { header: 'Timestamp', accessor: 'date' }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Warehouse Inventory Control</h1>
          <p className="page-subtitle">Monitor stock movements, execute inventory adjustments, and view audit trail logs.</p>
        </div>
        <Button
          variant="primary"
          icon={SlidersHorizontal}
          onClick={() => {
            setSelectedProduct(products[0]?.id || '');
            setQuantity(10);
            setIsAdjustModalOpen(true);
          }}
        >
          Stock Adjustment
        </Button>
      </div>

      {/* Interactive KPI Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
        <Card
          className="clickable"
          style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid var(--card-border)' }}
          onClick={() => {
            setActiveKpiModal('units');
            toast.info('Viewing total warehoused stock breakdown');
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Warehoused Units</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>Click for Details ➔</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalStockUnits.toLocaleString()} units</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Valuation: <strong style={{ color: 'var(--success)' }}>{formatCurrency(totalStockValuation)}</strong>
          </div>
        </Card>

        <Card
          className="clickable"
          style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid var(--warning-bg)' }}
          onClick={() => {
            setActiveKpiModal('lowStock');
            toast.warning(`Viewing ${lowStockItems.length} low stock alerts`);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Low Stock Threshold Alerts</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 600 }}>Click for Details ➔</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--warning)' }}>{lowStockItems.length} items</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Action required: <strong style={{ color: 'var(--danger)' }}>{products.filter(p => p.stock === 0).length} out of stock</strong>
          </div>
        </Card>

        <Card
          className="clickable"
          style={{ cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid var(--border-color)' }}
          onClick={() => {
            setActiveKpiModal('logsModal');
            setActiveTab('logs');
            toast.info('Viewing audit logs history');
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Inventory Audit Logs</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>Click for Details ➔</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--primary)' }}>{logs.length} logged events</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Latest change: <strong>{logs[0]?.date || 'Today'}</strong>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <Button
          variant={activeTab === 'current' ? 'primary' : 'outline'}
          size="sm"
          icon={Boxes}
          onClick={() => setActiveTab('current')}
        >
          Current Stock Levels ({products.length} Items)
        </Button>
        <Button
          variant={activeTab === 'logs' ? 'primary' : 'outline'}
          size="sm"
          icon={History}
          onClick={() => setActiveTab('logs')}
        >
          Inventory Adjustment Logs ({logs.length} Events)
        </Button>
      </div>

      {activeTab === 'current' ? (
        <Table
          columns={currentStockColumns}
          data={products}
          searchPlaceholder="Filter stock by SKU or name..."
          exportFilename="inventra_current_stock"
        />
      ) : (
        <Table
          columns={logColumns}
          data={logs}
          searchPlaceholder="Filter audit logs..."
          exportFilename="inventra_inventory_logs"
        />
      )}

      {/* 1. Modal for "Total Warehoused Units" details */}
      <Modal
        isOpen={activeKpiModal === 'units'}
        onClose={() => setActiveKpiModal(null)}
        title="Total Warehoused Stock Breakdown"
        maxWidth="680px"
        footer={<Button variant="primary" onClick={() => setActiveKpiModal(null)}>Close Overview</Button>}
      >
        <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total SKUs Warehoused</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{products.length} Products</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Physical Units</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{totalStockUnits.toLocaleString()} Units</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Inventory Valuation</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{formatCurrency(totalStockValuation)}</div>
          </div>
        </div>

        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Warehoused Items Summary</h4>
        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Unit Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem' }}>{p.sku}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td style={{ fontWeight: 800 }}>{p.stock}</td>
                  <td>{formatCurrency(p.price)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(p.stock * p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* 2. Modal for "Low Stock Threshold Alerts" details */}
      <Modal
        isOpen={activeKpiModal === 'lowStock'}
        onClose={() => setActiveKpiModal(null)}
        title="Low Stock & Out of Stock Threshold Alerts"
        maxWidth="680px"
        footer={<Button variant="primary" onClick={() => setActiveKpiModal(null)}>Close Alert View</Button>}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          The following <strong>{lowStockItems.length}</strong> items have fallen below the minimum safety threshold (10 units) and require restocking:
        </p>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.length > 0 ? (
                lowStockItems.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td style={{ fontWeight: 800, color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}>
                      {p.stock} units
                    </td>
                    <td>
                      <Badge variant={p.stock === 0 ? 'danger' : 'warning'}>
                        {p.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Plus}
                        onClick={() => {
                          setQuickRestockItem(p);
                          setQuickRestockQty(20);
                        }}
                      >
                        Restock Now
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                    No low stock items! All inventory levels are healthy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* 3. Modal for "Inventory Audit Logs" details */}
      <Modal
        isOpen={activeKpiModal === 'logsModal'}
        onClose={() => setActiveKpiModal(null)}
        title="Inventory Audit Trail & Event Logs"
        maxWidth="680px"
        footer={
          <Button
            variant="primary"
            onClick={() => {
              setActiveKpiModal(null);
              setActiveTab('logs');
            }}
          >
            Open Full Logs Table
          </Button>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Historical record of <strong>{logs.length}</strong> stock adjustment events, restock fulfillments, and audit actions:
        </p>

        <div className="table-responsive" style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Product</th>
                <th>Previous ➔ New</th>
                <th>Change</th>
                <th>Reason</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.id}</td>
                  <td style={{ fontWeight: 600 }}>{log.product}</td>
                  <td>{log.oldStock} ➔ <strong>{log.newStock}</strong></td>
                  <td>
                    <Badge variant={log.change.startsWith('+') ? 'success' : 'danger'}>
                      {log.change}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{log.reason}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Quick Restock Sub-Modal */}
      {quickRestockItem && (
        <Modal
          isOpen={!!quickRestockItem}
          onClose={() => setQuickRestockItem(null)}
          title={`Quick Restock: ${quickRestockItem.name}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setQuickRestockItem(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleQuickRestockSubmit}>Confirm Restock</Button>
            </>
          }
        >
          <form onSubmit={handleQuickRestockSubmit}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Current Stock: <strong>{quickRestockItem.stock}</strong> units. Enter quantity to add.
            </p>
            <Input
              label="Quantity to Add"
              type="number"
              value={quickRestockQty}
              onChange={(e) => setQuickRestockQty(e.target.value)}
              min={1}
              required
            />
          </form>
        </Modal>
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Execute Inventory Adjustment"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleStockAdjustment}>Apply Stock Adjustment</Button>
          </>
        }
      >
        <form onSubmit={handleStockAdjustment}>
          <Input
            label="Select Product Item"
            type="select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            options={products.map(p => ({ label: `${p.name} (Current: ${p.stock} units)`, value: p.id }))}
          />

          <div className="grid grid-cols-2">
            <Input
              label="Action Type"
              type="select"
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              options={[
                { label: '+ Increase Stock (Restock / Inbound)', value: 'increase' },
                { label: '- Reduce Stock (Damaged / Outbound / Audit)', value: 'reduce' }
              ]}
            />
            <Input
              label="Quantity to Adjust"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
              required
            />
          </div>

          <Input
            label="Audit Adjustment Reason"
            type="select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={[
              'Supplier Purchase Order Restock',
              'Damaged / Defective Stock Removal',
              'Customer Return Inventory Intake',
              'Physical Inventory Audit Reconciliation',
              'Showroom Sample Transfer'
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
