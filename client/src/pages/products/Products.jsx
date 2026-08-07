import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { mockApi } from '../../services/mockApi';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'Electronics',
    supplier: 'TechSource Global',
    price: '',
    stock: '',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=60'
  });

  const toast = useToast();

  const loadData = () => {
    setProducts(mockApi.getProducts());
    setCategories(mockApi.getCategories());
    setSuppliers(mockApi.getSuppliers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in required fields (Name, Price, Stock)');
      return;
    }

    const currentProducts = mockApi.getProducts();

    if (editingProduct) {
      const updated = currentProducts.map(p => {
        if (p.id === editingProduct.id) {
          const stockNum = Number(formData.stock);
          return {
            ...p,
            ...formData,
            price: Number(formData.price),
            stock: stockNum,
            status: stockNum === 0 ? 'Out of Stock' : stockNum <= 10 ? 'Low Stock' : 'In Stock'
          };
        }
        return p;
      });
      mockApi.saveProducts(updated);
      toast.success(`Updated ${formData.name}`, 'Product Saved');
    } else {
      const stockNum = Number(formData.stock);
      const newProduct = {
        id: `PRD-${Date.now().toString().slice(-4)}`,
        sku: formData.sku || `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        ...formData,
        price: Number(formData.price),
        stock: stockNum,
        status: stockNum === 0 ? 'Out of Stock' : stockNum <= 10 ? 'Low Stock' : 'In Stock'
      };
      currentProducts.unshift(newProduct);
      mockApi.saveProducts(currentProducts);
      toast.success(`Added new product: ${formData.name}`, 'Product Created');
    }

    closeModal();
    loadData();
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    const filtered = products.filter(p => p.id !== deletingProduct.id);
    mockApi.saveProducts(filtered);
    toast.success(`Product ${deletingProduct.name} deleted successfully`, 'Delete Success');
    setDeletingProduct(null);
    loadData();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      description: '',
      category: categories[0]?.name || 'Electronics',
      supplier: suppliers[0]?.name || 'TechSource Global',
      price: '',
      stock: '',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=60'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      category: product.category,
      supplier: product.supplier || suppliers[0]?.name,
      price: product.price,
      stock: product.stock,
      image: product.image
    });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  // Filtered dataset for Table
  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <img
            src={row.image}
            alt={row.name}
            style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
          />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.sku}</div>
          </div>
        </div>
      )
    },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => <span style={{ fontWeight: 600 }}>{formatCurrency(row.price)}</span>
    },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (row) => (
        <span style={{ fontWeight: 700, color: row.stock === 0 ? 'var(--danger)' : row.stock <= 10 ? 'var(--warning)' : 'var(--text-main)' }}>
          {row.stock} units
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'In Stock' ? 'success' :
            row.status === 'Low Stock' ? 'warning' : 'danger'
          }
        >
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <Button size="sm" variant="outline" icon={Edit} onClick={() => openEditModal(row)} />
          <Button size="sm" variant="outline" icon={Trash2} style={{ color: 'var(--danger)' }} onClick={() => setDeletingProduct(row)} />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-subtitle">Manage products, SKUs, inventory counts, and price structures.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredProducts}
        searchPlaceholder="Search product name or SKU..."
        exportFilename="inventra_products_catalog"
        filters={
          <>
            <select
              className="form-select"
              style={{ width: '150px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select
              className="form-select"
              style={{ width: '140px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </>
        }
      />

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveProduct}>Save Product</Button>
          </>
        }
      >
        <form onSubmit={handleSaveProduct}>
          <div className="grid grid-cols-2">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Logitech Wireless Mouse"
              required
            />
            <Input
              label="SKU Code"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="SKU-10293"
              required
            />
          </div>

          <Input
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detailed specifications and product overview..."
          />

          <div className="grid grid-cols-2">
            <Input
              label="Category"
              type="select"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categories.map(c => c.name)}
            />
            <Input
              label="Supplier"
              type="select"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              options={suppliers.map(s => s.name)}
            />
          </div>

          <div className="grid grid-cols-2">
            <Input
              label="Price (₹)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="99.99"
              step="0.01"
              required
            />
            <Input
              label="Initial Stock Level"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="50"
              required
            />
          </div>

          <Input
            label="Image URL Preview"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://..."
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <Modal
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          title="Delete Product"
          footer={
            <>
              <Button variant="outline" onClick={() => setDeletingProduct(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete Permanently</Button>
            </>
          }
        >
          <p style={{ color: 'var(--text-muted)' }}>
            Are you sure you want to delete <strong>{deletingProduct.name}</strong>? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};
