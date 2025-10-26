import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Aquí podrías hacer una llamada para obtener los datos del usuario
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, userId, nombre, email: userEmail, role } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({
        id: userId,
        nombre,
        email: userEmail,
        role,
        token
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (nombre, email, password, rucCedula) => {
    try {
      const response = await axios.post('/api/auth/register', {
        nombre,
        email,
        password,
        rucCedula
      });
      const { token, userId, nombre: userName, email: userEmail, role } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
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
    delete axios.defaults.headers.common['Authorization'];
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
