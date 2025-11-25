import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import {
  NavigateNext,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart,
  LocalShipping,
  VerifiedUser,
  ExpandMore,
  Add,
  Remove,
  ArrowBack
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavoritos } from '../context/FavoritosContext';
import { toast } from 'react-toastify';
import axios, { getImageUrl } from '../config/axios';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleFavorito, isFavorito } = useFavoritos();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariante, setSelectedVariante] = useState(null);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProducto();
  }, [id]);

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

  const handleVarianteChange = (variante) => {
    setSelectedVariante(variante);
    if (variante.unidadesVenta && variante.unidadesVenta.length > 0) {
      setSelectedUnidad(variante.unidadesVenta[0]);
    } else {
      setSelectedUnidad(null);
    }
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

  const images = [
    producto?.imagenPrincipal,
    ...(producto?.imagenesGaleria || [])
  ].filter(Boolean);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton width="60%" height={40} sx={{ mb: 2 }} />
            <Skeleton width="100%" height={30} sx={{ mb: 2 }} />
            <Skeleton width="80%" height={60} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!producto) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Producto no encontrado
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/productos')}
          sx={{ mt: 2 }}
        >
          Volver a Productos
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: '#667eea' }
            }}
          >
            Inicio
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/productos')}
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: '#667eea' }
            }}
          >
            Productos
          </Link>
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            {producto.nombre}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Galería de Imágenes */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Imagen Principal */}
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  mb: 2,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  aspectRatio: '1/1'
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={getImageUrl(images[selectedImage])}
                    alt={producto.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3 }} />
                  </Box>
                )}
              </Box>

              {/* Miniaturas */}
              {images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
                  {images.map((img, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        minWidth: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '3px solid',
                        borderColor: selectedImage === index ? '#667eea' : 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: '#667eea',
                          opacity: 0.8
                        }
                      }}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Vista ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Información del Producto */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}
            >
              {/* Badge NEW */}
              {producto.activo && (
                <Chip
                  label="DISPONIBLE"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(67, 233, 123, 0.15)',
                    color: '#43e97b',
                    fontWeight: 700,
                    mb: 2
                  }}
                />
              )}

              {/* Título y Favorito */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  component="h1"
                  fontWeight="bold"
                  sx={{ pr: 2, lineHeight: 1.2 }}
                >
                  {producto.nombre}
                </Typography>
                <IconButton
                  onClick={handleToggleFavorito}
                  sx={{
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {isFavorito(producto.id) ? (
                    <FavoriteIcon sx={{ color: '#f093fb' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: '#667eea' }} />
                  )}
                </IconButton>
              </Box>

              {/* Categoría y Marca */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {producto.categoriaNombre && (
                  <Chip
                    label={producto.categoriaNombre}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      fontWeight: 600
                    }}
                  />
                )}
                {producto.marca && (
                  <Chip
                    label={producto.marca}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              {/* Descripción */}
              {producto.descripcion && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.7 }}
                >
                  {producto.descripcion}
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Variantes */}
              {producto.variantes && producto.variantes.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Selecciona una presentación
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {producto.variantes.map((variante) => (
                      <Chip
                        key={variante.id}
                        label={variante.nombre}
                        onClick={() => handleVarianteChange(variante)}
                        sx={{
                          fontSize: '0.95rem',
                          py: 2.5,
                          px: 2,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          ...(selectedVariante?.id === variante.id
                            ? {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                                }
                              }
                            : {
                                backgroundColor: 'rgba(0,0,0,0.04)',
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  transform: 'translateY(-2px)'
                                }
                              })
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Unidades de Venta */}
              {selectedVariante && selectedVariante.unidadesVenta && selectedVariante.unidadesVenta.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Selecciona cantidad
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedVariante.unidadesVenta.map((unidad) => (
                      <Box
                        key={unidad.id}
                        onClick={() => setSelectedUnidad(unidad)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: selectedUnidad?.id === unidad.id ? '#667eea' : 'divider',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: selectedUnidad?.id === unidad.id
                            ? 'rgba(102, 126, 234, 0.05)'
                            : 'transparent',
                          '&:hover': {
                            borderColor: '#667eea',
                            transform: 'translateX(5px)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {unidad.descripcion}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              SKU: {unidad.sku}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              ${unidad.precio?.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color={unidad.stock > 10 ? 'success.main' : 'warning.main'}>
                              Stock: {unidad.stock}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Cantidad */}
              {selectedUnidad && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Cantidad
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <IconButton
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        disabled={cantidad <= 1}
                        sx={{ borderRadius: 0 }}
                      >
                        <Remove />
                      </IconButton>
                      <Typography
                        sx={{
                          minWidth: 60,
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}
                      >
                        {cantidad}
                      </Typography>
                      <IconButton
                        onClick={() => setCantidad(Math.min(selectedUnidad.stock, cantidad + 1))}
                        disabled={cantidad >= selectedUnidad.stock}
                        sx={{ borderRadius: 0 }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Máximo: {selectedUnidad.stock}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Botón Agregar al Carrito */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!selectedUnidad || addingToCart || selectedUnidad?.stock === 0}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #ccc 0%, #999 100%)'
                  }
                }}
              >
                {addingToCart ? 'Agregando...' : 'Agregar al Carrito'}
              </Button>

              {/* Beneficios */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LocalShipping sx={{ color: '#667eea' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Envío Rápido
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Entrega en 24-48 horas
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VerifiedUser sx={{ color: '#43e97b' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Producto Certificado
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calidad garantizada
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Información Adicional */}
            <Box sx={{ mt: 3 }}>
              <Accordion
                sx={{
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="bold">Detalles del Producto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {producto.descripcion || 'Información detallada del producto próximamente.'}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="bold">Envío y Devoluciones</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Envío gratis en compras superiores a $50
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    • Entregas en 24-48 horas en Quito
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Devoluciones aceptadas dentro de 30 días
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductoDetalle;
