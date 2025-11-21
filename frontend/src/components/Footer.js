import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de suscripción
    alert('¡Gracias por suscribirte!');
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Columna 1: Sobre Nosotros */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              INMEDT
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Tu proveedor confiable de equipamiento médico profesional.
              Calidad garantizada para tu práctica.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Columna 2: Enlaces Rápidos */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Enlaces Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/productos')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  textAlign: 'left',
                  '&:hover': { color: 'white' }
                }}
              >
                Productos
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/favoritos')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  textAlign: 'left',
                  '&:hover': { color: 'white' }
                }}
              >
                Mis Favoritos
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/pedidos')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  textAlign: 'left',
                  '&:hover': { color: 'white' }
                }}
              >
                Mis Pedidos
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/direcciones')}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  textAlign: 'left',
                  '&:hover': { color: 'white' }
                }}
              >
                Mis Direcciones
              </Link>
            </Box>
          </Grid>

          {/* Columna 3: Contacto */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  info@inmedt.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +593 (2) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Quito, Ecuador
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Columna 4: Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Mantente Informado
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Suscríbete para recibir ofertas y novedades
            </Typography>
            <Box component="form" onSubmit={handleSubscribe}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 1,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.6)',
                    opacity: 1
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: 'white',
                  color: '#1a1a1a',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Suscribirse
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} INMEDT. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                '&:hover': { color: 'white' }
              }}
            >
              Política de Privacidad
            </Link>
            <Link
              href="#"
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                '&:hover': { color: 'white' }
              }}
            >
              Términos y Condiciones
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

