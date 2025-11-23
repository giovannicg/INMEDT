import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleLoginButton = ({ fullWidth = false, text = "Continuar con Google" }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Cargar el script de Google Identity Services
    if (googleClientId && googleClientId !== 'dummy-client-id') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [googleClientId]);

  const handleGoogleResponse = async (response) => {
    try {
      // Enviar el token al backend
      const result = await axios.post('/auth/google', {
        idToken: response.credential
      });

      // Guardar el token y la información del usuario
      localStorage.setItem('token', result.data.token);
      
      // Actualizar el contexto del usuario
      setUser({
        id: result.data.id,
        nombre: result.data.nombre,
        email: result.data.email,
        role: result.data.role
      });

      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      toast.error(error.response?.data || 'Error al iniciar sesión con Google');
    }
  };

  const handleGoogleLogin = () => {
    if (!googleClientId || googleClientId === 'dummy-client-id') {
      toast.info('La autenticación con Google no está configurada aún. Por favor, usa el login normal.');
      return;
    }

    // Inicializar Google Identity Services
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.prompt(); // Mostrar el One Tap
    } else {
      toast.error('Google Identity Services no está disponible');
    }
  };

  return (
    <Button
      fullWidth={fullWidth}
      variant="outlined"
      onClick={handleGoogleLogin}
      sx={{
        borderRadius: 3,
        py: 1.5,
        borderColor: '#ddd',
        color: 'text.primary',
        textTransform: 'none',
        fontWeight: 500,
        '&:hover': {
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.04)'
        }
      }}
      startIcon={
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="#FBBC04" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.9 16.46 0 20.12 0 24c0 3.88.9 7.54 2.55 10.78l7.98-6.19z"/>
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.55 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        </svg>
      }
    >
      {text}
    </Button>
  );
};

export default GoogleLoginButton;

