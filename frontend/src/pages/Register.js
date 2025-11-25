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
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rucCedula: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const result = await register({
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      rucCedula: formData.rucCedula && formData.rucCedula.trim() !== '' ? formData.rucCedula : ''
    });
    
    if (result.success) {
      toast.success('¡Registro exitoso! Bienvenido');
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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
            Únete a
            <br />
            INMEDT
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              lineHeight: 1.6,
              fontWeight: 300
            }}
          >
            Crea tu cuenta y accede a productos médicos de calidad profesional
          </Typography>
        </Box>

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
          backgroundColor: 'white',
          overflowY: 'auto'
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
              Crear Cuenta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Completa tus datos para comenzar
            </Typography>
          </Box>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#f093fb'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f093fb'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#f093fb'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f093fb'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="RUC o Cédula (opcional)"
              name="rucCedula"
              value={formData.rucCedula}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#f093fb'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f093fb'
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
                    borderColor: '#f093fb'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f093fb'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              placeholder="Confirmar contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#f8f8f8',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#f093fb'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f093fb'
                  }
                }
              }}
            />

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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear cuenta'}
            </Button>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                o
              </Typography>
            </Divider>

            {/* Botón de Google OAuth */}
            <Box sx={{ mb: 3 }}>
              <GoogleLoginButton fullWidth text="Continuar con Google" />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#f093fb',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Iniciar sesión
                </Link>
              </Typography>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 3,
                lineHeight: 1.6
              }}
            >
              Al crear una cuenta, aceptas nuestros{' '}
              <Link href="#" sx={{ color: '#f093fb', textDecoration: 'none' }}>
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link href="#" sx={{ color: '#f093fb', textDecoration: 'none' }}>
                Política de Privacidad
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
