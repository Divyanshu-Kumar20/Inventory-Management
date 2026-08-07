import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { AlertTriangle, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';

export const LowStockTable = ({ products, onRestockComplete }) => {
  const lowStockItems = products.filter(p => p.stock <= 10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(20);
  const toast = useToast();

  const handleRestock = () => {
    if (!selectedProduct) return;
    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        const newStock = p.stock + Number(restockQty);
        return {
          ...p,
          stock: newStock,
          status: newStock > 10 ? 'In Stock' : 'Low Stock'
        };
      }
      return p;
    });

    // Save products & log
    mockApi.saveProducts(updatedProducts);

    const logs = mockApi.getInventoryLogs();
    logs.unshift({
      id: `LOG-${Date.now()}`,
      product: selectedProduct.name,
      oldStock: selectedProduct.stock,
      newStock: selectedProduct.stock + Number(restockQty),
      change: `+${restockQty}`,
      reason: 'Quick Restock Action',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    mockApi.saveInventoryLogs(logs);

    toast.success(`Restocked ${restockQty} units for ${selectedProduct.name}`, 'Stock Replenished');
    setSelectedProduct(null);
    if (onRestockComplete) onRestockComplete();
  };

  return (
    <>
      <Card
        title="Low Stock Alert & Critical Inventory"
        action={
          <Badge variant="warning" icon={AlertTriangle}>
            {lowStockItems.length} items require attention
          </Badge>
        }
      >
        <div className="table-responsive" style={{ marginTop: '0.5rem' }}>
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
                lowStockItems.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}>
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
                        onClick={() => setSelectedProduct(p)}
                      >
                        Quick Restock
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                    All inventory levels are healthy!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Quick Restock: ${selectedProduct.name}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleRestock}>Confirm Restock</Button>
            </>
          }
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Current Stock: <strong>{selectedProduct.stock}</strong> units. Specify the quantity to add to inventory.
          </p>
          <Input
            label="Additional Quantity"
            type="number"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            min={1}
            required
          />
        </Modal>
      )}
    </>
  );
};
