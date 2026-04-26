import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    toggleCart,
    changeCartQty,
    subtotal,
    delivery,
    tax,
    total,
    openCheckout,
  } = useApp();
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <div className="cart-title">Your Order 🛒</div>
        <button className="drawer-close" onClick={toggleCart}>✕</button>
      </div>

      <div className="cart-items">
        {!isAuthenticated ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🔒</div>
            <div style={{ fontWeight: 600 }}>Sign in to view your cart</div>
            <div style={{ fontSize: 13 }}>Your cart is tied to your account.</div>
            <button
              className="checkout-btn"
              type="button"
              onClick={() => openAuthModal('login')}
              style={{ marginTop: '1rem' }}
            >
              Sign In
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🍕</div>
            <div style={{ fontWeight: 600 }}>Your cart is empty</div>
            <div style={{ fontSize: 13 }}>Add some delicious pizzas!</div>
          </div>
        ) : (
          cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="ci-emoji">{item.pizza.emoji}</div>
              <div className="ci-info">
                <div className="ci-name">{item.pizza.name}</div>
                <div className="ci-meta">
                  {item.size.label} • {item.crust.label}
                  {item.toppings.length ? <br /> + ' ' + item.toppings.join(', ') : ''}
                </div>
                <div className="ci-row">
                  <div className="ci-price">${(item.price * item.qty).toFixed(2)}</div>
                  <div className="ci-qty">
                    <button className="ci-qty-btn" onClick={() => changeCartQty(item.id, -1)}>−</button>
                    <span className="ci-qty-num">{item.qty}</span>
                    <button className="ci-qty-btn" onClick={() => changeCartQty(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery fee</span>
            <span>${delivery.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button className="checkout-btn" onClick={openCheckout} disabled={cart.length === 0}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}

