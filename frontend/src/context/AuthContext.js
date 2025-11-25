import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Hacer una llamada para obtener los datos del usuario actual
          const response = await axios.get('/auth/me');
          console.log('✅ Usuario inicializado:', response.data);
          const { userId, nombre, email, role } = response.data;

          setUser({
            id: userId,
            nombre,
            email,
            role,
            token
          });
        } catch (error) {
          console.error('❌ Error al inicializar usuario:', error);
          // Si el token es inválido, eliminarlo
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login con:', email);
      const response = await axios.post('/auth/login', { email, password });
      console.log('✅ Login exitoso:', response.data);
      const { token, userId, nombre, email: userEmail, role } = response.data;

      localStorage.setItem('token', token);

      setUser({
        id: userId,
        nombre,
        email: userEmail,
        role,
        token
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ Error response:', error.response);
      return {
        success: false,
        message: error.response?.data || 'Error al iniciar sesión'
      };
    }
  };

  const register = async ({ nombre, email, password, rucCedula }) => {
    try {
      const response = await axios.post('/auth/register', {
        nombre,
        email,
        password,
        rucCedula
      });
      const { token, userId, nombre: userName, email: userEmail, role } = response.data;

      localStorage.setItem('token', token);

      setUser({
        id: userId,
        nombre: userName,
        email: userEmail,
        role,
        token
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Error al registrarse'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
