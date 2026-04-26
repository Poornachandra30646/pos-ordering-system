import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import OrdersView from './components/OrdersView';
import Inventory from './components/Inventory';
import AuthModal from './components/AuthModal';
import './App.css';

function AdminApp() {
  const { activeTab, isAuthenticated } = useAdmin();

  return (
    <div className="admin-app">
      <Navbar />
      <main className="admin-main">
        {!isAuthenticated && (
          <div className="auth-banner">
            <span>🔒 You are viewing in read-only mode. Login as admin to manage inventory & orders.</span>
          </div>
        )}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'inventory' && <Inventory />}
      </main>
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AdminApp />
    </AdminProvider>
  );
}

