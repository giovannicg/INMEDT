import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/carrito');
      setCart(response.data);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error al obtener carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (unidadVentaId, cantidad) => {
    try {
      setLoading(true);
      const response = await axios.post('/carrito/items', {
        unidadVentaId,
        cantidad
      });
      setCart(response.data);
      setCartItems(response.data.items || []);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error al agregar al carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, cantidad) => {
    try {
      setLoading(true);
      const response = await axios.put(`/carrito/items/${itemId}`, {
        cantidad
      });
      setCart(response.data);
      setCartItems(response.data.items || []);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error al actualizar carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/carrito/items/${itemId}`);
      setCart(response.data);
      setCartItems(response.data.items || []);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error al eliminar del carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await axios.delete('/carrito');
      setCart(response.data);
      setCartItems([]);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error al limpiar carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart?.total || 0;
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
