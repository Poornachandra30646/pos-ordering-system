import React from 'react';
import { useAdmin } from '../context/AdminContext';

export default function Navbar() {
  const { isAuthenticated, logout, activeTab, setActiveTab, openAuthModal } = useAdmin();

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'orders', label: '📋 Orders' },
    { key: 'inventory', label: '📦 Inventory' },
  ];

  return (
    <nav className="admin-nav">
      <div className="nav-logo">
        Pizzeria <span>Inferno</span> 🔥
        <span className="admin-badge">Admin</span>
      </div>
      <div className="nav-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`nav-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        {isAuthenticated ? (
          <button className="auth-btn logout-btn" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="auth-btn signin-btn" onClick={openAuthModal}>
            Admin Login
          </button>
        )}
      </div>
    </nav>
  );
}

