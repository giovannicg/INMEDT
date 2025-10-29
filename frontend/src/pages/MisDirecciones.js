import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
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
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const SECTORES_QUITO = [
  // Parroquias Urbanas (170101-170132)
  'Belisario Quevedo', 'Carcelén', 'Centro Histórico', 'Cochapamba', 'Comité del Pueblo',
  'Cotocollao', 'Chilibulo', 'Chillogallo', 'Chimbacalle', 'El Condado', 'Guamaní',
  'Iñaquito', 'Itchimbía', 'Jipijapa', 'Kennedy', 'La Argelia', 'La Concepción',
  'La Ecuatoriana', 'La Ferroviaria', 'La Libertad', 'La Magdalena', 'La Mena',
  'Mariscal Sucre', 'Ponceano', 'Puengasí', 'Quitumbe', 'Rumipamba', 'San Bartolo',
  'San Isidro del Inca', 'San Juan', 'Solanda', 'Turubamba',
  
  // Parroquias Rurales/Suburbanas (170151-170187)
  'Alangasí', 'Amaguaña', 'Atahualpa', 'Calacalí', 'Calderón', 'Conocoto', 'Cumbayá',
  'Chavezpamba', 'Checa', 'El Quinche', 'Gualea', 'Guangopolo', 'Guayllabamba',
  'La Merced', 'Llano Chico', 'Lloa', 'Mindo', 'Nanegal', 'Nanegalito', 'Nayón',
  'Nono', 'Pacto', 'Pedro Vicente Maldonado', 'Perucho', 'Pifo', 'Píntag', 'Pomasqui',
  'Puéllaro', 'Puembo', 'Puerto Quito', 'San Antonio', 'San José de Minas',
  'San Miguel de los Bancos', 'Tababela', 'Tumbaco', 'Yaruquí', 'Zámbiza'
];

const MisDirecciones = () => {
  const { user } = useAuth();
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDireccion, setEditingDireccion] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: 'Quito',
    sector: '',
    telefono: '',
    referencias: '',
    esPrincipal: false
  });

  useEffect(() => {
    if (user) {
      fetchDirecciones();
    }
  }, [user]);

  const fetchDirecciones = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/direcciones');
      setDirecciones(response.data);
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      toast.error('Error al cargar las direcciones');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (direccion = null) => {
    if (direccion) {
      setEditingDireccion(direccion);
      setFormData({
        nombre: direccion.nombre,
        direccion: direccion.direccion,
        ciudad: direccion.ciudad,
        sector: direccion.sector,
        telefono: direccion.telefono || '',
        referencias: direccion.referencias || '',
        esPrincipal: direccion.esPrincipal
      });
    } else {
      setEditingDireccion(null);
      setFormData({
        nombre: '',
        direccion: '',
        ciudad: 'Quito',
        sector: '',
        telefono: '',
        referencias: '',
        esPrincipal: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDireccion(null);
    setFormData({
      nombre: '',
      direccion: '',
      ciudad: 'Quito',
      sector: '',
      telefono: '',
      referencias: '',
      esPrincipal: false
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingDireccion) {
        await axios.put(`/direcciones/${editingDireccion.id}`, formData);
        toast.success('Dirección actualizada exitosamente');
      } else {
        await axios.post('/direcciones', formData);
        toast.success('Dirección creada exitosamente');
      }
      handleCloseDialog();
      fetchDirecciones();
    } catch (error) {
      toast.error(error.response?.data || 'Error al guardar la dirección');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      try {
        await axios.delete(`/direcciones/${id}`);
        toast.success('Dirección eliminada exitosamente');
        fetchDirecciones();
      } catch (error) {
        toast.error(error.response?.data || 'Error al eliminar la dirección');
      }
    }
  };

  const handleSetPrincipal = async (id) => {
    try {
      await axios.put(`/direcciones/${id}/principal`);
      toast.success('Dirección principal actualizada');
      fetchDirecciones();
    } catch (error) {
      toast.error(error.response?.data || 'Error al actualizar dirección principal');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Mis Direcciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Dirección
        </Button>
      </Box>

      {direcciones.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <HomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes direcciones guardadas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Agrega tu primera dirección para facilitar tus compras futuras
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Agregar Primera Dirección
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {direcciones.map((direccion) => (
            <Grid item xs={12} md={6} key={direccion.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3">
                      {direccion.nombre}
                      {direccion.esPrincipal && (
                        <Chip
                          icon={<StarIcon />}
                          label="Principal"
                          color="primary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(direccion)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(direccion.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Dirección:</strong> {direccion.direccion}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Ciudad:</strong> {direccion.ciudad}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Sector:</strong> {direccion.sector}
                  </Typography>

                  {direccion.telefono && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Teléfono:</strong> {direccion.telefono}
                    </Typography>
                  )}

                  {direccion.referencias && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Referencias:</strong> {direccion.referencias}
                    </Typography>
                  )}

                  {!direccion.esPrincipal && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<StarIcon />}
                        onClick={() => handleSetPrincipal(direccion.id)}
                      >
                        Marcar como Principal
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog para agregar/editar dirección */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDireccion ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Dirección"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Casa, Trabajo, Casa de mamá"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección Completa"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                multiline
                rows={2}
                placeholder="Ej: Av. 6 de Diciembre N24-253 y Lizardo García"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Sector</InputLabel>
                <Select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  label="Sector"
                >
                  {SECTORES_QUITO.map((sector) => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono de Contacto"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 0987654321"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Referencias"
                value={formData.referencias}
                onChange={(e) => setFormData({ ...formData, referencias: e.target.value })}
                multiline
                rows={2}
                placeholder="Ej: Casa blanca con portón negro, frente al parque"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.esPrincipal}
                    onChange={(e) => setFormData({ ...formData, esPrincipal: e.target.checked })}
                  />
                }
                label="Marcar como dirección principal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.nombre || !formData.direccion || !formData.sector}
          >
            {editingDireccion ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MisDirecciones;
