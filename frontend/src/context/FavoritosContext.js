import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const FavoritosContext = createContext();

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe ser usado dentro de FavoritosProvider');
  }
  return context;
};

export const FavoritosProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar favoritos cuando el usuario se autentica
  useEffect(() => {
    if (user) {
      fetchFavoritos();
    } else {
      setFavoritos([]);
    }
  }, [user]);

  const fetchFavoritos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/favoritos');
      setFavoritos(response.data);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      // No mostrar error toast aquí, es normal no tener favoritos
    } finally {
      setLoading(false);
    }
  };

  const addFavorito = async (productoId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return false;
    }

    try {
      const response = await axios.post(`/favoritos/${productoId}`);
      setFavoritos(prev => [...prev, response.data]);
      toast.success('Producto agregado a favoritos');
      return true;
    } catch (error) {
      toast.error(error.response?.data || 'Error al agregar a favoritos');
      return false;
    }
  };

  const removeFavorito = async (productoId) => {
    if (!user) return false;

    try {
      await axios.delete(`/favoritos/${productoId}`);
      setFavoritos(prev => prev.filter(fav => fav.productoId !== productoId));
      toast.success('Producto removido de favoritos');
      return true;
    } catch (error) {
      toast.error(error.response?.data || 'Error al remover de favoritos');
      return false;
    }
  };

  const toggleFavorito = async (productoId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para gestionar favoritos');
      return false;
    }

    try {
      const response = await axios.post(`/favoritos/${productoId}/toggle`);
      
      if (response.data.action === 'added') {
        setFavoritos(prev => [...prev, response.data.favorito]);
        toast.success('Producto agregado a favoritos');
      } else {
        setFavoritos(prev => prev.filter(fav => fav.productoId !== productoId));
        toast.success('Producto removido de favoritos');
      }
      
      return response.data.action === 'added';
    } catch (error) {
      toast.error(error.response?.data || 'Error al gestionar favorito');
      return false;
    }
  };

  const isFavorito = (productoId) => {
    return favoritos.some(fav => fav.productoId === productoId);
  };

  const getFavoritosCount = () => {
    return favoritos.length;
  };

  const clearFavoritos = () => {
    setFavoritos([]);
  };

  const value = {
    favoritos,
    loading,
    addFavorito,
    removeFavorito,
    toggleFavorito,
    isFavorito,
    getFavoritosCount,
    clearFavoritos,
    fetchFavoritos
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};

export default FavoritosContext;
