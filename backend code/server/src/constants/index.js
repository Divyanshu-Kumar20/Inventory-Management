const ROLES = {
  SUPER_ADMIN: 'Super Administrator',
  INVENTORY_MANAGER: 'Inventory Manager',
  PROCUREMENT: 'Procurement Specialist',
  WAREHOUSE_OPERATOR: 'Warehouse Operator'
};

const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock'
};

module.exports = {
  ROLES,
  ORDER_STATUS,
  STOCK_STATUS
};
