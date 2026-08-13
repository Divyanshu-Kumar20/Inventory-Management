import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { AlertTriangle, Plus, ArrowUpRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { mockApi } from '../../services/mockApi';
import { formatCurrency } from '../../utils/formatters';

export const LowStockTable = ({ products, onRestockComplete }) => {
  const displayProducts = products && products.length > 0 ? products.slice(0, 5) : [];
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

  const getDiscountTag = (idx) => {
    const discounts = ['5%', '8%', '15%', '10%', '12%'];
    return discounts[idx % discounts.length];
  };

  const getItemsSold = (idx) => {
    const sales = [294, 215, 142, 98, 69];
    return sales[idx % sales.length];
  };

  return (
    <>
      <Card style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Product Sales & Inventory</h3>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Top inventory items, pricing discounts, and volume metrics</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {lowStockItems.length > 0 && (
              <Badge variant="warning" icon={AlertTriangle}>
                {lowStockItems.length} Low Stock
              </Badge>
            )}
            <ArrowUpRight size={18} color="var(--text-muted)" />
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Items Sold</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.length > 0 ? (
                displayProducts.map((p, idx) => (
                  <tr key={p.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-tertiary)',
                          backgroundImage: p.image ? `url(${p.image})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          flexShrink: 0
                        }}
                      />
                      <span>{p.name}</span>
                    </td>
                    <td style={{ fontWeight: 800, color: p.stock === 0 ? 'var(--danger)' : p.stock <= 10 ? 'var(--warning)' : 'var(--text-main)' }}>
                      {p.stock}
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(p.price)}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: '#ECFDF5',
                          color: '#047857',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px'
                        }}
                      >
                        {getDiscountTag(idx)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800 }}>{getItemsSold(idx)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Plus}
                        onClick={() => setSelectedProduct(p)}
                      >
                        Restock
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                    No products registered in this workspace yet.
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
