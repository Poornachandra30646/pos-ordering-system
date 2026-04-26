import React from 'react';
import { useAdmin } from '../context/AdminContext';

const STATUS_OPTIONS = ['Order Received', 'Preparing', 'In the Oven', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function OrdersView() {
  const { orders, updateOrderStatus, loading } = useAdmin();

  return (
    <div className="admin-page">
      <h2 className="section-title">
        All <span>Orders</span>
      </h2>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: '1rem' }}>Loading orders...</div>}

      {orders.length === 0 ? (
        <div className="empty-state">No orders yet. Orders from the client app will appear here.</div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>Delivery</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id || o.orderId || o.id}>
                  <td className="order-id-cell">{o.orderId || o.id}</td>
                  <td>
                    <div className="order-items-list">
                      {(o.items || []).map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span className="order-item-emoji">{item.emoji}</span>
                          <span>{item.qty}× {item.name} ({item.size})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>${o.subtotal}</td>
                  <td>${o.delivery}</td>
                  <td>${o.tax}</td>
                  <td className="order-total-cell">${o.total}</td>
                  <td>
                    <select
                      className="status-select"
                      value={o.status || 'Order Received'}
                      onChange={(e) => updateOrderStatus(o.orderId || o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="order-date-cell">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

