import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import { Search, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/productos?size=6');
      setProductos(response.data.content);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          padding: 4,
          borderRadius: 2,
          mb: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          INMEDT
        </Typography>
        <Typography variant="h5" gutterBottom>
          Productos Médicos de Calidad
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Encuentra todo lo que necesitas para el cuidado de la salud
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <TextField
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<Search />}
                  >
                    Buscar
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Categorías */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Categorías
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {categorias.map((categoria) => (
          <Grid item xs={12} sm={6} md={3} key={categoria.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => navigate(`/productos?categoria=${categoria.id}`)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" component="h3">
                  {categoria.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {categoria.cantidadProductos} productos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Productos Destacados */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Productos Destacados
      </Typography>
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Typography>Cargando productos...</Typography>
          </Grid>
        ) : (
          productos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate(`/productos/${producto.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {producto.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {producto.marca}
                  </Typography>
                  <Chip
                    label={producto.categoriaNombre}
                    size="small"
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {producto.descripcion?.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/productos/${producto.id}`);
                    }}
                  >
                    Ver Detalles
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/productos')}
        >
          Ver Todos los Productos
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
