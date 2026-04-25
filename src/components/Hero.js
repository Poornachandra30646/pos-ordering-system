import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/menuData';

const categoryLabels = {
  all: 'All Pizzas',
  classic: 'Classic',
  specialty: 'Specialty',
  veggie: 'Vegetarian',
};

export default function Hero() {
  const { activeCategory, setActiveCategory } = useApp();

  return (
    <section className="hero">
      <div className="hero-badge">🔥 Fresh from the wood-fired oven</div>
      <h1>
        Authentic Italian
        <br />
        <em>Pizza, Delivered Hot</em>
      </h1>
      <p>
        Handcrafted with premium ingredients. Customize your perfect pizza and get it delivered to your door in 30 minutes.
      </p>
      <div className="cats">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>
    </section>
  );
}

