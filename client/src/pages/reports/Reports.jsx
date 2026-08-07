import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  BarChart2,
  TrendingUp,
  PieChart as PieIcon,
  DollarSign,
  Users,
  Boxes
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { exportToCSV } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';

// --- Datasets --- //

// Sales Datasets
const monthlySalesData = [
  { month: 'Jan', revenue: 68000, expenses: 42000, profit: 26000 },
  { month: 'Feb', revenue: 59000, expenses: 38000, profit: 21000 },
  { month: 'Mar', revenue: 84000, expenses: 51000, profit: 33000 },
  { month: 'Apr', revenue: 76000, expenses: 46000, profit: 30000 },
  { month: 'May', revenue: 98000, expenses: 58000, profit: 40000 },
  { month: 'Jun', revenue: 115000, expenses: 69000, profit: 46000 },
  { month: 'Jul', revenue: 128450, expenses: 74000, profit: 54450 }
];

const topProductsData = [
  { name: 'MacBook Pro 16"', sales: 42 },
  { name: 'Dell 27" Monitor', sales: 38 },
  { name: 'Logitech MX 3S', sales: 65 },
  { name: 'Aeron Chair', sales: 18 },
  { name: 'Sony Headphones', sales: 29 }
];

const categorySalesData = [
  { name: 'Electronics', value: 58, color: '#2563EB' },
  { name: 'Furniture', value: 22, color: '#7C3AED' },
  { name: 'Appliances', value: 12, color: '#0EA5E9' },
  { name: 'Stationery', value: 8, color: '#22C55E' }
];

// Inventory Datasets
const categoryStockData = [
  { category: 'Electronics', units: 133, valuation: 145000 },
  { category: 'Furniture', units: 4, valuation: 5580 },
  { category: 'Appliances', units: 25, valuation: 4225 },
  { category: 'Stationery', units: 140, valuation: 3213 },
  { category: 'Apparel', units: 0, valuation: 0 }
];

const stockHealthData = [
  { name: 'In Stock (Healthy)', value: 72, color: '#22C55E' },
  { name: 'Low Stock Alert', value: 18, color: '#F59E0B' },
  { name: 'Out of Stock', value: 10, color: '#EF4444' }
];

const inventoryTurnoverData = [
  { month: 'Jan', ratio: 3.2, dio: 45 },
  { month: 'Feb', ratio: 3.5, dio: 42 },
  { month: 'Mar', ratio: 4.1, dio: 36 },
  { month: 'Apr', ratio: 3.9, dio: 38 },
  { month: 'May', ratio: 4.6, dio: 32 },
  { month: 'Jun', ratio: 5.2, dio: 28 },
  { month: 'Jul', ratio: 5.8, dio: 25 }
];

// Revenue Datasets
const revenueChannelData = [
  { name: 'Credit Card', value: 54, color: '#2563EB' },
  { name: 'Wire Transfer', value: 32, color: '#7C3AED' },
  { name: 'PayPal', value: 14, color: '#0EA5E9' }
];

const aovData = [
  { month: 'Jan', aov: 420 },
  { month: 'Feb', aov: 480 },
  { month: 'Mar', aov: 610 },
  { month: 'Apr', aov: 540 },
  { month: 'May', aov: 720 },
  { month: 'Jun', aov: 810 },
  { month: 'Jul', aov: 950 }
];

const targetVsActualData = [
  { quarter: 'Q1 2026', target: 200000, actual: 211000 },
  { quarter: 'Q2 2026', target: 250000, actual: 289000 },
  { quarter: 'Q3 2026 (Est)', target: 300000, actual: 342000 },
  { quarter: 'Q4 2026 (Target)', target: 350000, actual: 0 }
];

// Customer Datasets
const customerAcquisitionData = [
  { month: 'Jan', newCustomers: 32, totalActive: 410 },
  { month: 'Feb', newCustomers: 28, totalActive: 438 },
  { month: 'Mar', newCustomers: 45, totalActive: 483 },
  { month: 'Apr', newCustomers: 39, totalActive: 522 },
  { month: 'May', newCustomers: 54, totalActive: 576 },
  { month: 'Jun', newCustomers: 68, totalActive: 644 },
  { month: 'Jul', newCustomers: 82, totalActive: 726 }
];

const topClientsData = [
  { name: 'Apex Corp', spend: 28450 },
  { name: 'Nexus Labs', spend: 16920 },
  { name: 'Vanguard Systems', spend: 9400 },
  { name: 'Starlight Tech', spend: 3820 },
  { name: 'Elevate Solutions', spend: 114 }
];

const customerRetentionData = [
  { name: 'Repeat / Retained', value: 84, color: '#22C55E' },
  { name: 'New Clients', value: 12, color: '#2563EB' },
  { name: 'Churned / Inactive', value: 4, color: '#EF4444' }
];

export const Reports = () => {
  const [reportType, setReportType] = useState('sales'); // 'sales' | 'inventory' | 'revenue' | 'customer'
  const toast = useToast();

  const handleDownloadPDF = () => {
    toast.success(`Generated official PDF report for ${reportType.toUpperCase()} module`, 'PDF Exported');
    window.print();
  };

  const handleDownloadExcel = () => {
    let dataToExport = monthlySalesData;
    if (reportType === 'inventory') dataToExport = categoryStockData;
    if (reportType === 'revenue') dataToExport = targetVsActualData;
    if (reportType === 'customer') dataToExport = customerAcquisitionData;

    exportToCSV(`inventra_${reportType}_report`, dataToExport);
    toast.success(`Exported ${reportType.toUpperCase()} dataset to Excel CSV format`, 'Excel Exported');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Intelligence Reports</h1>
          <p className="page-subtitle">Enterprise financial forecasting, inventory turnover, revenue channels, and customer conversion.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" icon={FileSpreadsheet} onClick={handleDownloadExcel}>
            Download Excel
          </Button>
          <Button variant="primary" icon={FileText} onClick={handleDownloadPDF}>
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Report Selector Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <Card
          className="clickable"
          style={{
            cursor: 'pointer',
            border: `2px solid ${reportType === 'sales' ? 'var(--primary)' : 'var(--card-border)'}`,
            backgroundColor: reportType === 'sales' ? 'var(--primary-light)' : 'var(--card-bg)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => {
            setReportType('sales');
            toast.info('Switched to Sales Analytics Report');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: reportType === 'sales' ? 'var(--primary)' : 'var(--text-main)' }}>
                Sales Report
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue & margins</p>
            </div>
          </div>
        </Card>

        <Card
          className="clickable"
          style={{
            cursor: 'pointer',
            border: `2px solid ${reportType === 'inventory' ? 'var(--primary)' : 'var(--card-border)'}`,
            backgroundColor: reportType === 'inventory' ? 'var(--primary-light)' : 'var(--card-bg)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => {
            setReportType('inventory');
            toast.info('Switched to Inventory Turnover Report');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Boxes size={24} style={{ color: '#7C3AED' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: reportType === 'inventory' ? 'var(--primary)' : 'var(--text-main)' }}>
                Inventory Report
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stock turnover & valuation</p>
            </div>
          </div>
        </Card>

        <Card
          className="clickable"
          style={{
            cursor: 'pointer',
            border: `2px solid ${reportType === 'revenue' ? 'var(--primary)' : 'var(--card-border)'}`,
            backgroundColor: reportType === 'revenue' ? 'var(--primary-light)' : 'var(--card-bg)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => {
            setReportType('revenue');
            toast.info('Switched to Revenue & Financials Report');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <DollarSign size={24} style={{ color: '#22C55E' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: reportType === 'revenue' ? 'var(--primary)' : 'var(--text-main)' }}>
                Revenue Report
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross profit & AOV</p>
            </div>
          </div>
        </Card>

        <Card
          className="clickable"
          style={{
            cursor: 'pointer',
            border: `2px solid ${reportType === 'customer' ? 'var(--primary)' : 'var(--card-border)'}`,
            backgroundColor: reportType === 'customer' ? 'var(--primary-light)' : 'var(--card-bg)',
            transition: 'all 0.2s ease'
          }}
          onClick={() => {
            setReportType('customer');
            toast.info('Switched to Customer Retention Report');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={24} style={{ color: '#0EA5E9' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: reportType === 'customer' ? 'var(--primary)' : 'var(--text-main)' }}>
                Customer Report
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LTV & retention ratio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Dynamic View 1: SALES REPORT */}
      {reportType === 'sales' && (
        <>
          <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
            <Card title="Monthly Revenue vs Operational Expenses (₹)">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Net Profit Margin Growth (₹)">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                    <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#22C55E" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2">
            <Card title="Top Selling Products by Volume">
              <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                    <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={110} />
                    <Tooltip />
                    <Bar dataKey="sales" name="Units Sold" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Category Revenue Share (%)">
              <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {categorySalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Dynamic View 2: INVENTORY REPORT */}
      {reportType === 'inventory' && (
        <>
          <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
            <Card title="Warehoused Units by Category">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStockData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="units" name="Stock Count (Units)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Stock Health & Threshold Breakdown (%)">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stockHealthData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {stockHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card title="Inventory Turnover Ratio & Days Inventory Outstanding (DIO)">
            <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryTurnoverData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ratio" name="Turnover Ratio (x)" stroke="#2563EB" strokeWidth={3} />
                  <Line type="monotone" dataKey="dio" name="Days Inventory Outstanding (Days)" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      {/* Dynamic View 3: REVENUE REPORT */}
      {reportType === 'revenue' && (
        <>
          <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
            <Card title="Quarterly Targets vs Realized Revenue (₹)">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={targetVsActualData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="quarter" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="target" name="Target Revenue" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Realized Revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Revenue Payment Channel Breakdown (%)">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenueChannelData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {revenueChannelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card title="Average Order Value (AOV) Trend (₹)">
            <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aovData}>
                  <defs>
                    <linearGradient id="aovGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(val) => `₹${val}`} />
                  <Area type="monotone" dataKey="aov" name="Average Order Value (₹)" stroke="#2563EB" strokeWidth={3} fill="url(#aovGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}

      {/* Dynamic View 4: CUSTOMER REPORT */}
      {reportType === 'customer' && (
        <>
          <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
            <Card title="New Customer Acquisition Rate">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerAcquisitionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="newCustomers" name="New Clients Onboarded" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Client Retention & Renewal Ratio (%)">
              <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={customerRetentionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {customerRetentionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card title="Top Enterprise Clients by Lifetime Spend (₹)">
            <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topClientsData}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={130} />
                  <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                  <Bar dataKey="spend" name="Lifetime Spend (₹)" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
