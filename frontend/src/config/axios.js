import axios from 'axios';

// Configurar la URL base de axios desde variable de entorno o fallback a localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';
const baseURL = `${API_URL}/api`;
console.log('🔧 Axios baseURL:', baseURL);

// URL para imágenes (CON /api porque el context path es /api)
export const API_BASE_URL = API_URL;
export const IMAGES_URL = `${API_URL}/api`;

/**
 * Helper para obtener la URL completa de una imagen
 * Si la imagen ya es una URL completa (Cloudinary), la retorna tal cual
 * Si es una ruta relativa (almacenamiento local), agrega IMAGES_URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si ya es una URL completa (empieza con http:// o https://), retornarla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si es una ruta relativa, agregar IMAGES_URL
  return `${IMAGES_URL}${imagePath}`;
};

// Crear instancia de axios con configuración personalizada
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar el token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
