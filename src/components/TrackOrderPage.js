import React from 'react';
import { useApp } from '../context/AppContext';
import { TRACK_STEPS } from '../data/menuData';

export default function TrackOrderPage() {
  const { currentTrackStep, orderId, resetOrder, navigateToPage } = useApp();
  const est = Math.max(5, (TRACK_STEPS.length - currentTrackStep - 1) * 6);
  const hasOrder = Boolean(orderId);

  return (
    <section className="track-page">
      <div className="track-page-header">
        <div className="page-badge">Track My Order</div>
        <h1>Follow your pizza from oven to door</h1>
        <p>Check the latest status of your current order and return to the menu with one tap.</p>
      </div>

      <div className="track-page-content">
        {hasOrder ? (
          <div className="tracking-card">
            <div className="tracking-header">
              <div className="order-id">Order {orderId}</div>
              <h2>{currentTrackStep >= 5 ? 'Delivered! Buon Appetito! 🎉' : 'Your pizza is on its way! 🚀'}</h2>
              <div className="est-time">
                ⏱ Estimated: <strong>{currentTrackStep >= 5 ? 'Delivered!' : est + ' min'}</strong>
              </div>
            </div>
            <div className="tracking-steps">
              {TRACK_STEPS.map((s, i) => (
                <div
                  key={s.name}
                  className={`track-step ${i < currentTrackStep ? 'done' : i === currentTrackStep ? 'active' : ''}`}
                >
                  <div className="track-icon-wrap">
                    <div className="track-icon">{i < currentTrackStep ? '✓' : s.icon}</div>
                    {i < TRACK_STEPS.length - 1 && <div className="track-line"></div>}
                  </div>
                  <div className="track-info">
                    <div className="track-name">{s.name}</div>
                    <div className="track-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="tracking-footer track-page-footer">
              <button className="back-market-btn" onClick={() => navigateToPage('home')}>
                Back to Home
              </button>
              <button
                className="new-order-btn"
                onClick={() => {
                  resetOrder();
                  navigateToPage('home');
                }}
              >
                Order Again 🍕
              </button>
            </div>
          </div>
        ) : (
          <div className="track-empty-state">
            <p>No active order to track right now.</p>
            <button className="back-market-btn" onClick={() => navigateToPage('home')}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
