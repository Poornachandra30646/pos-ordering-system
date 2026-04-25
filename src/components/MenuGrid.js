import React from 'react';
import { useApp } from '../context/AppContext';
import { PIZZAS } from '../data/menuData';
import PizzaCard from './PizzaCard';

export default function MenuGrid() {
  const { activeCategory } = useApp();

  const filtered = PIZZAS.filter(
    (p) => activeCategory === 'all' || p.cat === activeCategory
  );

  return (
    <section className="menu-section">
      <div className="section-title">
        Our <span>Menu</span>
      </div>
      <div className="menu-grid">
        {filtered.map((pizza) => (
          <PizzaCard key={pizza.id} pizza={pizza} />
        ))}
      </div>
    </section>
  );
}

