"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("harvest_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("harvest_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      let newItems;
      if (existingItem) {
        newItems = currentItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
        showToast(`Updated ${newItem.title} quantity in cart`, 'success');
      } else {
        newItems = [...currentItems, newItem];
        showToast(`${newItem.title} added to cart`, 'success');
      }
      return newItems;
    });
  };

  const removeItem = (id: number) => {
    setItems((currentItems) => {
      const removedItem = currentItems.find(item => item.id === id);
      const newItems = currentItems.filter((item) => item.id !== id);
      if (removedItem) {
        showToast(`${removedItem.title} removed from cart`, 'info');
      }
      return newItems;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((currentItems) => {
      const updatedItem = currentItems.find(item => item.id === id);
      const newItems = currentItems.map((item) => 
        item.id === id ? { ...item, quantity } : item
      );
      if (updatedItem) {
        showToast(`${updatedItem.title} quantity updated to ${quantity}`, 'success');
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    showToast('Cart cleared', 'info');
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
