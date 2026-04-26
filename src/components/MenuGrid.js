import React from 'react';
import { useApp } from '../context/AppContext';
import { PIZZAS } from '../data/menuData';
import PizzaCard from './PizzaCard';

export default function MenuGrid() {
  const { activeCategory, outOfStockIds, pizzas, menuLoading } = useApp();

  const menu = pizzas.length > 0 ? pizzas : PIZZAS;

  const filtered = menu.filter(
    (p) => (activeCategory === 'all' || p.cat === activeCategory) && !outOfStockIds.has(p.id)
  );

  return (
    <section className="menu-section">
      <div className="section-title">
        Our <span>Menu</span>
      </div>
      {menuLoading && <div style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: '1rem' }}>Loading menu...</div>}
      <div className="menu-grid">
        {filtered.map((pizza) => (
          <PizzaCard key={pizza.id} pizza={pizza} />
        ))}
      </div>
    </section>
  );
}

