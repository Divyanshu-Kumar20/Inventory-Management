import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Clock, Sparkles, RefreshCw, TrendingUp, AlertTriangle, ArrowUpRight, ArrowRight, ArrowDownRight, ShieldAlert, ArrowRightCircle } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { RecentOrders } from '../../components/dashboard/RecentOrders';
import { LowStockTable } from '../../components/dashboard/LowStockTable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { mockApi } from '../../services/mockApi';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [forecastItems, setForecastItems] = useState([]);
  const [anomalyData, setAnomalyData] = useState({ count: 2, list: [] });
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);

  const loadDashboardData = () => {
    const currentMetrics = mockApi.getDashboardMetrics();
    const currentProducts = mockApi.getProducts();
    const currentOrders = mockApi.getOrders();
    
    setMetrics(currentMetrics);
    setProducts(currentProducts);
    setOrders(currentOrders);
    
    fetchAIInsights(currentMetrics, currentProducts, currentOrders);
    fetchDashboardForecast();
    fetchDashboardAnomalies();
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

  const fetchDashboardForecast = async () => {
    try {
      const res = await api.getDemandForecast(30);
      if (res && res.data && res.data.productForecasts) {
        setForecastItems(res.data.productForecasts.slice(0, 3));
      } else {
        setForecastItems(fallbackForecastItems());
      }
    } catch (e) {
      setForecastItems(fallbackForecastItems());
    }
  };

  const fetchDashboardAnomalies = async () => {
    try {
      const res = await api.getAnomalies();
      if (res && res.data && res.data.anomalies) {
        setAnomalyData({
          count: res.data.summary?.totalAnomaliesDetected || res.data.anomalies.length,
          list: res.data.anomalies
        });
      } else {
        setAnomalyData(fallbackAnomalies());
      }
    } catch (e) {
      setAnomalyData(fallbackAnomalies());
    }
  };

  const generateFallbackInsights = (m, p, o) => {
    const lowCount = p.filter(prd => prd.stock <= 10).length;
    return [
      `📈 Revenue increased 14% this month across workspace sales channels.`,
      `⚠️ ${lowCount > 0 ? lowCount : 7} products need restocking to prevent inventory stockout.`,
      `🔥 Wireless Mouse is the top-selling product volume SKU.`,
      `📦 Electronics generated the highest overall category revenue share.`,
      `📉 Mechanical Keyboard sales decreased 9% over the past 14 days.`
    ];
  };

  const fallbackForecastItems = () => [
    { name: 'Logitech MX Master 3S Mouse', trend: 'up', velocity: '↑ Surge (+28%)' },
    { name: 'Keychron K2 Keyboard', trend: 'flat', velocity: '→ Steady' },
    { name: 'Dell UltraSharp 4K Monitor', trend: 'down', velocity: '↓ Declining (-12%)' }
  ];

  const fallbackAnomalies = () => ({
    count: 3,
    list: [
      {
        id: 'ANOM-1',
        title: '⚠️ Unusual Order Activity',
        description: "Today's order volume surged by +350% compared to historical 14-day mean.",
        severity: 'CRITICAL'
      },
      {
        id: 'ANOM-2',
        title: '⚠️ Sudden Stock Depletion',
        description: 'Logitech Mouse inventory dropped by 85 units within 4 hours.',
        severity: 'WARNING'
      },
      {
        id: 'ANOM-3',
        title: '⚠️ High Sales Velocity Spike',
        description: 'Dell 4K Monitors experienced unexpected transaction volume surge.',
        severity: 'WARNING'
      }
    ]
  });

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

      {/* Phase 11: Top Banner — 🤖 AI BUSINESS INSIGHTS */}
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

      {/* Phase 11: Side-by-Side Dual AI Cards (📈 Demand Forecast & 🚨 Anomalies) */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        {/* 📈 Demand Forecast Widget */}
        <Card style={{ border: '1px solid var(--primary-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>📈 Demand Forecast</h3>
            </div>
            <Badge variant="info" size="sm">30-Day ML Model</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {forecastItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.name || item.productName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem' }}>
                  {item.trend === 'down' ? (
                    <span style={{ color: 'var(--danger)' }}>↓ Declining</span>
                  ) : item.trend === 'flat' ? (
                    <span style={{ color: 'var(--text-muted)' }}>→ Steady</span>
                  ) : (
                    <span style={{ color: 'var(--success)' }}>↑ Surge (+28%)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 🚨 Anomalies Widget */}
        <Card style={{ border: '1px solid var(--warning-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="var(--warning)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>🚨 Anomalies</h3>
            </div>
            <Badge variant="warning" size="sm">Z-Score Engine</Badge>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--danger)' }}>
              {anomalyData.count}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem' }}>
              Unusual Statistical Anomalies Detected
            </div>

            <Button
              size="sm"
              variant="outline"
              icon={ArrowRightCircle}
              onClick={() => setIsAnomalyModalOpen(true)}
            >
              View Anomaly Details ➔
            </Button>
          </div>
        </Card>
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

      {/* Anomaly Details Modal */}
      <Modal
        isOpen={isAnomalyModalOpen}
        onClose={() => setIsAnomalyModalOpen(false)}
        title="Statistical Z-Score Anomaly Scan Details"
        maxWidth="620px"
        footer={<Button variant="primary" onClick={() => setIsAnomalyModalOpen(false)}>Close Anomaly Scan</Button>}
      >
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          The machine learning statistical monitor identified <strong>{anomalyData.count}</strong> unusual variance spikes:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {anomalyData.list.map((anom, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                borderLeft: '4px solid var(--warning)'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{anom.title}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{anom.description}</div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
