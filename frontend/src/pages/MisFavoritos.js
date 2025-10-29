import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavoritos } from '../context/FavoritosContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const MisFavoritos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favoritos, loading, removeFavorito } = useFavoritos();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleRemoveFavorito = async (productoId) => {
    await removeFavorito(productoId);
  };

  const handleAddToCart = async (producto) => {
    // Verificar si el producto tiene variantes activas
    if (!producto.producto || !producto.producto.activo) {
      toast.error('Este producto no está disponible');
      return;
    }

    // Por simplicidad, agregamos el producto sin especificar variante
    // En una implementación completa, deberíamos redirigir al detalle del producto
    navigate(`/productos/${producto.productoId}`);
  };

  const handleViewProduct = (productoId) => {
    navigate(`/productos/${productoId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Favoritos
      </Typography>

      {favoritos.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <FavoriteBorderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes productos favoritos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Explora nuestro catálogo y agrega productos a tus favoritos para encontrarlos fácilmente
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/productos')}
            >
              Explorar Productos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Tienes {favoritos.length} producto{favoritos.length !== 1 ? 's' : ''} en favoritos
          </Typography>

          <Grid container spacing={3}>
            {favoritos.map((favorito) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={favorito.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Imagen del producto */}
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {favorito.productoImagen ? (
                      <img
                        src={favorito.productoImagen}
                        alt={favorito.productoNombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin imagen
                      </Typography>
                    )}
                    
                    {/* Botón de favorito */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        }
                      }}
                      onClick={() => handleRemoveFavorito(favorito.productoId)}
                      color="error"
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </CardMedia>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Información del producto */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {favorito.productoNombre}
                      </Typography>
                      
                      {favorito.producto?.categoriaNombre && (
                        <Chip
                          label={favorito.producto.categoriaNombre}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      )}

                      {favorito.productoDescripcion && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2
                          }}
                        >
                          {favorito.productoDescripcion}
                        </Typography>
                      )}

                      {!favorito.productoActivo && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          Producto no disponible
                        </Alert>
                      )}
                    </Box>

                    {/* Botones de acción */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewProduct(favorito.productoId)}
                        size="small"
                        fullWidth
                      >
                        Ver
                      </Button>
                      
                      {favorito.productoActivo && (
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => handleAddToCart(favorito)}
                          size="small"
                          fullWidth
                        >
                          Comprar
                        </Button>
                      )}
                    </Box>

                    {/* Fecha de agregado */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, textAlign: 'center' }}
                    >
                      Agregado: {new Date(favorito.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default MisFavoritos;
