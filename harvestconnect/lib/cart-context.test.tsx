import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider, useCart } from './cart-context';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('should start with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, title: 'Fresh Appels', price: 5, quantity: 2 };

    act(() => {
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(item);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(10);
  });

  it('should increment quantity if same item is added', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, title: 'Fresh Appels', price: 5, quantity: 1 };

    act(() => {
      result.current.addItem(item);
      result.current.addItem(item);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, title: 'Fresh Appels', price: 5, quantity: 1 };

    act(() => {
      result.current.addItem(item);
      result.current.removeItem(1);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, title: 'Fresh Appels', price: 5, quantity: 1 };

    act(() => {
      result.current.addItem(item);
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const item = { id: 1, title: 'Fresh Appels', price: 5, quantity: 1 };

    act(() => {
      result.current.addItem(item);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });
});
