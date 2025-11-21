import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* Panel Izquierdo - Información */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              lineHeight: 1.2
            }}
          >
            Equipamiento
            <br />
            Médico
            <br />
            de Calidad
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              lineHeight: 1.6,
              fontWeight: 300
            }}
          >
            Todo lo que necesitas para tu práctica profesional
          </Typography>
        </Box>

        {/* Decoración de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(60px)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            filter: 'blur(80px)'
          }}
        />
      </Box>

      {/* Panel Derecho - Formulario */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.8 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: 'white'
        }}
      >
        <Container maxWidth="xs">
          {/* Botón Cerrar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'text.primary'
              }}
            >
              Bienvenido
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Inicia sesión para continuar
            </Typography>
          </Box>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#667eea'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#667eea'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link
                component={RouterLink}
                to="#"
                sx={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            <Button
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: 3,
                py: 1.8,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                mb: 3,
                '&:hover': {
                  backgroundColor: '#333'
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: 'white'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
            </Button>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                o
              </Typography>
            </Divider>

            {/* Botones de OAuth (opcional) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
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
                  <Box
                    component="img"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='%23FBBC04' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.9 16.46 0 20.12 0 24c0 3.88.9 7.54 2.55 10.78l7.98-6.19z'/%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.55 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3C/svg%3E"
                    sx={{ width: 20, height: 20 }}
                  />
                }
              >
                Continuar con Google
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿Primera vez aquí?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: '#667eea',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Crear una cuenta
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
