import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { PIZZAS } from '../data/menuData';

export default function Inventory() {
  const { inventory, toggleStock } = useAdmin();

  return (
    <div className="admin-page">
      <h2 className="section-title">
        Inventory <span>Management</span>
      </h2>
      <p className="section-desc">
        Toggle pizzas out of stock. Hidden items will not appear on the client menu.
      </p>

      <div className="inventory-grid">
        {PIZZAS.map((pizza) => {
          const isOOS = !!inventory[pizza.id];
          return (
            <div
              key={pizza.id}
              className={`inventory-card ${isOOS ? 'oos' : ''}`}
            >
              <div className="inventory-emoji">{pizza.emoji}</div>
              <div className="inventory-info">
                <div className="inventory-name">{pizza.name}</div>
                <div className="inventory-meta">
                  ${pizza.price.toFixed(2)} · {pizza.cat}
                </div>
              </div>
              <button
                className={`inventory-toggle ${isOOS ? 'restock' : 'mark-oos'}`}
                onClick={() => toggleStock(pizza.id)}
              >
                {isOOS ? '✅ Restock' : '🚫 Mark Out of Stock'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

