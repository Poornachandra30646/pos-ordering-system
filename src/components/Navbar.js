import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { cartCount, toggleCart, navigateToPage } = useApp();
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <nav>
      <div className="nav-logo">
        Pizzeria <span>Inferno</span> 🔥
      </div>
      <div className="nav-right">
        <button className="track-btn" onClick={() => navigateToPage('track')}>
          Track My Order
        </button>
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <button className="auth-btn signin-btn" onClick={() => openAuthModal('login')}>
            Sign In
          </button>
        )}
        <button className="cart-btn" onClick={toggleCart}>
          🛒 Cart
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}

