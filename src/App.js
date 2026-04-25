import React from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import CustomizeModal from './components/CustomizeModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrackingModal from './components/TrackingModal';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Navbar />
        <Hero />
        <MenuGrid />
        <CustomizeModal />
        <CartDrawer />
        <CheckoutModal />
        <TrackingModal />
        <AuthModal />
        <Toast />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

