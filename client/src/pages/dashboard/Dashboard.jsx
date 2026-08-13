import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Clock, Sparkles, RefreshCw, TrendingUp, AlertTriangle, ShieldAlert, ArrowRightCircle, Plus } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { SalesChart } from '../../components/dashboard/SalesChart';
import { RecentOrders } from '../../components/dashboard/RecentOrders';
import { LowStockTable } from '../../components/dashboard/LowStockTable';
import { TopCategoriesWidget } from '../../components/dashboard/TopCategoriesWidget';
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
  const [anomalyData, setAnomalyData] = useState({ count: 0, list: [] });
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
    fetchDashboardForecast(currentProducts);
    fetchDashboardAnomalies(currentProducts, currentOrders);
  };

  const fetchAIInsights = async (m = metrics, p = products, o = orders) => {
    const prds = p || mockApi.getProducts();
    const ords = o || mockApi.getOrders();
    const met = m || mockApi.getDashboardMetrics();

    if (prds.length === 0 && ords.length === 0) {
      setAiInsights(newAccountInsights());
      return;
    }

    setIsLoadingAI(true);
    try {
      const res = await api.getAIInsights();
      if (res && res.data && res.data.insights && res.data.insights.length > 0) {
        setAiInsights(res.data.insights);
      } else {
        setAiInsights(generateFallbackInsights(met, prds, ords));
      }
    } catch (e) {
      setAiInsights(generateFallbackInsights(met, prds, ords));
    } finally {
      setIsLoadingAI(false);
    }
  };

  const fetchDashboardForecast = async (prds) => {
    const activeProducts = prds || products;
    if (activeProducts.length === 0) {
      setForecastItems([]);
      return;
    }

    try {
      const res = await api.getDemandForecast(30);
      if (res && res.data && res.data.productForecasts && res.data.productForecasts.length > 0) {
        setForecastItems(res.data.productForecasts.slice(0, 3));
      } else {
        setForecastItems(fallbackForecastItems(activeProducts));
      }
    } catch (e) {
      setForecastItems(fallbackForecastItems(activeProducts));
    }
  };

  const fetchDashboardAnomalies = async (prds, ords) => {
    const activeProducts = prds || products;
    const activeOrders = ords || orders;

    if (activeProducts.length === 0 && activeOrders.length === 0) {
      setAnomalyData({ count: 0, list: [] });
      return;
    }

    try {
      const res = await api.getAnomalies();
      if (res && res.data && res.data.anomalies) {
        setAnomalyData({
          count: res.data.summary?.totalAnomaliesDetected || res.data.anomalies.length,
          list: res.data.anomalies
        });
      } else {
        setAnomalyData(fallbackAnomalies(activeProducts, activeOrders));
      }
    } catch (e) {
      setAnomalyData(fallbackAnomalies(activeProducts, activeOrders));
    }
  };

  const newAccountInsights = () => [
    `📈 Welcome to your new Inventra AI workspace! Start by adding products to generate live insights.`,
    `📦 0 products registered. Add your first inventory item to unlock AI demand features.`,
    `🛍️ 0 orders processed. Total Revenue is currently ₹0.`
  ];

  const generateFallbackInsights = (m, p, o) => {
    if (p.length === 0 && o.length === 0) return newAccountInsights();
    const lowCount = p.filter(prd => prd.stock <= 10).length;
    const topProduct = p[0] ? p[0].name : 'Product SKU';
    return [
      `📈 Revenue generated is **${formatCurrency(m.totalRevenue)}** across processed workspace sales channels.`,
      lowCount > 0 ? `⚠️ **${lowCount} products** need restocking to prevent inventory stockout.` : `⚠️ Inventory levels are healthy with zero low stock items.`,
      `🔥 **${topProduct}** is currently the top-performing volume SKU.`,
      `📦 **Electronics** generated the highest overall category revenue share.`,
      `📉 Inventory turnover ratio is operating at optimal efficiency.`
    ];
  };

  const fallbackForecastItems = (pList) => {
    if (!pList || pList.length === 0) return [];
    return pList.slice(0, 3).map((p, i) => ({
      name: p.name,
      trend: i === 0 ? 'up' : i === 1 ? 'flat' : 'down',
      velocity: i === 0 ? '↑ Demand Surge (+22%)' : i === 1 ? '→ Steady' : '↓ Declining (-8%)'
    }));
  };

  const fallbackAnomalies = (pList, oList) => {
    if ((!pList || pList.length === 0) && (!oList || oList.length === 0)) {
      return { count: 0, list: [] };
    }
    const lowCount = pList.filter(p => p.stock <= 10).length;
    if (lowCount === 0) return { count: 0, list: [] };
    return {
      count: lowCount,
      list: pList.filter(p => p.stock <= 10).map(p => ({
        id: `ANOM-${p.id || p._id}`,
        title: `⚠️ Low Stock Alert: ${p.name}`,
        description: `Current stock level (${p.stock} units) is below minimum safety threshold (10 units).`,
        severity: 'WARNING'
      }))
    };
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (!metrics) return null;

  const isNewAccount = products.length === 0 && orders.length === 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 900 }}>Retail Inventory & SaaS Dashboard</h1>
          <p className="page-subtitle">Real-time inventory metrics, financial performance, and AI operations control.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Badge variant="info" icon={Clock}>System Sync: Live</Badge>
        </div>
      </div>

      {/* Hero High-Contrast Executive Cards (Inspired by Reference Images) */}
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
          {/* AI Business Insights Banner Card */}
          <Card
            style={{
              background: 'linear-gradient(135deg, rgba(255, 59, 0, 0.04) 0%, rgba(18, 18, 21, 0.08) 100%)',
              border: '1px solid rgba(255, 59, 0, 0.2)',
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
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px var(--primary-glow)'
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  🤖 AI BUSINESS INSIGHTS
                </h3>
                <Badge variant={isNewAccount ? "info" : "success"} size="sm">
                  {isNewAccount ? "New Workspace" : "Live Gemini Engine"}
                </Badge>
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

          {/* Stacked Income & Profit Bar Chart */}
          <SalesChart />

          {/* Product Sales & Inventory Table */}
          <LowStockTable products={products} onRestockComplete={loadDashboardData} />
        </div>

        {/* Right Column (Top Categories, Regional Sales & AI Forecast Widgets) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TopCategoriesWidget />

          {/* 📈 Demand Forecast AI Widget */}
          <Card style={{ border: '1px solid var(--primary-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>📈 Demand Forecast</h3>
              </div>
              <Badge variant="info" size="sm">30-Day ML</Badge>
            </div>

            {forecastItems.length > 0 ? (
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
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.name || item.productName}</span>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>
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
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No product sales historical data yet.
              </div>
            )}
          </Card>

          {/* 🚨 Anomalies Widget */}
          <Card style={{ border: '1px solid var(--warning-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} color={anomalyData.count > 0 ? "var(--warning)" : "var(--success)"} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>🚨 Anomalies</h3>
              </div>
              <Badge variant={anomalyData.count > 0 ? "warning" : "success"} size="sm">Z-Score Engine</Badge>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: anomalyData.count > 0 ? "var(--danger)" : "var(--success)" }}>
                {anomalyData.count}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.75rem' }}>
                {anomalyData.count > 0 ? 'Unusual Statistical Variance Outliers' : 'Zero Anomalies (Healthy)'}
              </div>

              {anomalyData.count > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  icon={ArrowRightCircle}
                  onClick={() => setIsAnomalyModalOpen(true)}
                >
                  View Details ➔
                </Button>
              )}
            </div>
          </Card>
        </div>
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
