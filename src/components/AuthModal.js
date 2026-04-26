import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, authTab, setAuthTab, login, signup, googleLogin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSwitchTab = (tab) => {
    setAuthTab(tab);
    resetFields();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authTab === 'login') {
      const ok = await login(email, password);
      if (ok) {
        resetFields();
        closeAuthModal();
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
      const ok = await signup(name, email, password);
      if (ok) {
        resetFields();
        closeAuthModal();
      } else {
        setError('Please fill in all fields.');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const ok = await googleLogin(credentialResponse);
    if (ok) {
      resetFields();
      closeAuthModal();
    } else {
      setError('Google sign-in failed. Please try again.');
    }
  };

  if (!authModalOpen) return null;

  return (
    <div className={`overlay open`} onClick={closeAuthModal}>
      <div className="modal auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-emoji">🔐</div>
          <div>
            <div className="modal-title">{authTab === 'login' ? 'Welcome Back' : 'Create Account'}</div>
            <div className="modal-sub">
              {authTab === 'login' ? 'Sign in to order faster' : 'Join Pizzeria Inferno'}
            </div>
          </div>
          <button className="modal-close" onClick={closeAuthModal}>×</button>
        </div>

        <div className="modal-body">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${authTab === 'signup' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {authTab === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="add-cart-btn">
              {authTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              theme="outline"
              size="large"
              text="signin_with"
              shape="pill"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

