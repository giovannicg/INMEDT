import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Pagination,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const AdminPedidos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [formData, setFormData] = useState({
    estado: '',
    direccionEnvio: '',
    telefonoContacto: '',
    notas: '',
    ciudad: '',
    sector: ''
  });
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    confirmados: 0,
    entregados: 0
  });

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/pedidos?page=${page}&size=10`);
      setPedidos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      const [totalRes, pendientesRes, confirmadosRes, entregadosRes] = await Promise.all([
        axios.get('/admin/pedidos/all'),
        axios.get('/admin/pedidos/estado/PENDIENTE'),
        axios.get('/admin/pedidos/estado/CONFIRMADO'),
        axios.get('/admin/pedidos/estado/ENTREGADO')
      ]);

      setEstadisticas({
        total: totalRes.data.length,
        pendientes: pendientesRes.data.length,
        confirmados: confirmadosRes.data.length,
        entregados: entregadosRes.data.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchPedidos();
    fetchEstadisticas();
  }, [user, navigate, page]);

  const handleOpenDialog = (pedido) => {
    setEditingPedido(pedido);
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
    setEditingPedido(null);
    setFormData({
      estado: '',
      direccionEnvio: '',
      telefonoContacto: '',
      notas: '',
      ciudad: '',
      sector: ''
    });
  };

  const handleUpdateEstado = async () => {
    try {
      await axios.put(`/admin/pedidos/${editingPedido.id}/estado?estado=${formData.estado}`);
      toast.success('Estado actualizado exitosamente');
      handleCloseDialog();
      fetchPedidos();
      fetchEstadisticas();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar estado');
    }
  };

  const handleUpdateInfo = async () => {
    try {
      await axios.put(`/admin/pedidos/${editingPedido.id}/info`, {
        direccionEnvio: formData.direccionEnvio,
        telefonoContacto: formData.telefonoContacto,
        notas: formData.notas,
        ciudad: formData.ciudad,
        sector: formData.sector
      });
      toast.success('Información actualizada exitosamente');
      handleCloseDialog();
      fetchPedidos();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar información');
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'CONFIRMADO': return 'info';
      case 'EN_PROCESO': return 'primary';
      case 'ENVIADO': return 'secondary';
      case 'ENTREGADO': return 'success';
      case 'CANCELADO': return 'error';
      default: return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'ENVIADO': return <LocalShipping />;
      case 'ENTREGADO': return <CheckCircle />;
      case 'CANCELADO': return <Cancel />;
      default: return null;
    }
  };

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">No tienes permisos para acceder a esta página</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Pedidos
      </Typography>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {estadisticas.total}
              </Typography>
              <Typography color="text.secondary">Total Pedidos</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {estadisticas.pendientes}
              </Typography>
              <Typography color="text.secondary">Pendientes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {estadisticas.confirmados}
              </Typography>
              <Typography color="text.secondary">Confirmados</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {estadisticas.entregados}
              </Typography>
              <Typography color="text.secondary">Entregados</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading ? (
        <Typography>Cargando pedidos...</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.numeroPedido}</TableCell>
                    <TableCell>{pedido.userNombre || 'N/A'}</TableCell>
                    <TableCell>${pedido.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={pedido.estado}
                        color={getEstadoColor(pedido.estado)}
                        size="small"
                        icon={getEstadoIcon(pedido.estado)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(pedido.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/pedidos/${pedido.id}`)}
                        title="Ver detalles"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(pedido)}
                        title="Editar pedido"
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Dialog para editar pedido */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Editar Pedido: {editingPedido?.numeroPedido}
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

export default AdminPedidos;
