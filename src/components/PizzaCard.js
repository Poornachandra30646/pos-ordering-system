import React from 'react';
import { useApp } from '../context/AppContext';

export default function PizzaCard({ pizza }) {
  const { openCustomize, outOfStockIds } = useApp();
  const isOOS = outOfStockIds.has(pizza.id);

  return (
    <div
      className="pizza-card"
      onClick={() => !isOOS && openCustomize(pizza)}
      style={isOOS ? { opacity: 0.55, pointerEvents: 'none', cursor: 'not-allowed' } : {}}
    >
      <div className="pizza-img">
        <span>{pizza.emoji}</span>
        {isOOS && <div className="badge-oos">🚫 Out of Stock</div>}
        {pizza.popular && !isOOS && <div className="badge-popular">🔥 Popular</div>}
        {pizza.veg && <div className="badge-veg">🌿 Veg</div>}
      </div>
      <div className="pizza-info">
        <div className="pizza-name">{pizza.name}</div>
        <div className="pizza-desc">{pizza.desc}</div>
        <div className="pizza-footer">
          <div className="pizza-price">
            ${pizza.price.toFixed(2)} <span>from</span>
          </div>
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();
              openCustomize(pizza);
            }}
            disabled={isOOS}
            style={isOOS ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
          >
            {isOOS ? 'Unavailable' : '+ Customize'}
          </button>
        </div>
      </div>
    </div>
  );
}

