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
  Switch,
  FormControlLabel,
  Pagination
} from '@mui/material';
import {
  Edit,
  Delete,
  Person,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    enabled: true,
    password: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchUsuarios();
  }, [user, navigate, page, fetchUsuarios]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/usuarios?page=${page}&size=10`);
      setUsuarios(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        role: usuario.role,
        enabled: usuario.enabled,
        password: ''
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        role: 'ROLE_CLIENTE',
        enabled: true,
        password: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUsuario(null);
    setFormData({
      role: 'ROLE_CLIENTE',
      enabled: true,
      password: ''
    });
  };

  const handleUpdateRole = async () => {
    try {
      await axios.put(`/api/admin/usuarios/${editingUsuario.id}/role?role=${formData.role}`);
      toast.success('Rol actualizado exitosamente');
      handleCloseDialog();
      fetchUsuarios();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar rol');
    }
  };

  const handleUpdateStatus = async (id, enabled) => {
    try {
      await axios.put(`/api/admin/usuarios/${id}/status?enabled=${enabled}`);
      toast.success('Estado actualizado exitosamente');
      fetchUsuarios();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar estado');
    }
  };

  const handleUpdatePassword = async () => {
    if (!formData.password) {
      toast.error('La contraseña es obligatoria');
      return;
    }
    try {
      await axios.put(`/api/admin/usuarios/${editingUsuario.id}/password?password=${formData.password}`);
      toast.success('Contraseña actualizada exitosamente');
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar contraseña');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await axios.delete(`/api/admin/usuarios/${id}`);
        toast.success('Usuario eliminado exitosamente');
        fetchUsuarios();
      } catch (error) {
        toast.error(error.response?.data || 'Error al eliminar usuario');
      }
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'error';
      case 'ROLE_CLIENTE': return 'primary';
      default: return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Administrador';
      case 'ROLE_CLIENTE': return 'Cliente';
      default: return role;
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
          Gestión de Usuarios
        </Typography>
      </Box>

      {loading ? (
        <Typography>Cargando usuarios...</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Pedidos</TableCell>
                  <TableCell>Registro</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(usuario.role)}
                        color={getRoleColor(usuario.role)}
                        size="small"
                        icon={usuario.role === 'ROLE_ADMIN' ? <AdminPanelSettings /> : <Person />}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={usuario.enabled}
                            onChange={(e) => handleUpdateStatus(usuario.id, e.target.checked)}
                            color="primary"
                          />
                        }
                        label={usuario.enabled ? 'Activo' : 'Inactivo'}
                      />
                    </TableCell>
                    <TableCell>{usuario.totalPedidos || 0}</TableCell>
                    <TableCell>
                      {new Date(usuario.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(usuario)}
                        title="Editar usuario"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(usuario.id)}
                        color="error"
                        title="Eliminar usuario"
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

      {/* Dialog para editar usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar Usuario: {editingUsuario?.nombre}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="ROLE_CLIENTE">Cliente</MenuItem>
              <MenuItem value="ROLE_ADMIN">Administrador</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            helperText="Dejar vacío para no cambiar la contraseña"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Actualizar Rol
          </Button>
          {formData.password && (
            <Button onClick={handleUpdatePassword} variant="outlined">
              Cambiar Contraseña
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsuarios;
