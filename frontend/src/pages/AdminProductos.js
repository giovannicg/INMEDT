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
  Settings,
  Inventory,
  Image,
  Search,
  FilterList,
  Clear
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../config/axios';
import ProductoImagenesManager from '../components/ProductoImagenesManager';

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
  
  // Estados para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterMarca, setFilterMarca] = useState('');
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);
  
  // Estado para gestión de variantes
  const [openVariantesDialog, setOpenVariantesDialog] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [variantes, setVariantes] = useState([]);
  const [openVarianteForm, setOpenVarianteForm] = useState(false);
  const [editingVariante, setEditingVariante] = useState(null);
  const [varianteFormData, setVarianteFormData] = useState({
    nombre: '',
    descripcion: '',
    activa: true
  });
  
  // Estado para gestión de unidades de venta
  const [openUnidadesDialog, setOpenUnidadesDialog] = useState(false);
  const [selectedVariante, setSelectedVariante] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [openUnidadForm, setOpenUnidadForm] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState(null);
  const [unidadFormData, setUnidadFormData] = useState({
    sku: '',
    descripcion: '',
    precio: '',
    stock: '',
    activa: true
  });

  // Estado para gestión de imágenes
  const [openImagenesDialog, setOpenImagenesDialog] = useState(false);
  const [productoParaImagenes, setProductoParaImagenes] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      
      // Construir parámetros de búsqueda
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', 10);
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategoria) params.append('categoriaId', filterCategoria);
      if (filterEstado !== '') params.append('activo', filterEstado);
      if (filterMarca) params.append('marca', filterMarca);
      
      const response = await axios.get(`/admin/productos?${params.toString()}`);
      setProductos(response.data.content);
      setTotalPages(response.data.totalPages);
      
      // Extraer marcas únicas para el filtro
      const marcas = [...new Set(response.data.content.map(p => p.marca).filter(Boolean))];
      setMarcasDisponibles(prev => {
        const todasMarcas = [...new Set([...prev, ...marcas])];
        return todasMarcas.sort();
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/admin/productos/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchProductos();
    fetchCategorias();
  }, [user, navigate, page, searchTerm, filterCategoria, filterEstado, filterMarca]);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategoria('');
    setFilterEstado('');
    setFilterMarca('');
    setPage(0);
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
        await axios.put(`/admin/productos/${editingProducto.id}`, formData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await axios.post('/admin/productos', formData);
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
        await axios.delete(`/admin/productos/${id}`);
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

  // Funciones para gestión de variantes
  const handleOpenVariantesDialog = async (producto) => {
    setSelectedProducto(producto);
    setOpenVariantesDialog(true);
    await fetchVariantes(producto.id);
  };

  const handleOpenImagenesDialog = (producto) => {
    setProductoParaImagenes(producto);
    setOpenImagenesDialog(true);
  };

  const handleCloseImagenesDialog = () => {
    setOpenImagenesDialog(false);
    setProductoParaImagenes(null);
  };

  const handleImagenesUpdate = async () => {
    await fetchProductos();
    if (productoParaImagenes) {
      // Actualizar el producto seleccionado
      const response = await axios.get(`/admin/productos/${productoParaImagenes.id}`);
      setProductoParaImagenes(response.data);
    }
  };

  const fetchVariantes = async (productoId) => {
    try {
      const response = await axios.get(`/admin/productos/${productoId}/variantes`);
      setVariantes(response.data);
    } catch (error) {
      console.error('Error al cargar variantes:', error);
      toast.error('Error al cargar variantes');
    }
  };

  const handleOpenVarianteForm = (variante = null) => {
    if (variante) {
      setEditingVariante(variante);
      setVarianteFormData({
        nombre: variante.nombre,
        descripcion: variante.descripcion || '',
        activa: variante.activa
      });
    } else {
      setEditingVariante(null);
      setVarianteFormData({ nombre: '', descripcion: '', activa: true });
    }
    setOpenVarianteForm(true);
  };

  const handleCreateVariante = async () => {
    try {
      const payload = {
        nombre: varianteFormData.nombre,
        descripcion: varianteFormData.descripcion,
        activa: varianteFormData.activa === true || varianteFormData.activa === 'true'
      };

      if (editingVariante) {
        await axios.put(`/admin/productos/variantes/${editingVariante.id}`, payload);
        toast.success('Variante actualizada exitosamente');
      } else {
        await axios.post('/admin/productos/variantes', {
          ...payload,
          productoId: selectedProducto.id
        });
        toast.success('Variante creada exitosamente');
      }
      setOpenVarianteForm(false);
      setEditingVariante(null);
      setVarianteFormData({ nombre: '', descripcion: '', activa: true });
      await fetchVariantes(selectedProducto.id);
    } catch (error) {
      console.error('Error al guardar variante:', error.response?.data || error.message);
      const errorMessage = error.response?.data || 'Error al guardar variante';
      toast.error(errorMessage);
    }
  };

  const handleDeleteVariante = async (varianteId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta variante?')) {
      try {
        await axios.delete(`/admin/productos/variantes/${varianteId}`);
        toast.success('Variante eliminada exitosamente');
        await fetchVariantes(selectedProducto.id);
      } catch (error) {
        console.error('Error al eliminar variante:', error);
        const errorMessage = error.response?.data || 'Error al eliminar variante';
        toast.error(errorMessage);
      }
    }
  };

  // Funciones para gestión de unidades de venta
  const handleOpenUnidadesDialog = async (variante) => {
    setSelectedVariante(variante);
    setOpenUnidadesDialog(true);
    await fetchUnidades(variante.id);
  };

  const fetchUnidades = async (varianteId) => {
    try {
      const response = await axios.get(`/admin/productos/variantes/${varianteId}/unidades`);
      setUnidades(response.data);
    } catch (error) {
      console.error('Error al cargar unidades:', error);
      toast.error('Error al cargar unidades de venta');
    }
  };

  const handleOpenUnidadForm = (unidad = null) => {
    if (unidad) {
      setEditingUnidad(unidad);
      setUnidadFormData({
        sku: unidad.sku,
        descripcion: unidad.descripcion || '',
        precio: unidad.precio.toString(),
        stock: unidad.stock.toString(),
        activa: unidad.activa
      });
    } else {
      setEditingUnidad(null);
      setUnidadFormData({ sku: '', descripcion: '', precio: '', stock: '', activa: true });
    }
    setOpenUnidadForm(true);
  };

  const handleCreateUnidad = async () => {
    try {
      const payload = {
        sku: unidadFormData.sku,
        descripcion: unidadFormData.descripcion,
        precio: parseFloat(unidadFormData.precio),
        stock: parseInt(unidadFormData.stock),
        activa: unidadFormData.activa === true || unidadFormData.activa === 'true'
      };

      if (editingUnidad) {
        await axios.put(`/admin/productos/unidades/${editingUnidad.id}`, payload);
        toast.success('Unidad de venta actualizada exitosamente');
      } else {
        await axios.post('/admin/productos/unidades', {
          ...payload,
          varianteId: selectedVariante.id
        });
        toast.success('Unidad de venta creada exitosamente');
      }
      
      setOpenUnidadForm(false);
      setEditingUnidad(null);
      setUnidadFormData({ sku: '', descripcion: '', precio: '', stock: '', activa: true });
      await fetchUnidades(selectedVariante.id);
      await fetchVariantes(selectedProducto.id); // Actualizar el conteo de unidades
    } catch (error) {
      console.error('Error al guardar unidad:', error);
      // El backend devuelve el mensaje directamente en response.data
      const errorMessage = error.response?.data || 'Error al guardar unidad de venta';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUnidad = async (unidadId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta unidad de venta?')) {
      try {
        await axios.delete(`/admin/productos/unidades/${unidadId}`);
        toast.success('Unidad de venta eliminada exitosamente');
        await fetchUnidades(selectedVariante.id);
        await fetchVariantes(selectedProducto.id); // Actualizar el conteo de unidades
      } catch (error) {
        console.error('Error al eliminar unidad:', error);
        const errorMessage = error.response?.data || 'Error al eliminar unidad de venta';
        toast.error(errorMessage);
      }
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

      {/* Filtros y búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterList color="primary" />
          <Typography variant="h6">Filtros y Búsqueda</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Búsqueda por nombre */}
          <TextField
            size="small"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ minWidth: 250 }}
          />

          {/* Filtro por categoría */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filterCategoria}
              label="Categoría"
              onChange={(e) => {
                setFilterCategoria(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtro por estado */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filterEstado}
              label="Estado"
              onChange={(e) => {
                setFilterEstado(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="true">Activo</MenuItem>
              <MenuItem value="false">Inactivo</MenuItem>
            </Select>
          </FormControl>

          {/* Filtro por marca */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Marca</InputLabel>
            <Select
              value={filterMarca}
              label="Marca"
              onChange={(e) => {
                setFilterMarca(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {marcasDisponibles.map((marca) => (
                <MenuItem key={marca} value={marca}>
                  {marca}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Botón limpiar filtros */}
          {(searchTerm || filterCategoria || filterEstado !== '' || filterMarca) && (
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              size="small"
            >
              Limpiar Filtros
            </Button>
          )}
        </Box>

        {/* Mostrar filtros activos */}
        {(searchTerm || filterCategoria || filterEstado !== '' || filterMarca) && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: 'center' }}>
              Filtros activos:
            </Typography>
            {searchTerm && (
              <Chip 
                label={`Búsqueda: "${searchTerm}"`} 
                size="small" 
                onDelete={() => setSearchTerm('')}
              />
            )}
            {filterCategoria && (
              <Chip 
                label={`Categoría: ${categorias.find(c => c.id === filterCategoria)?.nombre}`}
                size="small" 
                onDelete={() => setFilterCategoria('')}
              />
            )}
            {filterEstado !== '' && (
              <Chip 
                label={`Estado: ${filterEstado === 'true' ? 'Activo' : 'Inactivo'}`}
                size="small" 
                onDelete={() => setFilterEstado('')}
              />
            )}
            {filterMarca && (
              <Chip 
                label={`Marca: ${filterMarca}`}
                size="small" 
                onDelete={() => setFilterMarca('')}
              />
            )}
          </Box>
        )}
      </Paper>

      {loading ? (
        <Typography>Cargando productos...</Typography>
      ) : productos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Category sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron productos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {(searchTerm || filterCategoria || filterEstado !== '' || filterMarca) 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza creando tu primer producto'}
          </Typography>
          {(searchTerm || filterCategoria || filterEstado !== '' || filterMarca) && (
            <Button variant="outlined" onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
          )}
        </Paper>
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
                        title="Ver detalles"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(producto)}
                        title="Editar"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenImagenesDialog(producto)}
                        title="Gestionar imágenes"
                        color="primary"
                      >
                        <Image />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenVariantesDialog(producto)}
                        title="Gestionar Variantes"
                      >
                        <Settings />
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
              onChange={(e) => setFormData({ ...formData, activo: e.target.value === true || e.target.value === 'true' })}
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

      {/* Diálogo para gestión de variantes */}
      <Dialog open={openVariantesDialog} onClose={() => setOpenVariantesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Gestionar Variantes - {selectedProducto?.nombre}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenVarianteForm()}
            >
              Nueva Variante
            </Button>
          </Box>
          
          {variantes.length === 0 ? (
            <Alert severity="info">
              No hay variantes para este producto. Crea una variante para que los usuarios puedan agregarlo al carrito.
            </Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Unidades</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variantes.map((variante) => (
                  <TableRow key={variante.id}>
                    <TableCell>{variante.nombre}</TableCell>
                    <TableCell>{variante.descripcion}</TableCell>
                    <TableCell>
                      <Chip
                        label={variante.activa ? 'Activa' : 'Inactiva'}
                        color={variante.activa ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleOpenUnidadesDialog(variante)}
                        variant="outlined"
                      >
                        {variante.unidadesVenta?.length || 0} unidades
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenVarianteForm(variante)}>
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteVariante(variante.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVariantesDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear/editar variante */}
      <Dialog open={openVarianteForm} onClose={() => setOpenVarianteForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingVariante ? 'Editar Variante' : 'Nueva Variante'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={varianteFormData.nombre}
            onChange={(e) => setVarianteFormData({ ...varianteFormData, nombre: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={varianteFormData.descripcion}
            onChange={(e) => setVarianteFormData({ ...varianteFormData, descripcion: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={varianteFormData.activa}
              onChange={(e) => setVarianteFormData({ ...varianteFormData, activa: e.target.value })}
            >
              <MenuItem value={true}>Activa</MenuItem>
              <MenuItem value={false}>Inactiva</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVarianteForm(false)}>Cancelar</Button>
          <Button onClick={handleCreateVariante} variant="contained">
            {editingVariante ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para gestionar unidades de venta */}
      <Dialog open={openUnidadesDialog} onClose={() => setOpenUnidadesDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Gestionar Unidades de Venta - {selectedVariante?.nombre}
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => handleOpenUnidadForm()}
              sx={{ float: 'right' }}
            >
              Nueva Unidad
            </Button>
        </DialogTitle>
        <DialogContent>
          {unidades.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay unidades de venta para esta variante. Crea al menos una unidad con precio y stock.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unidades.map((unidad) => (
                    <TableRow key={unidad.id}>
                      <TableCell>{unidad.sku}</TableCell>
                      <TableCell>{unidad.descripcion}</TableCell>
                      <TableCell>${unidad.precio}</TableCell>
                      <TableCell>{unidad.stock}</TableCell>
                      <TableCell>
                        <Chip
                          label={unidad.activa ? 'Activa' : 'Inactiva'}
                          color={unidad.activa ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleOpenUnidadForm(unidad)}>
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteUnidad(unidad.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnidadesDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear/editar unidad de venta */}
      <Dialog open={openUnidadForm} onClose={() => setOpenUnidadForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUnidad ? 'Editar Unidad de Venta' : 'Nueva Unidad de Venta'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="sku"
            label="SKU (Código único)"
            fullWidth
            variant="outlined"
            value={unidadFormData.sku}
            onChange={(e) => setUnidadFormData({ ...unidadFormData, sku: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="Ej: GUANTES-M-001"
          />
          <TextField
            margin="dense"
            name="descripcion"
            label="Descripción"
            fullWidth
            variant="outlined"
            value={unidadFormData.descripcion}
            onChange={(e) => setUnidadFormData({ ...unidadFormData, descripcion: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="Ej: Guantes talla M, color azul"
          />
          <TextField
            margin="dense"
            name="precio"
            label="Precio Unitario"
            type="number"
            fullWidth
            variant="outlined"
            value={unidadFormData.precio}
            onChange={(e) => setUnidadFormData({ ...unidadFormData, precio: e.target.value })}
            sx={{ mb: 2 }}
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            margin="dense"
            name="stock"
            label="Stock Disponible"
            type="number"
            fullWidth
            variant="outlined"
            value={unidadFormData.stock}
            onChange={(e) => setUnidadFormData({ ...unidadFormData, stock: e.target.value })}
            sx={{ mb: 2 }}
            inputProps={{ min: 0 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              name="activa"
              value={unidadFormData.activa}
              onChange={(e) => setUnidadFormData({ ...unidadFormData, activa: e.target.value === true || e.target.value === 'true' })}
            >
              <MenuItem value={true}>Activa</MenuItem>
              <MenuItem value={false}>Inactiva</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnidadForm(false)}>Cancelar</Button>
          <Button onClick={handleCreateUnidad} variant="contained">
            {editingUnidad ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para gestionar imágenes */}
      <Dialog 
        open={openImagenesDialog} 
        onClose={handleCloseImagenesDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Gestionar Imágenes - {productoParaImagenes?.nombre}
        </DialogTitle>
        <DialogContent>
          {productoParaImagenes && (
            <ProductoImagenesManager
              producto={productoParaImagenes}
              onUpdate={handleImagenesUpdate}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImagenesDialog}>Cerrar</Button>
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
