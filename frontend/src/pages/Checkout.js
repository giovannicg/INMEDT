import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    direccionEnvio: '',
    telefonoContacto: '',
    notas: ''
  });
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Información de Envío', 'Confirmación', 'Pago'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (cartItems.length === 0) {
      navigate('/carrito');
    }
  }, [user, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.direccionEnvio.trim()) {
        toast.error('La dirección de envío es obligatoria');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post('/api/pedidos/checkout', formData);
      
      toast.success('¡Pedido realizado exitosamente!');
      await clearCart();
      navigate('/pedidos');
    } catch (error) {
      toast.error(error.response?.data || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de Envío
                </Typography>
                
                <TextField
                  fullWidth
                  label="Dirección de Envío *"
                  name="direccionEnvio"
                  value={formData.direccionEnvio}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Teléfono de Contacto"
                  name="telefonoContacto"
                  value={formData.telefonoContacto}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Notas Adicionales"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen del Pedido
                </Typography>
                
                {cartItems.map((item) => (
                  <Box key={item.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                    <Typography variant="subtitle1">
                      {item.unidadVenta.productoNombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.unidadVenta.varianteNombre} - {item.unidadVenta.descripcion}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography>
                        Cantidad: {item.cantidad}
                      </Typography>
                      <Typography variant="h6">
                        ${item.subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${getCartTotal().toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Información de Pago
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Por el momento, solo aceptamos pagos contra entrega. 
                  El pago se realizará al recibir el producto.
                </Alert>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Dirección de Envío:</strong><br />
                  {formData.direccionEnvio}
                </Typography>
                
                {formData.telefonoContacto && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Teléfono:</strong> {formData.telefonoContacto}
                  </Typography>
                )}
                
                {formData.notas && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Notas:</strong> {formData.notas}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Productos ({cartItems.length})</Typography>
                <Typography>${getCartTotal().toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Envío</Typography>
                <Typography>Gratis</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${getCartTotal().toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                {activeStep > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    fullWidth
                  >
                    Atrás
                  </Button>
                )}
                
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    fullWidth
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Confirmar Pedido'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
