import React from 'react';
import { useAdmin } from '../context/AdminContext';

export default function Dashboard() {
  const { stats, orders } = useAdmin();

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="admin-page">
      <h2 className="section-title">
        Dashboard <span>Overview</span>
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">${stats.totalSales.toFixed(2)}</div>
          <div className="stat-label">Total Sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.activeOrders}</div>
          <div className="stat-label">Active Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍕</div>
          <div className="stat-value">
            {orders.reduce((s, o) => s + o.items.reduce((is, i) => is + i.qty, 0), 0)}
          </div>
          <div className="stat-label">Pizzas Sold</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-subtitle">Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <div className="empty-state">No orders yet. Orders from the client app will appear here.</div>
        ) : (
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="order-id-cell">{o.id}</td>
                    <td>{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</td>
                    <td className="order-total-cell">${o.total}</td>
                    <td>
                      <span className={`status-badge ${o.status?.toLowerCase().replace(/\s+/g, '-') || 'order-received'}`}>
                        {o.status || 'Order Received'}
                      </span>
                    </td>
                    <td className="order-date-cell">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

