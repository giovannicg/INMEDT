import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavoritos } from '../context/FavoritosContext';
import { toast } from 'react-toastify';
import axios from '../config/axios';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorito, isFavorito } = useFavoritos();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariante, setSelectedVariante] = useState(null);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProducto = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/productos/${id}`);
      setProducto(response.data);
      
      // Seleccionar primera variante y primera unidad por defecto
      if (response.data.variantes && response.data.variantes.length > 0) {
        const primeraVariante = response.data.variantes[0];
        setSelectedVariante(primeraVariante);
        
        if (primeraVariante.unidadesVenta && primeraVariante.unidadesVenta.length > 0) {
          setSelectedUnidad(primeraVariante.unidadesVenta[0]);
        }
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
      toast.error('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducto();
  }, [id]);

  const handleVarianteChange = (variante) => {
    console.log('🔄 Variante seleccionada:', variante);
    setSelectedVariante(variante);
    if (variante.unidadesVenta && variante.unidadesVenta.length > 0) {
      setSelectedUnidad(variante.unidadesVenta[0]);
      console.log('🔄 Primera unidad auto-seleccionada:', variante.unidadesVenta[0]);
    } else {
      setSelectedUnidad(null);
    }
  };

  const handleUnidadChange = (unidad, event) => {
    event.stopPropagation(); // Evitar que se propague al Card de la variante
    setSelectedUnidad(unidad);
    console.log('🔄 Unidad seleccionada:', unidad);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    if (!selectedUnidad) {
      toast.error('Selecciona una unidad de venta');
      return;
    }

    if (cantidad > selectedUnidad.stock) {
      toast.error('No hay suficiente stock');
      return;
    }

    try {
      setAddingToCart(true);
      const result = await addToCart(selectedUnidad.id, cantidad);
      
      if (result.success) {
        toast.success('Producto agregado al carrito');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error al agregar al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorito = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para gestionar favoritos');
      navigate('/login');
      return;
    }

    await toggleFavorito(producto.id);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!producto) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Producto no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {producto.nombre}
                </Typography>
                <Tooltip title={isFavorito(producto.id) ? "Remover de favoritos" : "Agregar a favoritos"}>
                  <IconButton
                    onClick={handleToggleFavorito}
                    color={isFavorito(producto.id) ? "error" : "default"}
                    size="large"
                  >
                    {isFavorito(producto.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Chip label={producto.categoriaNombre} color="primary" sx={{ mr: 1 }} />
                <Chip label={producto.marca} variant="outlined" />
              </Box>
              
              <Typography variant="body1" paragraph>
                {producto.descripcion}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Variantes Disponibles
              </Typography>
              
              {producto.variantes && producto.variantes.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  {producto.variantes.map((variante) => (
                    <Card
                      key={variante.id}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        border: selectedVariante?.id === variante.id ? 2 : 1,
                        borderColor: selectedVariante?.id === variante.id ? 'primary.main' : 'grey.300'
                      }}
                      onClick={() => handleVarianteChange(variante)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {variante.nombre}
                        </Typography>
                        {variante.descripcion && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {variante.descripcion}
                          </Typography>
                        )}
                        
                        {selectedVariante?.id === variante.id && variante.unidadesVenta && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Unidades de Venta:
                            </Typography>
                            <Grid container spacing={1}>
                              {variante.unidadesVenta.map((unidad) => (
                                <Grid item xs={12} sm={6} md={4} key={unidad.id}>
                                  <Card
                                    sx={{
                                      cursor: 'pointer',
                                      border: selectedUnidad?.id === unidad.id ? 2 : 1,
                                      borderColor: selectedUnidad?.id === unidad.id ? 'primary.main' : 'grey.300',
                                      backgroundColor: selectedUnidad?.id === unidad.id ? 'primary.50' : 'white'
                                    }}
                                    onClick={(event) => handleUnidadChange(unidad, event)}
                                  >
                                    <CardContent sx={{ p: 2 }}>
                                      <Typography variant="subtitle2" gutterBottom>
                                        {unidad.descripcion}
                                      </Typography>
                                      <Typography variant="h6" color="primary">
                                        ${unidad.precio.toFixed(2)}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Stock: {unidad.stock}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">
                  No hay variantes disponibles para este producto
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agregar al Carrito
              </Typography>
              
              {selectedUnidad ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {selectedUnidad.descripcion}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      ${selectedUnidad.precio.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock disponible: {selectedUnidad.stock}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Typography variant="body1">Cantidad:</Typography>
                    <TextField
                      type="number"
                      value={cantidad}
                      onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                      inputProps={{ min: 1, max: selectedUnidad.stock }}
                      sx={{ width: 80 }}
                    />
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={addingToCart || cantidad > selectedUnidad.stock}
                    sx={{ mb: 2 }}
                  >
                    {addingToCart ? <CircularProgress size={24} /> : 'Agregar al Carrito'}
                  </Button>
                  
                  <Typography variant="h6" color="primary" align="center">
                    Total: ${(selectedUnidad.precio * cantidad).toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Alert severity="warning">
                  Selecciona una variante y unidad de venta
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductoDetalle;
