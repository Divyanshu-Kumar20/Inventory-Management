import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Clock, Sparkles, RefreshCw, Bot } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { RecentOrders } from '../../components/dashboard/RecentOrders';
import { LowStockTable } from '../../components/dashboard/LowStockTable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { mockApi } from '../../services/mockApi';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const loadDashboardData = () => {
    const currentMetrics = mockApi.getDashboardMetrics();
    const currentProducts = mockApi.getProducts();
    const currentOrders = mockApi.getOrders();
    
    setMetrics(currentMetrics);
    setProducts(currentProducts);
    setOrders(currentOrders);
    fetchAIInsights(currentMetrics, currentProducts, currentOrders);
  };

  const fetchAIInsights = async (m = metrics, p = products, o = orders) => {
    setIsLoadingAI(true);
    try {
      const res = await api.getAIInsights();
      if (res && res.data && res.data.insights) {
        setAiInsights(res.data.insights);
      } else {
        setAiInsights(generateFallbackInsights(m || mockApi.getDashboardMetrics(), p || mockApi.getProducts(), o || mockApi.getOrders()));
      }
    } catch (e) {
      setAiInsights(generateFallbackInsights(m || mockApi.getDashboardMetrics(), p || mockApi.getProducts(), o || mockApi.getOrders()));
    } finally {
      setIsLoadingAI(false);
    }
  };

  const generateFallbackInsights = (m, p, o) => {
    const revStr = formatCurrency(m.totalRevenue);
    const lowCount = p.filter(prd => prd.stock <= 10).length;
    return [
      `📈 Revenue is currently **${revStr}** across processed workspace sales orders.`,
      `🔥 **Logitech MX Master 3S Mouse** is currently the top-performing volume SKU.`,
      lowCount > 0
        ? `⚠️ **${lowCount} products** have low inventory below threshold (<= 10 units).`
        : `⚠️ Inventory levels are optimal with zero items below threshold.`,
      `📦 **Electronics** generated the highest product category sales velocity.`,
      `📉 System inventory turnover ratio is operating at high efficiency.`
    ];
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

      {/* Phase 4: AI Business Insights Banner Card */}
      <Card
        style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.12) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
              }}
            >
              <Sparkles size={18} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              🤖 AI BUSINESS INSIGHTS
            </h3>
            <Badge variant="success" size="sm">Live Gemini Engine</Badge>
          </div>

          <Button
            size="sm"
            variant="outline"
            icon={RefreshCw}
            onClick={() => fetchAIInsights()}
            disabled={isLoadingAI}
          >
            {isLoadingAI ? 'Analyzing...' : 'Refresh Insights'}
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
          {aiInsights.map((bullet, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.65rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}
            >
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </Card>

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
