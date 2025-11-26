import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  TextField,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  LocalShipping
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Carrito = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    loading,
    updateCartItem,
    removeFromCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await updateCartItem(itemId, newQuantity);
    if (result.success) {
      toast.success('Cantidad actualizada');
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success('Producto eliminado del carrito');
    } else {
      toast.error(result.message);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    navigate('/checkout');
  };

  // Calcular IVA (15% solo sobre el subtotal de productos)
  const calcularIVA = () => {
    const subtotal = getCartTotal();
    return subtotal * 0.15;
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Carrito
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/productos')}
          >
            Ir a Productos
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
                        {item.unidadVenta.productoNombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.unidadVenta.varianteNombre} - {item.unidadVenta.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SKU: {item.unidadVenta.sku}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={2}>
                      <Typography variant="h6" color="primary">
                        ${item.precioUnitario.toFixed(2)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.cantidad}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            handleQuantityChange(item.id, newQuantity);
                          }}
                          sx={{ width: 60 }}
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={1}>
                      <Typography variant="h6" color="primary">
                        ${item.subtotal.toFixed(2)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={1}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen del Pedido
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({getCartItemsCount()} productos)</Typography>
                  <Typography>${getCartTotal().toFixed(2)}</Typography>
                </Box>
                
                {/* Notificación de envío */}
                {getCartTotal() < 40 ? (
                  <>
                    <Alert 
                      severity="info" 
                      icon={<LocalShipping />}
                      sx={{ mb: 2, mt: 1 }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        ¡Agrega ${(40 - getCartTotal()).toFixed(2)} más para envío GRATIS!
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        El costo de envío se calculará según tu ubicación en el checkout
                        (Quito: $2.99, Fuera de Quito: $3.99)
                      </Typography>
                    </Alert>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Envío</Typography>
                      <Typography color="text.secondary">Se calcula en checkout</Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Envío</Typography>
                    <Typography color="success.main" fontWeight={500}>
                      ¡GRATIS! 🎉
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>IVA (15%)</Typography>
                  <Typography>${calcularIVA().toFixed(2)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total estimado</Typography>
                  <Typography variant="h6" color="primary">
                    ${(getCartTotal() + calcularIVA()).toFixed(2)}
                    {getCartTotal() < 40 && <Typography variant="caption" color="text.secondary"> + envío</Typography>}
                  </Typography>
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  sx={{ mt: 2 }}
                >
                  Proceder al Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Carrito;
