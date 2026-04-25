import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="user-menu">
      {user?.picture ? (
        <img className="avatar" src={user.picture} alt={user.name} />
      ) : (
        <div className="avatar avatar-initials">{initials}</div>
      )}
      <div className="user-info">
        <span className="user-name">{user?.name || 'User'}</span>
      </div>
      <button className="auth-btn logout-btn" onClick={logout}>
        Sign Out
      </button>
    </div>
  );
}

