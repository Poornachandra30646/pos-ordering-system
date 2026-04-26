import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const ok = login(password);
    if (ok) {
      setPassword('');
      closeAuthModal();
    } else {
      setError('Invalid password. Try admin123');
    }
  };

  if (!authModalOpen) return null;

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && closeAuthModal()}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Admin Login</div>
            <div className="modal-sub">Enter your password to continue</div>
          </div>
        </div>
        <div className="modal-body">
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="add-cart-btn" type="submit">
              🔐 Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

