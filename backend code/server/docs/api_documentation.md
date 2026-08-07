# Inventra ERP API Documentation & Endpoint Reference

Base API Endpoint: `http://localhost:5000/api`

## Authentication (`/api/auth`)
- `POST /api/auth/register` - Register user account
- `POST /api/auth/login` - Login & acquire JWT token
- `POST /api/auth/logout` - Logout & clear token
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/profile` - Get logged-in profile

## Products (`/api/products`)
- `GET /api/products` - List products (supports `search`, `category`, `status`, `page`, `limit`, `sort`)
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (Admin only)

## Categories (`/api/categories`)
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (with duplicate check)
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Suppliers (`/api/suppliers`)
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Register supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

## Customers (`/api/customers`)
- `GET /api/customers` - List customers
- `POST /api/customers` - Register customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

## Orders (`/api/orders`)
- `GET /api/orders` - List sales orders (paginated)
- `POST /api/orders` - Create sales order (auto stock deduction & invoice generation)
- `PATCH /api/orders/:id/status` - Update order fulfillment status

## Inventory (`/api/inventory`)
- `GET /api/inventory/logs` - List stock audit logs
- `POST /api/inventory/adjust` - Execute manual stock adjustment

## Reports (`/api/reports`)
- `GET /api/reports/sales` - Sales breakdown
- `GET /api/reports/revenue` - Monthly revenue aggregation
- `GET /api/reports/inventory` - Category stock valuation
- `GET /api/reports/customer` - Top spending clients

## Dashboard (`/api/dashboard`)
- `GET /api/dashboard/summary` - Total products, revenue, orders, customers, top items, low stock alerts
