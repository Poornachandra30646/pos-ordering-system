import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import CustomizeModal from './components/CustomizeModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrackingModal from './components/TrackingModal';
import TrackOrderPage from './components/TrackOrderPage';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import './App.css';

function AppContent() {
  const { activePage } = useApp();

  return (
    <>
      <Navbar />
      {activePage === 'track' ? (
        <TrackOrderPage />
      ) : (
        <>
          <Hero />
          <MenuGrid />
        </>
      )}
      <CustomizeModal />
      <CartDrawer />
      <CheckoutModal />
      <TrackingModal />
      <AuthModal />
      <Toast />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

