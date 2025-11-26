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
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from '../config/axios';
import { Add as AddIcon, Home as HomeIcon, Star as StarIcon } from '@mui/icons-material';

const SECTORES_QUITO = [
  // Parroquias Urbanas (170101-170132)
  'Belisario Quevedo',
  'Carcelén',
  'Centro Histórico',
  'Cochapamba',
  'Comité del Pueblo',
  'Cotocollao',
  'Chilibulo',
  'Chillogallo',
  'Chimbacalle',
  'El Condado',
  'Guamaní',
  'Iñaquito',
  'Itchimbía',
  'Jipijapa',
  'Kennedy',
  'La Argelia',
  'La Concepción',
  'La Ecuatoriana',
  'La Ferroviaria',
  'La Libertad',
  'La Magdalena',
  'La Mena',
  'Mariscal Sucre',
  'Ponceano',
  'Puengasí',
  'Quitumbe',
  'Rumipamba',
  'San Bartolo',
  'San Isidro del Inca',
  'San Juan',
  'Solanda',
  'Turubamba',
  
  // Parroquias Rurales/Suburbanas (170151-170187)
  'Alangasí',
  'Amaguaña',
  'Atahualpa',
  'Calacalí',
  'Calderón',
  'Conocoto',
  'Cumbayá',
  'Chavezpamba',
  'Checa',
  'El Quinche',
  'Gualea',
  'Guangopolo',
  'Guayllabamba',
  'La Merced',
  'Llano Chico',
  'Lloa',
  'Mindo',
  'Nanegal',
  'Nanegalito',
  'Nayón',
  'Nono',
  'Pacto',
  'Pedro Vicente Maldonado',
  'Perucho',
  'Pifo',
  'Píntag',
  'Pomasqui',
  'Puéllaro',
  'Puembo',
  'Puerto Quito',
  'San Antonio',
  'San José de Minas',
  'San Miguel de los Bancos',
  'Tababela',
  'Tumbaco',
  'Yaruquí',
  'Zámbiza'
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    direccionEnvio: '',
    telefonoContacto: '',
    ciudad: 'Quito',
    sector: '',
    notas: ''
  });
  const [activeStep, setActiveStep] = useState(0);
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState(null);
  const [showNewDireccionForm, setShowNewDireccionForm] = useState(false);
  const [loadingDirecciones, setLoadingDirecciones] = useState(false);

  const steps = ['Información de Envío', 'Confirmación', 'Pago'];
  
  // Calcular costo de envío
  const calcularCostoEnvio = () => {
    const subtotal = getCartTotal();
    
    // Envío gratis si el total es mayor o igual a $40
    if (subtotal >= 40) {
      return 0;
    }
    
    // Si no hay sector seleccionado, retornar el costo máximo como estimación
    if (!formData.sector) {
      return 3.99;
    }
    
    // Verificar si el sector está en la lista de Quito
    const esQuito = SECTORES_QUITO.some(s => s.toLowerCase() === formData.sector.toLowerCase());
    
    return esQuito ? 2.99 : 3.99;
  };
  
  // Calcular IVA (15% solo sobre el subtotal de productos)
  const calcularIVA = () => {
    const subtotal = getCartTotal();
    return subtotal * 0.15;
  };
  
  const calcularTotal = () => {
    return getCartTotal() + calcularIVA() + calcularCostoEnvio();
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/carrito');
      return;
    }
    fetchDirecciones();
  }, [user, cartItems, navigate]);

  const fetchDirecciones = async () => {
    try {
      setLoadingDirecciones(true);
      const response = await axios.get('/direcciones');
      setDirecciones(response.data);
      
      // Seleccionar automáticamente la dirección principal si existe
      const direccionPrincipal = response.data.find(d => d.esPrincipal);
      if (direccionPrincipal && !selectedDireccion) {
        handleSelectDireccion(direccionPrincipal);
      }
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      // No mostrar error si no hay direcciones, es normal para usuarios nuevos
    } finally {
      setLoadingDirecciones(false);
    }
  };

  const handleSelectDireccion = (direccion) => {
    setSelectedDireccion(direccion);
    setFormData({
      ...formData,
      direccionEnvio: direccion.direccion,
      telefonoContacto: direccion.telefono || '',
      ciudad: direccion.ciudad,
      sector: direccion.sector,
      // Mantener las notas del usuario
      notas: formData.notas
    });
    setShowNewDireccionForm(false);
  };

  const handleNewDireccion = () => {
    setSelectedDireccion(null);
    setFormData({
      direccionEnvio: '',
      telefonoContacto: '',
      ciudad: 'Quito',
      sector: '',
      notas: formData.notas
    });
    setShowNewDireccionForm(true);
  };

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
      if (!formData.ciudad.trim()) {
        toast.error('La ciudad es obligatoria');
        return;
      }
      if (!formData.sector.trim()) {
        toast.error('El sector es obligatorio');
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
      await axios.post('/pedidos/checkout', formData);
      
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

                {/* Sección de direcciones guardadas */}
                {!loadingDirecciones && direcciones.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Selecciona una dirección guardada:
                    </Typography>
                    <RadioGroup
                      value={selectedDireccion?.id || ''}
                      onChange={(e) => {
                        const direccion = direcciones.find(d => d.id === parseInt(e.target.value));
                        if (direccion) handleSelectDireccion(direccion);
                      }}
                    >
                      {direcciones.map((direccion) => (
                        <FormControlLabel
                          key={direccion.id}
                          value={direccion.id}
                          control={<Radio />}
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2">
                                  {direccion.nombre}
                                </Typography>
                                {direccion.esPrincipal && (
                                  <Chip
                                    icon={<StarIcon />}
                                    label="Principal"
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {direccion.direccion}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {direccion.sector}, {direccion.ciudad}
                              </Typography>
                              {direccion.telefono && (
                                <Typography variant="body2" color="text.secondary">
                                  Tel: {direccion.telefono}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={handleNewDireccion}
                      sx={{ mt: 2 }}
                      variant={showNewDireccionForm ? "contained" : "outlined"}
                    >
                      {showNewDireccionForm ? "Usando nueva dirección" : "Usar nueva dirección"}
                    </Button>
                  </Box>
                )}

                {/* Formulario para nueva dirección o cuando no hay direcciones guardadas */}
                {(showNewDireccionForm || direcciones.length === 0) && (
                  <Box>
                    {direcciones.length === 0 && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          No tienes direcciones guardadas. Completa la información de envío:
                        </Typography>
                      </Alert>
                    )}
                    
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
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Ciudad *</InputLabel>
                          <Select
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            label="Ciudad *"
                          >
                            <MenuItem value="Quito">Quito</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Sector *</InputLabel>
                          <Select
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            label="Sector *"
                          >
                            {SECTORES_QUITO.map((sector) => (
                              <MenuItem key={sector} value={sector}>
                                {sector}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Notas adicionales - siempre visible */}
                <TextField
                  fullWidth
                  label="Notas Adicionales"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  sx={{ mt: 2 }}
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${getCartTotal().toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Envío</Typography>
                  {calcularCostoEnvio() === 0 ? (
                    <Typography color="success.main" fontWeight={500}>
                      ¡GRATIS!
                    </Typography>
                  ) : (
                    <Typography>
                      ${calcularCostoEnvio().toFixed(2)}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${calcularTotal().toFixed(2)}
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
                
                <Typography variant="body1" gutterBottom>
                  <strong>Ciudad:</strong> {formData.ciudad}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Sector:</strong> {formData.sector}
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
                <Typography>Subtotal ({cartItems.length} productos)</Typography>
                <Typography>${getCartTotal().toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Envío</Typography>
                {calcularCostoEnvio() === 0 ? (
                  <Typography color="success.main" fontWeight={500}>
                    ¡GRATIS!
                  </Typography>
                ) : (
                  <Typography>
                    ${calcularCostoEnvio().toFixed(2)}
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>IVA (15%)</Typography>
                <Typography>
                  ${calcularIVA().toFixed(2)}
                </Typography>
              </Box>
              
              {calcularCostoEnvio() === 0 && getCartTotal() >= 40 && (
                <Alert severity="success" sx={{ mb: 2, mt: 1 }}>
                  <Typography variant="body2">
                    ¡Felicidades! Tu pedido califica para envío GRATIS 🎉
                  </Typography>
                </Alert>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${calcularTotal().toFixed(2)}
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
