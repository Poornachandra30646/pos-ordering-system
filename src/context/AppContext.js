import React, { createContext, useContext, useState, useCallback } from 'react';
import { SIZES, CRUSTS } from '../data/menuData';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [currentPizza, setCurrentPizza] = useState(null);
  const [currentSize, setCurrentSize] = useState(0);
  const [currentCrust, setCurrentCrust] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [qty, setQty] = useState(1);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const [checkoutStep, setCheckoutStep] = useState(1);
  const [currentTrackStep, setCurrentTrackStep] = useState(0);
  const [trackInterval, setTrackInterval] = useState(null);
  const [orderId, setOrderId] = useState('');

  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  }, []);

  const openCustomize = useCallback((pizza) => {
    setCurrentPizza(pizza);
    setCurrentSize(0);
    setCurrentCrust(0);
    setSelectedToppings([]);
    setQty(1);
    setCustomizeOpen(true);
  }, []);

  const closeCustomize = useCallback(() => {
    setCustomizeOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setCartOpen((prev) => !prev);
  }, []);

  const openCheckout = useCallback(() => {
    setCartOpen(false);
    setCheckoutStep(1);
    setCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
  }, []);

  const openTracking = useCallback(() => {
    setTrackingOpen(true);
  }, []);

  const closeTracking = useCallback(() => {
    setTrackingOpen(false);
  }, []);

  const itemPrice = useCallback((pizza, sizeIdx, crustIdx, toppings) => {
    return pizza.price + SIZES[sizeIdx].price + CRUSTS[crustIdx].price + toppings.length * 1.5;
  }, []);

  const addToCart = useCallback(() => {
    if (!currentPizza) return;
    const price = itemPrice(currentPizza, currentSize, currentCrust, selectedToppings);
    const newItem = {
      id: Date.now(),
      pizza: currentPizza,
      size: SIZES[currentSize],
      crust: CRUSTS[currentCrust],
      toppings: [...selectedToppings],
      qty,
      price,
    };

    setCart((prev) => {
      const existing = prev.find(
        (c) =>
          c.pizza.id === newItem.pizza.id &&
          c.size.label === newItem.size.label &&
          c.crust.label === newItem.crust.label &&
          JSON.stringify(c.toppings) === JSON.stringify(newItem.toppings)
      );
      if (existing) {
        return prev.map((c) => (c.id === existing.id ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, newItem];
    });

    setCustomizeOpen(false);
    showToast(`${currentPizza.name} added to cart!`);
  }, [currentPizza, currentSize, currentCrust, selectedToppings, qty, itemPrice, showToast]);

  const changeCartQty = useCallback((id, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newQty = Math.max(0, item.qty + delta);
      if (newQty === 0) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i));
    });
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;

  const placeOrder = useCallback(() => {
    setCheckoutOpen(false);
    const oid = '#' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setOrderId(oid);
    setCurrentTrackStep(0);
    openTracking();

    if (trackInterval) clearInterval(trackInterval);
    const interval = setInterval(() => {
      setCurrentTrackStep((prev) => {
        if (prev < 5) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 4000);
    setTrackInterval(interval);
  }, [trackInterval, openTracking]);

  const resetOrder = useCallback(() => {
    if (trackInterval) clearInterval(trackInterval);
    setTrackInterval(null);
    setCart([]);
    setTrackingOpen(false);
    showToast('Thanks for your order! Come back soon 🍕');
  }, [trackInterval, showToast]);

  const value = {
    cart,
    cartCount,
    subtotal,
    delivery,
    tax,
    total,
    activeCategory,
    setActiveCategory,
    customizeOpen,
    currentPizza,
    currentSize,
    setCurrentSize,
    currentCrust,
    setCurrentCrust,
    selectedToppings,
    setSelectedToppings,
    qty,
    setQty,
    cartOpen,
    checkoutOpen,
    trackingOpen,
    checkoutStep,
    setCheckoutStep,
    currentTrackStep,
    orderId,
    toast,
    showToast,
    openCustomize,
    closeCustomize,
    toggleCart,
    openCheckout,
    closeCheckout,
    closeTracking,
    addToCart,
    changeCartQty,
    itemPrice,
    placeOrder,
    resetOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

