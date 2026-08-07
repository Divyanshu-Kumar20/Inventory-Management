import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { mockApi } from '../../services/mockApi';
import { useToast } from '../../context/ToastContext';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const toast = useToast();

  const loadCategories = () => {
    setCategories(mockApi.getCategories());
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category Name is required');
      return;
    }

    const current = mockApi.getCategories();
    if (editingCategory) {
      const updated = current.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c);
      mockApi.saveCategories(updated);
      toast.success(`Updated category ${formData.name}`);
    } else {
      const newCat = {
        id: `CAT-${Date.now().toString().slice(-4)}`,
        name: formData.name,
        description: formData.description,
        productsCount: 0,
        icon: 'Layers'
      };
      current.push(newCat);
      mockApi.saveCategories(current);
      toast.success(`Created category ${formData.name}`);
    }

    setIsModalOpen(false);
    loadCategories();
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    const filtered = categories.filter(c => c.id !== deletingCategory.id);
    mockApi.saveCategories(filtered);
    toast.success(`Deleted category ${deletingCategory.name}`);
    setDeletingCategory(null);
    loadCategories();
  };

  const columns = [
    {
      header: 'Category Name',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Layers size={18} />
          </div>
          <span style={{ fontWeight: 700 }}>{row.name}</span>
        </div>
      )
    },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Products Count',
      accessor: 'productsCount',
      render: (row) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{row.productsCount} items</span>
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <Button
            size="sm"
            variant="outline"
            icon={Edit}
            onClick={() => {
              setEditingCategory(row);
              setFormData({ name: row.name, description: row.description || '' });
              setIsModalOpen(true);
            }}
          />
          <Button
            size="sm"
            variant="outline"
            icon={Trash2}
            style={{ color: 'var(--danger)' }}
            onClick={() => setDeletingCategory(row)}
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Category Management</h1>
          <p className="page-subtitle">Organize products into structured inventory departments and categories.</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            setIsModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        data={categories}
        searchPlaceholder="Search category name..."
        exportFilename="inventra_categories"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save Category</Button>
          </>
        }
      >
        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Office Equipment"
          required
        />
        <Input
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of items under this category..."
        />
      </Modal>

      {deletingCategory && (
        <Modal
          isOpen={!!deletingCategory}
          onClose={() => setDeletingCategory(null)}
          title="Delete Category"
          footer={
            <>
              <Button variant="outline" onClick={() => setDeletingCategory(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete Category</Button>
            </>
          }
        >
          <p style={{ color: 'var(--text-muted)' }}>
            Are you sure you want to remove <strong>{deletingCategory.name}</strong>?
          </p>
        </Modal>
      )}
    </div>
  );
};
