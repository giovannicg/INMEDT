import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Fade
} from '@mui/material';
import {
  ExpandMore,
  LocalShipping,
  LocationOn,
  Phone,
  Receipt,
  CheckCircle,
  AccessTime,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const Pedidos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchPedidos();
    }
  }, [user, navigate]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/pedidos/all');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoConfig = (estado) => {
    const configs = {
      PENDIENTE: { 
        color: '#ffa000', 
        bg: 'rgba(255, 160, 0, 0.1)', 
        icon: <AccessTime />,
        label: 'Pendiente'
      },
      CONFIRMADO: { 
        color: '#4facfe', 
        bg: 'rgba(79, 172, 254, 0.1)', 
        icon: <CheckCircle />,
        label: 'Confirmado'
      },
      EN_PROCESO: { 
        color: '#667eea', 
        bg: 'rgba(102, 126, 234, 0.1)', 
        icon: <LocalShipping />,
        label: 'En Proceso'
      },
      ENVIADO: { 
        color: '#43e97b', 
        bg: 'rgba(67, 233, 123, 0.1)', 
        icon: <LocalShipping />,
        label: 'Enviado'
      },
      ENTREGADO: { 
        color: '#43e97b', 
        bg: 'rgba(67, 233, 123, 0.15)', 
        icon: <CheckCircle />,
        label: 'Entregado'
      },
      CANCELADO: { 
        color: '#f5576c', 
        bg: 'rgba(245, 87, 108, 0.1)', 
        icon: <Cancel />,
        label: 'Cancelado'
      }
    };
    return configs[estado] || configs.PENDIENTE;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: 3,
            p: 4,
            mb: 4,
            color: 'white'
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Mis Pedidos
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Historial completo de tus compras
          </Typography>
        </Box>

        {pedidos.length === 0 ? (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              textAlign: 'center',
              py: 8
            }}
          >
            <Receipt sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes pedidos aún
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cuando realices una compra, aparecerá aquí
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {pedidos.map((pedido, index) => {
              const estadoConfig = getEstadoConfig(pedido.estado);
              return (
                <Grid item xs={12} key={pedido.id}>
                  <Fade in={true} timeout={300 + index * 50}>
                    <Accordion
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:before': { display: 'none' },
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                          borderColor: estadoConfig.color
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          px: 3,
                          py: 2,
                          '& .MuiAccordionSummary-content': {
                            my: 2
                          }
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Pedido
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              #{pedido.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(pedido.createdAt).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Total
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              ${pedido.total.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Estado
                            </Typography>
                            <Chip
                              icon={estadoConfig.icon}
                              label={estadoConfig.label}
                              sx={{
                                backgroundColor: estadoConfig.bg,
                                color: estadoConfig.color,
                                fontWeight: 600,
                                border: '1px solid',
                                borderColor: estadoConfig.color + '30'
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Items
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {pedido.items?.length || 0} producto(s)
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionSummary>

                      <AccordionDetails sx={{ px: 3, pb: 3 }}>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                          {/* Información de Envío */}
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                border: '1px solid',
                                borderColor: 'rgba(102, 126, 234, 0.2)'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocalShipping sx={{ color: '#667eea' }} />
                                <Typography variant="subtitle1" fontWeight="bold">
                                  Información de Envío
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                  <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                                  <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                      {pedido.direccionEnvio}
                                    </Typography>
                                    {pedido.ciudad && pedido.sector && (
                                      <Typography variant="caption" color="text.secondary">
                                        {pedido.sector}, {pedido.ciudad}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>

                                {pedido.telefonoContacto && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                      {pedido.telefonoContacto}
                                    </Typography>
                                  </Box>
                                )}

                                {pedido.notas && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                      Notas:
                                    </Typography>
                                    <Typography variant="body2">
                                      {pedido.notas}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Grid>

                          {/* Detalles del Pedido */}
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: 'rgba(79, 172, 254, 0.05)',
                                border: '1px solid',
                                borderColor: 'rgba(79, 172, 254, 0.2)'
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Resumen
                              </Typography>

                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Fecha del pedido
                                  </Typography>
                                  <Typography variant="body2" fontWeight={500}>
                                    {new Date(pedido.createdAt).toLocaleString()}
                                  </Typography>
                                </Box>

                                {pedido.updatedAt && pedido.updatedAt !== pedido.createdAt && (
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Última actualización
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                      {new Date(pedido.updatedAt).toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}

                                <Divider sx={{ my: 1 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2">
                                    Subtotal
                                  </Typography>
                                  <Typography variant="body2">
                                    ${pedido.subtotal?.toFixed(2) || pedido.total.toFixed(2)}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">
                                    Envío
                                  </Typography>
                                  <Typography variant="body2" color={pedido.costoEnvio === 0 ? "success.main" : "inherit"} fontWeight={pedido.costoEnvio === 0 ? 500 : 400}>
                                    {pedido.costoEnvio === 0 ? "¡GRATIS!" : `$${pedido.costoEnvio?.toFixed(2) || '0.00'}`}
                                  </Typography>
                                </Box>
                                
                                <Divider sx={{ my: 1 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body1" fontWeight="bold">
                                    Total
                                  </Typography>
                                  <Typography variant="h6" fontWeight="bold" color="primary">
                                    ${pedido.total.toFixed(2)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Items del Pedido */}
                          {pedido.items && pedido.items.length > 0 && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Productos
                              </Typography>
                              <TableContainer
                                sx={{
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'divider'
                                }}
                              >
                                <Table size="small">
                                  <TableBody>
                                    {pedido.items.map((item, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          <Typography variant="body2" fontWeight={500}>
                                            {item.unidadVenta?.productoNombre || 'Producto'}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {item.unidadVenta?.varianteNombre && `${item.unidadVenta.varianteNombre} - `}
                                            {item.unidadVenta?.descripcion}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography variant="body2">
                                            x{item.cantidad}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography variant="body2" fontWeight="bold">
                                            ${item.precioUnitario.toFixed(2)}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography variant="body2" fontWeight="bold" color="primary">
                                            ${item.subtotal.toFixed(2)}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Pedidos;
