import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  return (
    <div className={`toast ${toast.show ? 'show' : ''}`}>
      <span className="toast-icon">✓</span>
      <span>{toast.message}</span>
    </div>
  );
}

