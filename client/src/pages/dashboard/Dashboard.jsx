import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { LowStockTable } from '../../components/dashboard/LowStockTable';
import { TopCategoriesWidget } from '../../components/dashboard/TopCategoriesWidget';
import { Badge } from '../../components/common/Badge';
import { mockApi } from '../../services/mockApi';
import { formatCurrency } from '../../utils/formatters';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadDashboardData = () => {
    const currentMetrics = mockApi.getDashboardMetrics();
    const currentProducts = mockApi.getProducts();
    const currentOrders = mockApi.getOrders();
    
    setMetrics(currentMetrics);
    setProducts(currentProducts);
    setOrders(currentOrders);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (!metrics) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 900 }}>Retail Inventory & SaaS Dashboard</h1>
          <p className="page-subtitle">Real-time inventory metrics, financial performance, and operational management.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Badge variant="info" icon={Clock}>System Sync: Live</Badge>
        </div>
      </div>

      {/* Hero High-Contrast Executive Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
        <StatsCard
          title="Total Orders"
          value={metrics.totalOrders > 0 ? formatCurrency(metrics.totalRevenue) : '₹0'}
          growth={metrics.totalOrders > 0 ? '10%' : '0%'}
          type="dark"
          subtext="15.650 last month"
        />

        <StatsCard
          title="Total Customers"
          value={metrics.totalCustomers > 0 ? metrics.totalCustomers.toLocaleString() : '0'}
          growth={metrics.totalCustomers > 0 ? '+79%' : '0%'}
          type="orange"
          subtext="683 accounts active"
        />

        <StatsCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          growth={metrics.totalRevenue > 0 ? '+21%' : '0%'}
          type="light"
          subtext="₹73 925 last month"
        />
      </div>

      {/* Main 2-Column Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left Column (Main Charts & Tables) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Stacked Income & Profit Bar Chart */}
          <SalesChart />

          {/* Product Sales & Inventory Table */}
          <LowStockTable products={products} onRestockComplete={loadDashboardData} />
        </div>

        {/* Right Column (Top Categories & Regional Sales Widgets) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TopCategoriesWidget />
        </div>
      </div>
    </div>
  );
};
