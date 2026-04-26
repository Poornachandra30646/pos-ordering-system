import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SIZES, CRUSTS, EXTRA_TOPPINGS } from '../data/menuData';

export default function CustomizeModal() {
  const {
    customizeOpen,
    closeCustomize,
    currentPizza,
    currentSize,
    setCurrentSize,
    currentCrust,
    setCurrentCrust,
    selectedToppings,
    setSelectedToppings,
    qty,
    setQty,
    addToCart,
    itemPrice,
    outOfStockIds,
  } = useApp();
  const { isAuthenticated } = useAuth();

  if (!currentPizza) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeCustomize();
  };

  const toggleTopping = (name) => {
    setSelectedToppings((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const unitPrice = itemPrice(currentPizza, currentSize, currentCrust, selectedToppings);
  const isOOS = currentPizza ? outOfStockIds.has(currentPizza.id) : false;

  return (
    <div className={`overlay ${customizeOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-emoji">{currentPizza.emoji}</div>
          <div>
            <div className="modal-title">{currentPizza.name}</div>
            <div className="modal-sub">{currentPizza.desc}</div>
          </div>
          <button className="modal-close" onClick={closeCustomize}>✕</button>
        </div>
        <div className="modal-body">
          {isOOS && (
            <div
              style={{
                background: 'rgba(220, 53, 69, 0.15)',
                border: '1px solid rgba(220, 53, 69, 0.4)',
                color: '#ff7b7b',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              🚫 This pizza is currently out of stock.
            </div>
          )}
          <div className="option-group">
            <div className="option-label">Size</div>
            <div className="option-grid">
              {SIZES.map((s, i) => (
                <button
                  key={s.label}
                  className={`opt-btn ${currentSize === i ? 'selected' : ''}`}
                  onClick={() => setCurrentSize(i)}
                >
                  {s.label}{' '}
                  <span className="opt-size" style={{ fontSize: 11, color: 'var(--text3)' }}>
                    {s.size}
                  </span>
                  <span className="opt-price">{s.price === 0 ? 'Base' : '+$' + s.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <div className="option-label">Crust Type</div>
            <div className="option-grid">
              {CRUSTS.map((c, i) => (
                <button
                  key={c.label}
                  className={`opt-btn ${currentCrust === i ? 'selected' : ''}`}
                  onClick={() => setCurrentCrust(i)}
                >
                  {c.label}
                  <span className="opt-price">{c.price === 0 ? 'Base' : '+$' + c.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <div className="option-label">Extra Toppings (+$1.50 each)</div>
            <div className="toppings-grid">
              {EXTRA_TOPPINGS.map((t) => (
                <div
                  key={t}
                  className={`topping-item ${selectedToppings.includes(t) ? 'selected' : ''}`}
                  onClick={() => toggleTopping(t)}
                >
                  <div className="topping-check">
                    {selectedToppings.includes(t) ? '✓' : ''}
                  </div>
                  <span>{t}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>+$1.50</span>
                </div>
              ))}
            </div>
          </div>

          <div className="qty-row">
            <div style={{ fontSize: 14, fontWeight: 600 }}>Quantity</div>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <div className="modal-total">
              ${(unitPrice * qty).toFixed(2)} <span>/ total</span>
            </div>
          </div>

          <button
            className="add-cart-btn"
            onClick={addToCart}
            disabled={isOOS}
            style={isOOS ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          >
            {isOOS ? 'Out of Stock' : isAuthenticated ? 'Add to Cart 🛒' : 'Sign in to add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

