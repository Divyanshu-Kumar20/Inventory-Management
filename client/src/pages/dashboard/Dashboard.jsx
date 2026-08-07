import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users, AlertTriangle, Clock } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { RecentOrders } from '../../components/dashboard/RecentOrders';
import { LowStockTable } from '../../components/dashboard/LowStockTable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { mockApi } from '../../services/mockApi';
import { formatCurrency } from '../../utils/formatters';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadDashboardData = () => {
    setMetrics(mockApi.getDashboardMetrics());
    setProducts(mockApi.getProducts());
    setOrders(mockApi.getOrders());
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (!metrics) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive SaaS Dashboard</h1>
          <p className="page-subtitle">Real-time inventory metrics, financial metrics, and operational performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Badge variant="info" icon={Clock}>System Sync: Live</Badge>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <StatsCard
          title="Total Products"
          value={metrics.totalProducts}
          growth={metrics.productsGrowth}
          icon={Package}
          color="#2563EB"
          isPositive={true}
        />
        <StatsCard
          title="Total Orders"
          value={metrics.totalOrders}
          growth={metrics.ordersGrowth}
          icon={ShoppingCart}
          color="#7C3AED"
          isPositive={true}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          growth={metrics.revenueGrowth}
          icon={DollarSign}
          color="#22C55E"
          isPositive={true}
        />
        <StatsCard
          title="Total Customers"
          value={metrics.totalCustomers}
          growth={metrics.customersGrowth}
          icon={Users}
          color="#0EA5E9"
          isPositive={true}
        />
      </div>

      {/* Analytics Chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SalesChart />
      </div>

      {/* Recent Orders & Low Stock Tables */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <RecentOrders orders={orders} />
        <LowStockTable products={products} onRestockComplete={loadDashboardData} />
      </div>
    </div>
  );
};
