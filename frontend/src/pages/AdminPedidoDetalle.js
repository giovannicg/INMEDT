import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  LocalShipping,
  CheckCircle,
  Cancel,
  Person,
  Phone,
  LocationOn,
  CalendarToday
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const AdminPedidoDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    estado: '',
    direccionEnvio: '',
    telefonoContacto: '',
    notas: '',
    ciudad: '',
    sector: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/login');
      return;
    }
    fetchPedido();
  }, [user, navigate, id]);

  const fetchPedido = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/pedidos/${id}`);
      setPedido(response.data);
    } catch (error) {
      console.error('Error al cargar pedido:', error);
      toast.error('Error al cargar el pedido');
      navigate('/admin/pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      estado: pedido.estado,
      direccionEnvio: pedido.direccionEnvio,
      telefonoContacto: pedido.telefonoContacto || '',
      notas: pedido.notas || '',
      ciudad: pedido.ciudad || '',
      sector: pedido.sector || ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateEstado = async () => {
    try {
      await axios.put(`/admin/pedidos/${pedido.id}/estado?estado=${formData.estado}`);
      toast.success('Estado actualizado exitosamente');
      handleCloseDialog();
      fetchPedido();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar estado');
    }
  };

  const handleUpdateInfo = async () => {
    try {
      await axios.put(`/admin/pedidos/${pedido.id}/info`, {
        direccionEnvio: formData.direccionEnvio,
        telefonoContacto: formData.telefonoContacto,
        notas: formData.notas,
        ciudad: formData.ciudad,
        sector: formData.sector
      });
      toast.success('Información actualizada exitosamente');
      handleCloseDialog();
      fetchPedido();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar información');
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'PENDIENTE': 'warning',
      'CONFIRMADO': 'info',
      'EN_PROCESO': 'info',
      'ENVIADO': 'primary',
      'ENTREGADO': 'success',
      'CANCELADO': 'error'
    };
    return colores[estado] || 'default';
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'ENVIADO': return <LocalShipping />;
      case 'ENTREGADO': return <CheckCircle />;
      case 'CANCELADO': return <Cancel />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Cargando detalles del pedido...</Typography>
      </Container>
    );
  }

  if (!pedido) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Pedido no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/pedidos')}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Pedido #{pedido.numeroPedido}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleOpenDialog}
        >
          Editar Pedido
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Información General del Pedido */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estado y Fechas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Pedido
                    </Typography>
                    <Typography variant="body1">
                      {new Date(pedido.createdAt).toLocaleString('es-EC', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Estado del Pedido
                  </Typography>
                  <Chip
                    label={pedido.estado}
                    color={getEstadoColor(pedido.estado)}
                    icon={getEstadoIcon(pedido.estado)}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Productos del Pedido */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Productos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedido.items && pedido.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {item.unidadVenta?.productoNombre || 'Producto'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.unidadVenta?.varianteNombre} - {item.unidadVenta?.descripcion}
                        </Typography>
                        {item.unidadVenta?.marca && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Marca: {item.unidadVenta.marca}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{item.cantidad}</TableCell>
                      <TableCell align="right">${item.precioUnitario.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={500}>
                          ${item.subtotal.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography>Subtotal:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        ${pedido.subtotal?.toFixed(2) || pedido.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography>Envío:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={pedido.costoEnvio === 0 ? "success.main" : "inherit"} fontWeight={pedido.costoEnvio === 0 ? 500 : 400}>
                        {pedido.costoEnvio === 0 ? "¡GRATIS!" : `$${pedido.costoEnvio?.toFixed(2) || '0.00'}`}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography>IVA (15%):</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        ${pedido.iva?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="h6">Total:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary">
                        ${pedido.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Información del Cliente y Envío */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información del Cliente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <Person color="action" fontSize="small" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cliente
                </Typography>
                <Typography variant="body2">
                  {pedido.userNombre || 'N/A'}
                </Typography>
              </Box>
            </Box>
            {pedido.telefonoContacto && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                <Phone color="action" fontSize="small" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body2">
                    {pedido.telefonoContacto}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de Envío
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <LocationOn color="action" fontSize="small" sx={{ mt: 0.5 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Dirección de Envío
                </Typography>
                <Typography variant="body2">
                  {pedido.direccionEnvio}
                </Typography>
                {(pedido.ciudad || pedido.sector) && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    {pedido.ciudad && `Ciudad: ${pedido.ciudad}`}
                    {pedido.ciudad && pedido.sector && ' • '}
                    {pedido.sector && `Sector: ${pedido.sector}`}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {pedido.notas && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {pedido.notas}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Dialog para editar pedido */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Editar Pedido: {pedido.numeroPedido}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                >
                  <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                  <MenuItem value="CONFIRMADO">Confirmado</MenuItem>
                  <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
                  <MenuItem value="ENVIADO">Enviado</MenuItem>
                  <MenuItem value="ENTREGADO">Entregado</MenuItem>
                  <MenuItem value="CANCELADO">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono de Contacto"
                value={formData.telefonoContacto}
                onChange={(e) => setFormData({ ...formData, telefonoContacto: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.ciudad || ''}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sector"
                value={formData.sector || ''}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección de Envío"
                value={formData.direccionEnvio}
                onChange={(e) => setFormData({ ...formData, direccionEnvio: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleUpdateEstado} variant="contained">
            Actualizar Estado
          </Button>
          <Button onClick={handleUpdateInfo} variant="outlined">
            Actualizar Info
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPedidoDetalle;

