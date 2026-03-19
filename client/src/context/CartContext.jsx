import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems({});
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cart/get");
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (err) {
      console.error("Fetch cart error", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      const res = await api.post("/api/cart/update", { productId, quantity });
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (err) {
      console.error("Update cart error", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete("/api/cart/clear");
      if (res.data.success) {
        setCartItems({});
      }
    } catch (err) {
      console.error("Clear cart error", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCart, clearCart, fetchCart, loading }}>
        {children}
    </CartContext.Provider>
  );
};
