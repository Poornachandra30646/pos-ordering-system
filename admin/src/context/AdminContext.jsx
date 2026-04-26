import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchOrders, fetchPizzas, togglePizzaStock, updateOrderStatus as apiUpdateOrderStatus } from '../services/api';

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

function loadInventory() {
  try {
    return JSON.parse(localStorage.getItem('pi_inventory') || '{}');
  } catch {
    return {};
  }
}

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('pi_admin_auth') === 'true';
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(loadInventory);
  const [loading, setLoading] = useState(false);

  // Load orders and pizzas from backend
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        setLoading(true);
        const [ordersRes, pizzasRes] = await Promise.all([
          fetchOrders(),
          fetchPizzas(),
        ]);
        if (!cancelled) {
          setOrders(ordersRes.data);
          const inv = {};
          pizzasRes.data.forEach((p) => {
            if (p.outOfStock) inv[p.id] = true;
          });
          setInventory((prev) => ({ ...prev, ...inv }));
          localStorage.setItem('pi_inventory', JSON.stringify({ ...loadInventory(), ...inv }));
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
        // Fallback to localStorage
        try {
          const stored = JSON.parse(localStorage.getItem('pi_orders') || '[]');
          if (!cancelled) setOrders(stored);
        } catch {
          // ignore
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const login = useCallback((password) => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('pi_admin_auth', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('pi_admin_auth');
  }, []);

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  const toggleStock = useCallback(async (pizzaId) => {
    try {
      const res = await togglePizzaStock(pizzaId);
      setInventory((prev) => {
        const next = { ...prev, [pizzaId]: res.data.outOfStock };
        localStorage.setItem('pi_inventory', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error('Toggle stock failed:', err);
      // Fallback
      setInventory((prev) => {
        const next = { ...prev, [pizzaId]: !prev[pizzaId] };
        localStorage.setItem('pi_inventory', JSON.stringify(next));
        return next;
      });
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      await apiUpdateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      console.error('Update status failed:', err);
      // Fallback
      setOrders((prev) => {
        const next = prev.map((o) => (o.orderId === orderId || o.id === orderId ? { ...o, status } : o));
        localStorage.setItem('pi_orders', JSON.stringify(next));
        return next;
      });
    }
  }, []);

  const stats = {
    totalOrders: orders.length,
    totalSales: orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0),
    activeOrders: orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
  };

  const value = {
    isAuthenticated,
    authModalOpen,
    activeTab,
    setActiveTab,
    orders,
    inventory,
    stats,
    loading,
    login,
    logout,
    openAuthModal,
    closeAuthModal,
    toggleStock,
    updateOrderStatus,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

