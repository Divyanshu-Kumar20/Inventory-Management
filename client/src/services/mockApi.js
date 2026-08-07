// Mock Enterprise Database with Multi-Tenant Account Storage Persistence

const INITIAL_PRODUCTS = [
  {
    id: 'PRD-1001',
    sku: 'SKU-LOGI-MX3',
    name: 'Logitech MX Master 3S Mouse',
    description: 'Performance wireless mouse with 8K DPI tracking and silent clicks.',
    category: 'Electronics',
    supplier: 'TechSource Global',
    price: 99.99,
    stock: 45,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'PRD-1002',
    sku: 'SKU-APPLE-M2',
    name: 'MacBook Pro 16" M2 Max',
    description: 'Apple M2 Max chip, 32GB RAM, 1TB SSD Liquid Retina XDR Display.',
    category: 'Electronics',
    supplier: 'Apple Enterprise Distribution',
    price: 2499.00,
    stock: 8,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'PRD-1003',
    sku: 'SKU-DELL-U27',
    name: 'Dell UltraSharp 27" 4K Monitor',
    description: 'IPS display with USB-C Hub, HDR400, 99% sRGB color gamut.',
    category: 'Electronics',
    supplier: 'Dell Commercial Partners',
    price: 549.50,
    stock: 18,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'PRD-1004',
    sku: 'SKU-HERM-AER',
    name: 'Herman Miller Aeron Chair',
    description: 'Ergonomic office chair with PostureFit SL and fully adjustable arms.',
    category: 'Furniture',
    supplier: 'Workspace Logistics',
    price: 1395.00,
    stock: 4,
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'PRD-1005',
    sku: 'SKU-SONY-WH1000',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones in Silver.',
    category: 'Electronics',
    supplier: 'TechSource Global',
    price: 398.00,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'PRD-1006',
    sku: 'SKU-KEYCH-K2',
    name: 'Keychron K2 Mechanical Keyboard',
    description: 'Wireless Bluetooth RGB backlit mechanical keyboard with Gateron switches.',
    category: 'Electronics',
    supplier: 'TechSource Global',
    price: 89.00,
    stock: 62,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'PRD-1007',
    sku: 'SKU-NESP-VERT',
    name: 'Nespresso Vertuo Next Coffee Machine',
    description: 'Single-serve coffee and espresso maker by De\'Longhi.',
    category: 'Appliances',
    supplier: 'HomeTech Appliances Ltd',
    price: 169.00,
    stock: 25,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebe02f2a698?w=300&auto=format&fit=crop&q=60'
  },
  {
    id: 'PRD-1008',
    sku: 'SKU-MOLE-NOTE',
    name: 'Moleskine Classic Notebook Hard Cover',
    description: 'Ruled notebook, Large (5" x 8.25"), 240 pages in Black.',
    category: 'Stationery',
    supplier: 'Office Depot Wholesale',
    price: 22.95,
    stock: 140,
    status: 'In Stock',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=60'
  }
];

const INITIAL_CATEGORIES = [
  { id: 'CAT-1', name: 'Electronics', description: 'Computers, accessories, audio gear & monitors', productsCount: 5, icon: 'Laptop' },
  { id: 'CAT-2', name: 'Furniture', description: 'Ergonomic desks, executive chairs & office decor', productsCount: 1, icon: 'Armchair' },
  { id: 'CAT-3', name: 'Appliances', description: 'Coffee makers, climate control & breakroom appliances', productsCount: 1, icon: 'Coffee' },
  { id: 'CAT-4', name: 'Stationery', description: 'Notebooks, pens, filing organization & paper supplies', productsCount: 1, icon: 'BookOpen' },
  { id: 'CAT-5', name: 'Apparel', description: 'Branded corporate apparel, jackets & uniforms', productsCount: 0, icon: 'Shirt' }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-8941',
    customer: 'Apex Corp',
    customerEmail: 'procurement@apexcorp.io',
    date: '2026-08-06',
    amount: 3247.50,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Completed',
    items: [
      { productId: 'PRD-1001', name: 'Logitech MX Master 3S Mouse', quantity: 5, price: 99.99 },
      { productId: 'PRD-1003', name: 'Dell UltraSharp 27" 4K Monitor', quantity: 5, price: 549.50 }
    ]
  },
  {
    id: 'ORD-8942',
    customer: 'Nexus Labs LLC',
    customerEmail: 'billing@nexuslabs.com',
    date: '2026-08-05',
    amount: 2499.00,
    paymentMethod: 'Wire Transfer',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Processing',
    items: [
      { productId: 'PRD-1002', name: 'MacBook Pro 16" M2 Max', quantity: 1, price: 2499.00 }
    ]
  },
  {
    id: 'ORD-8943',
    customer: 'Vanguard Systems',
    customerEmail: 'orders@vanguard.org',
    date: '2026-08-04',
    amount: 1484.00,
    paymentMethod: 'PayPal',
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Pending',
    items: [
      { productId: 'PRD-1004', name: 'Herman Miller Aeron Chair', quantity: 1, price: 1395.00 },
      { productId: 'PRD-1006', name: 'Keychron K2 Mechanical Keyboard', quantity: 1, price: 89.00 }
    ]
  },
  {
    id: 'ORD-8944',
    customer: 'Starlight Tech',
    customerEmail: 'admin@starlight.co',
    date: '2026-08-03',
    amount: 695.80,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
    items: [
      { productId: 'PRD-1007', name: 'Nespresso Vertuo Next Coffee Machine', quantity: 2, price: 169.00 },
      { productId: 'PRD-1006', name: 'Keychron K2 Mechanical Keyboard', quantity: 4, price: 89.00 }
    ]
  },
  {
    id: 'ORD-8945',
    customer: 'Elevate Solutions',
    customerEmail: 'finance@elevatesolutions.com',
    date: '2026-08-02',
    amount: 114.75,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Failed',
    fulfillmentStatus: 'Cancelled',
    items: [
      { productId: 'PRD-1008', name: 'Moleskine Classic Notebook Hard Cover', quantity: 5, price: 22.95 }
    ]
  }
];

const INITIAL_CUSTOMERS = [
  { id: 'CUST-501', name: 'Sarah Jenkins (Apex Corp)', email: 'procurement@apexcorp.io', phone: '+91 98765 43210', city: 'Mumbai, MH', ordersCount: 14, totalSpent: 28450.00, status: 'Active' },
  { id: 'CUST-502', name: 'David Chen (Nexus Labs)', email: 'billing@nexuslabs.com', phone: '+91 91234 56789', city: 'Bengaluru, KA', ordersCount: 8, totalSpent: 16920.00, status: 'Active' },
  { id: 'CUST-503', name: 'Marcus Brody (Vanguard)', email: 'orders@vanguard.org', phone: '+91 98123 45678', city: 'Delhi NCR', ordersCount: 5, totalSpent: 9400.00, status: 'Active' },
  { id: 'CUST-504', name: 'Elena Rostova (Starlight)', email: 'admin@starlight.co', phone: '+91 97654 32109', city: 'Hyderabad, TS', ordersCount: 3, totalSpent: 3820.00, status: 'Active' },
  { id: 'CUST-505', name: 'Robert Vance (Elevate)', email: 'finance@elevatesolutions.com', phone: '+91 99887 76655', city: 'Pune, MH', ordersCount: 1, totalSpent: 114.75, status: 'Inactive' }
];

const INITIAL_SUPPLIERS = [
  { id: 'SUP-201', name: 'TechSource Global', contactPerson: 'Alex Rivera', email: 'arivera@techsource.com', phone: '+1 (800) 555-0199', address: '450 Tech Way, San Jose, CA', productsSupplied: 3, rating: 4.9 },
  { id: 'SUP-202', name: 'Apple Enterprise Distribution', contactPerson: 'Claire Bennett', email: 'enterprise@apple-dist.com', phone: '+1 (800) 555-0188', address: '1 Apple Park Way, Cupertino, CA', productsSupplied: 1, rating: 5.0 },
  { id: 'SUP-203', name: 'Dell Commercial Partners', contactPerson: 'Jordan Lee', email: 'jlee@dellpartners.com', phone: '+1 (800) 555-0177', address: '1 Dell Way, Round Rock, TX', productsSupplied: 1, rating: 4.8 },
  { id: 'SUP-204', name: 'Workspace Logistics', contactPerson: 'Michael Scott', email: 'mscott@workspacelogistics.com', phone: '+1 (800) 555-0166', address: '800 Furniture Blvd, Grand Rapids, MI', productsSupplied: 1, rating: 4.7 },
  { id: 'SUP-205', name: 'HomeTech Appliances Ltd', contactPerson: 'Karen Filippelli', email: 'karen@hometech.com', phone: '+1 (800) 555-0155', address: '120 Appliance Ave, Boston, MA', productsSupplied: 1, rating: 4.6 }
];

const INITIAL_INVENTORY_LOGS = [
  { id: 'LOG-3001', product: 'Logitech MX Master 3S Mouse', oldStock: 25, newStock: 45, change: '+20', reason: 'Supplier Purchase Order Restock', date: '2026-08-06 14:30' },
  { id: 'LOG-3002', product: 'MacBook Pro 16" M2 Max', oldStock: 10, newStock: 8, change: '-2', reason: 'Order Fulfillment (ORD-8942)', date: '2026-08-05 11:15' },
  { id: 'LOG-3003', product: 'Sony WH-1000XM5 Headphones', oldStock: 5, newStock: 0, change: '-5', reason: 'Stock Out / High Demand Sales', date: '2026-08-04 16:45' },
  { id: 'LOG-3004', product: 'Herman Miller Aeron Chair', oldStock: 5, newStock: 4, change: '-1', reason: 'Showroom Sample Transfer', date: '2026-08-03 09:20' }
];

// Determine Current User Tenant Key
const getCurrentTenantKey = () => {
  try {
    const raw = localStorage.getItem('inventra_user');
    if (!raw) return 'demo_admin';
    const user = JSON.parse(raw);
    if (!user || !user.email) return 'demo_admin';
    const email = user.email.toLowerCase().trim();
    if (email === 'admin@inventra.io' || email === 'alex.vance@inventra.io') {
      return 'demo_admin';
    }
    return `tenant_${email.replace(/[^a-z0-9]/g, '_')}`;
  } catch (e) {
    return 'demo_admin';
  }
};

// Helper to manage localStorage with Tenant Isolation
const getStored = (key, fallback) => {
  try {
    const tenantKey = `${getCurrentTenantKey()}_${key}`;
    const data = localStorage.getItem(tenantKey);
    if (data) return JSON.parse(data);

    // If new registered tenant, start with ZERO (0) for Products, Inventory, Suppliers, Reports, Orders, & Customers
    const isDemoAdmin = getCurrentTenantKey() === 'demo_admin';
    if (!isDemoAdmin) {
      if (key === 'inventra_products') return [];
      if (key === 'inventra_orders') return [];
      if (key === 'inventra_customers') return [];
      if (key === 'inventra_suppliers') return [];
      if (key === 'inventra_inventory_logs') return [];
      if (key === 'inventra_categories') return INITIAL_CATEGORIES;
    }
    return fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    const tenantKey = `${getCurrentTenantKey()}_${key}`;
    localStorage.setItem(tenantKey, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

export const mockApi = {
  getProducts: () => getStored('inventra_products', INITIAL_PRODUCTS),
  saveProducts: (products) => setStored('inventra_products', products),

  getCategories: () => getStored('inventra_categories', INITIAL_CATEGORIES),
  saveCategories: (categories) => setStored('inventra_categories', categories),

  getOrders: () => getStored('inventra_orders', INITIAL_ORDERS),
  saveOrders: (orders) => setStored('inventra_orders', orders),

  getCustomers: () => {
    const raw = getStored('inventra_customers', INITIAL_CUSTOMERS);
    const sanitized = raw.map(c => {
      if (!c.phone || c.phone.startsWith('+1')) {
        const randNum = Math.floor(7000000000 + Math.random() * 2999999999);
        return { ...c, phone: `+91 ${randNum.toString().slice(0, 5)} ${randNum.toString().slice(5)}` };
      }
      return c;
    });
    setStored('inventra_customers', sanitized);
    return sanitized;
  },
  saveCustomers: (customers) => setStored('inventra_customers', customers),

  getSuppliers: () => getStored('inventra_suppliers', INITIAL_SUPPLIERS),
  saveSuppliers: (suppliers) => setStored('inventra_suppliers', suppliers),

  getInventoryLogs: () => getStored('inventra_inventory_logs', INITIAL_INVENTORY_LOGS),
  saveInventoryLogs: (logs) => setStored('inventra_inventory_logs', logs),

  resetWorkspaceData: () => {
    const tenantKey = getCurrentTenantKey();
    localStorage.setItem(`${tenantKey}_inventra_products`, JSON.stringify([]));
    localStorage.setItem(`${tenantKey}_inventra_orders`, JSON.stringify([]));
    localStorage.setItem(`${tenantKey}_inventra_customers`, JSON.stringify([]));
    localStorage.setItem(`${tenantKey}_inventra_suppliers`, JSON.stringify([]));
    localStorage.setItem(`${tenantKey}_inventra_inventory_logs`, JSON.stringify([]));
  },

  getDashboardMetrics: () => {
    const products = mockApi.getProducts();
    const orders = mockApi.getOrders();
    const customers = mockApi.getCustomers();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.amount : 0), 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const pendingOrdersCount = orders.filter(o => o.fulfillmentStatus === 'Pending').length;

    return {
      totalProducts: products.length,
      productsGrowth: products.length > 0 ? '+12%' : '0%',
      totalOrders: orders.length,
      ordersGrowth: orders.length > 0 ? '+8.5%' : '0%',
      totalRevenue: totalRevenue,
      revenueGrowth: totalRevenue > 0 ? '+18.2%' : '0%',
      totalCustomers: customers.length,
      customersGrowth: customers.length > 0 ? '+5.4%' : '0%',
      pendingOrdersCount,
      lowStockCount
    };
  }
};
