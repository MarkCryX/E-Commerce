// src/context/CartContext.js
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const exists = cart.find(
      (i) =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.color === item.color,
    );

    if (exists) {
      setCart(
        cart.map((i) =>
          i === exists ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (targetItem) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === targetItem.productId &&
            item.size === targetItem.size &&
            item.color === targetItem.color
          ),
      ),
    );
  };

  const clearCart = () => setCart([]);

  const handleIncrease = (product) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color
        ) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    );
  };

  const handleDecrease = (product) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color
        ) {
          // ลดจำนวนเฉพาะเมื่อมากกว่า 1
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      }),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        handleIncrease,
        handleDecrease,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
