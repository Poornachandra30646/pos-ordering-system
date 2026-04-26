import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { SIZES, CRUSTS } from '../data/menuData';
import { fetchPizzas, createOrder, fetchCart, saveCart } from '../services/api';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

function getInventory() {
  try {
    const raw = localStorage.getItem('pi_inventory');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getStoredCart() {
  try {
    const raw = localStorage.getItem('pi_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeCart(cart) {
  try {
    localStorage.setItem('pi_cart', JSON.stringify(cart));
  } catch {
    // ignore storage failures
  }
}

function getOutOfStockIds(inventory) {
  return new Set(Object.entries(inventory).filter(([, v]) => v === true).map(([k]) => Number(k)));
}

function mergeCart(localCart, serverCart) {
  const map = new Map();
  const normalize = (item) => {
    const toppings = Array.isArray(item.toppings) ? item.toppings.join('|') : '';
    return `${item.pizza?.id ?? item.id}-${item.size?.label || ''}-${item.crust?.label || ''}-${toppings}`;
  };

  // Server cart is source of truth — add it first
  serverCart.forEach((item) => {
    const key = normalize(item);
    map.set(key, {
      ...item,
      id: item.id != null ? item.id : `${Date.now()}-${Math.random()}`,
    });
  });

  // Add local items that don't exist on server
  localCart.forEach((item) => {
    const key = normalize(item);
    if (!map.has(key)) {
      map.set(key, {
        ...item,
        id: item.id != null ? item.id : `${Date.now()}-${Math.random()}`,
      });
    }
  });

  return Array.from(map.values());
}

export function AppProvider({ children }) {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [cart, setCart] = useState(getStoredCart);
  const cartRef = useRef(cart);
  const cartLoadedRef = useRef(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [inventory, setInventory] = useState(getInventory);
  const [outOfStockIds, setOutOfStockIds] = useState(() => getOutOfStockIds(inventory));
  const [pizzas, setPizzas] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [currentPizza, setCurrentPizza] = useState(null);
  const [currentSize, setCurrentSize] = useState(0);
  const [currentCrust, setCurrentCrust] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [qty, setQty] = useState(1);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const [checkoutStep, setCheckoutStep] = useState(1);
  const [currentTrackStep, setCurrentTrackStep] = useState(0);
  const [trackInterval, setTrackInterval] = useState(null);
  const [orderId, setOrderId] = useState('');

  const [toast, setToast] = useState({ show: false, message: '' });

  // Load pizzas from backend
  useEffect(() => {
    let cancelled = false;
    async function loadPizzas() {
      try {
        setMenuLoading(true);
        const res = await fetchPizzas();
        if (!cancelled) {
          setPizzas(res.data);
          // Sync outOfStock from backend into inventory
          const inv = {};
          res.data.forEach((p) => {
            if (p.outOfStock) inv[p.id] = true;
          });
          setInventory((prev) => ({ ...prev, ...inv }));
          setOutOfStockIds(getOutOfStockIds({ ...getInventory(), ...inv }));
        }
      } catch (err) {
        console.error('Failed to load pizzas', err);
      } finally {
        if (!cancelled) setMenuLoading(false);
      }
    }
    loadPizzas();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // Load cart from server when user becomes authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    if (cartLoadedRef.current) return;

    let cancelled = false;

    async function loadUserCart() {
      try {
        const res = await fetchCart();
        if (cancelled) return;
        const serverCart = Array.isArray(res.data) ? res.data : [];
        const merged = mergeCart(cartRef.current, serverCart);
        setCart(merged);
      } catch (err) {
        console.error('Failed to load saved cart', err);
      }
    }

    loadUserCart();
    cartLoadedRef.current = true;
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Save cart to server whenever it changes (only after initial load)
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset on logout
      setCart([]);
      cartLoadedRef.current = false;
      try {
        localStorage.removeItem('pi_cart');
      } catch {
        // ignore
      }
      return;
    }

    // Don't save until we've loaded from server at least once
    if (!cartLoadedRef.current) return;

    storeCart(cart);
    async function saveUserCart() {
      try {
        await saveCart(cart);
      } catch (err) {
        console.error('Failed to save cart for user', err);
      }
    }

    saveUserCart();
  }, [cart, isAuthenticated]);

  // Sync out-of-stock status across tabs
  useEffect(() => {
    const handler = () => {
      const inventoryData = getInventory();
      setInventory(inventoryData);
      setOutOfStockIds(getOutOfStockIds(inventoryData));
    };
    window.addEventListener('storage', handler);
    const interval = setInterval(handler, 2000);
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

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

  const navigateToPage = useCallback((page) => {
    setActivePage(page);
  }, []);

  const itemPrice = useCallback((pizza, sizeIdx, crustIdx, toppings) => {
    return pizza.price + SIZES[sizeIdx].price + CRUSTS[crustIdx].price + toppings.length * 1.5;
  }, []);

  const addToCart = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal('login');
      showToast('Please sign in to add items to your cart.');
      return;
    }
    if (!currentPizza) return;
    if (outOfStockIds.has(currentPizza.id)) {
      showToast('Sorry, this pizza is currently out of stock.');
      return;
    }
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
  }, [currentPizza, currentSize, currentCrust, selectedToppings, qty, itemPrice, showToast, outOfStockIds, isAuthenticated, openAuthModal]);

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

  const cartCount = isAuthenticated ? cart.reduce((s, i) => s + i.qty, 0) : 0;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 2.99;
  const tax = subtotal * 0.08;
  const total = subtotal + delivery + tax;

  const placeOrder = useCallback(async (deliveryInfo) => {
    setCheckoutOpen(false);
    const oid = '#' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setOrderId(oid);
    setCurrentTrackStep(0);
    openTracking();

    // Build order payload
    const orderPayload = {
      orderId: oid,
      customerName: deliveryInfo?.fullName || 'Guest',
      phone: deliveryInfo?.phone || '',
      address: deliveryInfo?.address || '',
      city: deliveryInfo?.city || '',
      zip: deliveryInfo?.zip || '',
      notes: deliveryInfo?.notes || '',
      items: cart.map((i) => ({
        name: i.pizza.name,
        emoji: i.pizza.emoji,
        size: i.size.label,
        crust: i.crust.label,
        toppings: i.toppings,
        qty: i.qty,
        price: i.price,
      })),
      total: Number(total.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      delivery: Number(delivery.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      status: 'Order Received',
      payMethod: deliveryInfo?.payMethod || 'Credit Card',
      user: user ? { name: user.name, email: user.email, picture: user.picture } : null,
    };

    // Persist to backend
    try {
      await createOrder(orderPayload);
    } catch (err) {
      console.error('Failed to save order to backend:', err);
      // Fallback to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('pi_orders') || '[]');
        localStorage.setItem('pi_orders', JSON.stringify([{ ...orderPayload, createdAt: new Date().toISOString() }, ...existing]));
      } catch {
        // ignore
      }
    }

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
  }, [trackInterval, openTracking, cart, total, subtotal, delivery, tax, user]);

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
    activePage,
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
    navigateToPage,
    addToCart,
    changeCartQty,
    itemPrice,
    placeOrder,
    resetOrder,
    outOfStockIds,
    pizzas,
    menuLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

