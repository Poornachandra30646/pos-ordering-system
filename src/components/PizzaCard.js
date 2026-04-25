import React from 'react';
import { useApp } from '../context/AppContext';

export default function PizzaCard({ pizza }) {
  const { openCustomize } = useApp();

  return (
    <div className="pizza-card" onClick={() => openCustomize(pizza)}>
      <div className="pizza-img">
        <span>{pizza.emoji}</span>
        {pizza.popular && <div className="badge-popular">🔥 Popular</div>}
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
          >
            + Customize
          </button>
        </div>
      </div>
    </div>
  );
}

