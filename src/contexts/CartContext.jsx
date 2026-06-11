// src/contexts/CartContext.jsx
"use client";

import { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("@CantinhoTropical:cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("@CantinhoTropical:cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const addItem = useCallback((product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          imageUrl: product.imageUrl,
          price: parseFloat(product.price),
          quantity: quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    totalItems: getTotalItems(),
    subtotal: getSubtotal(),
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}