import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const RecentOrders = ({ orders }) => {
  return (
    <Card
      title="Recent Customer Orders"
      action={
        <Link to="/orders" style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
          View All Orders →
        </Link>
      }
    >
      <div className="table-responsive" style={{ marginTop: '0.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((ord) => (
              <tr key={ord.id}>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{ord.id}</td>
                <td>{ord.customer}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(ord.amount)}</td>
                <td>
                  <Badge
                    variant={
                      ord.fulfillmentStatus === 'Completed' ? 'success' :
                      ord.fulfillmentStatus === 'Processing' ? 'info' :
                      ord.fulfillmentStatus === 'Pending' ? 'warning' : 'danger'
                    }
                  >
                    {ord.fulfillmentStatus}
                  </Badge>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{formatDate(ord.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
