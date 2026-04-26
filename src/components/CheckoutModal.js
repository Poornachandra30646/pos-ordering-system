import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CheckoutModal() {
  const {
    checkoutOpen,
    closeCheckout,
    checkoutStep,
    setCheckoutStep,
    cart,
    subtotal,
    delivery,
    tax,
    total,
    placeOrder,
  } = useApp();

  const [payMethod, setPayMethod] = useState('Credit Card');
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    notes: '',
  });

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeCheckout();
  };

  const nextStep = () => setCheckoutStep((s) => Math.min(3, s + 1));

  const updateField = (field, value) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    placeOrder({ ...deliveryInfo, payMethod });
  };

  const renderStepBody = () => {
    if (checkoutStep === 1) {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              placeholder="John Doe"
              value={deliveryInfo.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-input"
              placeholder="+1 555 000 0000"
              value={deliveryInfo.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <input
              className="form-input"
              placeholder="123 Main Street"
              value={deliveryInfo.address}
              onChange={(e) => updateField('address', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">City</label>
              <input
                className="form-input"
                placeholder="New York"
                value={deliveryInfo.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">ZIP Code</label>
              <input
                className="form-input"
                placeholder="10001"
                value={deliveryInfo.zip}
                onChange={(e) => updateField('zip', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Delivery Notes (optional)</label>
            <input
              className="form-input"
              placeholder="Leave at door, ring bell, etc."
              value={deliveryInfo.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>
          <button className="next-btn" onClick={nextStep} style={{ marginTop: '.5rem' }}>
            Continue to Payment →
          </button>
        </>
      );
    }

    if (checkoutStep === 2) {
      return (
        <>
          <div className="option-label" style={{ marginBottom: '.75rem' }}>Payment Method</div>
          <div className="payment-methods">
            {[
              { icon: '💳', name: 'Credit Card' },
              { icon: '📱', name: 'Apple Pay' },
              { icon: '💰', name: 'Cash on Delivery' },
            ].map((p) => (
              <div
                key={p.name}
                className={`pay-method ${payMethod === p.name ? 'selected' : ''}`}
                onClick={() => setPayMethod(p.name)}
              >
                <span className="pay-icon">{p.icon}</span>
                <div className="pay-name">{p.name}</div>
              </div>
            ))}
          </div>

          {payMethod === 'Credit Card' && (
            <div id="cardFields">
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" placeholder="4242 4242 4242 4242" maxLength={19} />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Expiry</label>
                  <input className="form-input" placeholder="MM / YY" maxLength={7} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">CVV</label>
                  <input className="form-input" placeholder="123" maxLength={3} />
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              marginBottom: '1.2rem',
            }}
          >
            <div
              className="summary-row"
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: '.3rem' }}
            >
              <span style={{ color: 'var(--text2)' }}>Order Total</span>
              <span style={{ fontWeight: 700, color: 'var(--gold)' }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Includes delivery & taxes</div>
          </div>
          <button className="next-btn" onClick={nextStep}>
            Review Order →
          </button>
        </>
      );
    }

    // Step 3
    return (
      <>
        <div
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.2rem',
            marginBottom: '1.2rem',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '.6px',
              marginBottom: '.8rem',
            }}
          >
            Order Summary
          </div>
          {cart.map((i) => (
            <div
              key={i.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                marginBottom: '.4rem',
              }}
            >
              <span>
                {i.qty}× {i.pizza.name} ({i.size.label})
              </span>
              <span style={{ color: 'var(--gold)' }}>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', margin: '.8rem 0 .5rem' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)', marginBottom: '.3rem' }}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)', marginBottom: '.3rem' }}>
            <span>Delivery</span>
            <span>${delivery.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)', marginBottom: '.5rem' }}>
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: 'var(--gold)' }}>${total.toFixed(2)}</span>
          </div>
        </div>
        <button className="place-btn" onClick={handlePlaceOrder}>
          🔥 Place Order Now!
        </button>
      </>
    );
  };

  const stepStatus = (step) => {
    if (checkoutStep > step) return 'done';
    if (checkoutStep === step) return 'active';
    return '';
  };

  return (
    <div className={`overlay ${checkoutOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ padding: '1.2rem 1.5rem' }}>
          <div>
            <div className="modal-title" style={{ fontSize: '1.2rem' }}>Checkout</div>
            <div className="modal-sub">Almost there!</div>
          </div>
          <button className="modal-close" onClick={closeCheckout}>✕</button>
        </div>

        <div className="step-indicator">
          <div style={{ textAlign: 'center' }}>
            <div className={`step-dot ${stepStatus(1)}`}>{checkoutStep > 1 ? '✓' : '1'}</div>
            <div className="step-label">Delivery</div>
          </div>
          <div className="step-line"></div>
          <div style={{ textAlign: 'center' }}>
            <div className={`step-dot ${stepStatus(2)}`}>{checkoutStep > 2 ? '✓' : '2'}</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="step-line"></div>
          <div style={{ textAlign: 'center' }}>
            <div className={`step-dot ${stepStatus(3)}`}>3</div>
            <div className="step-label">Confirm</div>
          </div>
        </div>

        <div className="modal-body">{renderStepBody()}</div>
      </div>
    </div>
  );
}

