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
  Fab,
  Pagination
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Category,
  Inventory
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminProductos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    marca: '',
    categoriaId: '',
    activo: true
  });

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchProductos();
    fetchCategorias();
  }, [user, navigate, page, fetchProductos, fetchCategorias]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/productos?page=${page}&size=10`);
      setProductos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/api/admin/productos/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleOpenDialog = (producto = null) => {
    if (producto) {
      setEditingProducto(producto);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        marca: producto.marca || '',
        categoriaId: producto.categoria?.id || '',
        activo: producto.activo
      });
    } else {
      setEditingProducto(null);
      setFormData({
        nombre: '',
        descripcion: '',
        marca: '',
        categoriaId: '',
        activo: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProducto(null);
    setFormData({
      nombre: '',
      descripcion: '',
      marca: '',
      categoriaId: '',
      activo: true
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingProducto) {
        await axios.put(`/api/admin/productos/${editingProducto.id}`, formData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await axios.post('/api/admin/productos', formData);
        toast.success('Producto creado exitosamente');
      }
      handleCloseDialog();
      fetchProductos();
    } catch (error) {
      toast.error(error.response?.data || 'Error al guardar producto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`/api/admin/productos/${id}`);
        toast.success('Producto eliminado exitosamente');
        fetchProductos();
      } catch (error) {
        toast.error(error.response?.data || 'Error al eliminar producto');
      }
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Productos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Producto
        </Button>
      </Box>

      {loading ? (
        <Typography>Cargando productos...</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.marca}</TableCell>
                    <TableCell>{producto.categoriaNombre}</TableCell>
                    <TableCell>
                      <Chip
                        label={producto.activo ? 'Activo' : 'Inactivo'}
                        color={producto.activo ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/productos/${producto.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(producto)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(producto.id)}
                        color="error"
                      >
                        <Delete />
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

      {/* Dialog para crear/editar producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Marca"
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.categoriaId}
              onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
              required
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.value })}
            >
              <MenuItem value={true}>Activo</MenuItem>
              <MenuItem value={false}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProducto ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB para acciones rápidas */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Fab
          color="primary"
          onClick={() => navigate('/admin/categorias')}
          title="Gestionar Categorías"
        >
          <Category />
        </Fab>
        <Fab
          color="secondary"
          onClick={() => navigate('/admin/inventario')}
          title="Gestionar Inventario"
        >
          <Inventory />
        </Fab>
      </Box>
    </Container>
  );
};

export default AdminProductos;
