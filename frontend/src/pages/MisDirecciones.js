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
  CircularProgress,
  Fade,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn,
  Phone,
  Info
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../config/axios';

const SECTORES_QUITO = [
  'Belisario Quevedo', 'Carcelén', 'Centro Histórico', 'Cochapamba', 'Comité del Pueblo',
  'Cotocollao', 'Chilibulo', 'Chillogallo', 'Chimbacalle', 'El Condado', 'Guamaní',
  'Iñaquito', 'Itchimbía', 'Jipijapa', 'Kennedy', 'La Argelia', 'La Concepción',
  'La Ecuatoriana', 'La Ferroviaria', 'La Libertad', 'La Magdalena', 'La Mena',
  'Mariscal Sucre', 'Ponceano', 'Puengasí', 'Quitumbe', 'Rumipamba', 'San Bartolo',
  'San Isidro del Inca', 'San Juan', 'Solanda', 'Turubamba',
  'Alangasí', 'Amaguaña', 'Calderón', 'Conocoto', 'Cumbayá', 'Tumbaco', 'Pomasqui'
].sort();

const MisDirecciones = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDirecciones();
  }, [user, navigate]);

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
  };

  const handleSaveDireccion = async () => {
    try {
      if (editingDireccion) {
        await axios.put(`/direcciones/${editingDireccion.id}`, formData);
        toast.success('Dirección actualizada correctamente');
      } else {
        await axios.post('/direcciones', formData);
        toast.success('Dirección agregada correctamente');
      }
      fetchDirecciones();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar dirección:', error);
      toast.error(error.response?.data || 'Error al guardar la dirección');
    }
  };

  const handleDeleteDireccion = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      return;
    }

    try {
      await axios.delete(`/direcciones/${id}`);
      toast.success('Dirección eliminada correctamente');
      fetchDirecciones();
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      toast.error('Error al eliminar la dirección');
    }
  };

  const handleSetPrincipal = async (id) => {
    try {
      await axios.put(`/direcciones/${id}/principal`);
      toast.success('Dirección principal actualizada');
      fetchDirecciones();
    } catch (error) {
      console.error('Error al establecer dirección principal:', error);
      toast.error('Error al establecer dirección principal');
    }
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 4,
            mb: 4,
            color: 'white'
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Mis Direcciones
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Gestiona tus direcciones de envío
          </Typography>
        </Box>

        {/* Botón Agregar */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            Nueva Dirección
          </Button>
        </Box>

        {/* Grid de Direcciones */}
        {direcciones.length === 0 ? (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              textAlign: 'center',
              py: 8
            }}
          >
            <HomeIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes direcciones guardadas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Agrega una dirección para facilitar tus compras
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Agregar Dirección
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {direcciones.map((direccion, index) => (
              <Grid item xs={12} md={6} key={direccion.id}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      border: '2px solid',
                      borderColor: direccion.esPrincipal ? '#667eea' : 'transparent',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        borderColor: '#667eea'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header con nombre y badges */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h6" fontWeight="bold">
                            {direccion.nombre}
                          </Typography>
                          {direccion.esPrincipal && (
                            <Chip
                              icon={<StarIcon sx={{ fontSize: 16 }} />}
                              label="Principal"
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255, 193, 7, 0.15)',
                                color: '#ffa000',
                                fontWeight: 600,
                                border: '1px solid rgba(255, 193, 7, 0.3)'
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleSetPrincipal(direccion.id)}
                            disabled={direccion.esPrincipal}
                            sx={{
                              color: direccion.esPrincipal ? '#ffa000' : 'text.secondary',
                              '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.1)' }
                            }}
                          >
                            {direccion.esPrincipal ? <StarIcon /> : <StarBorderIcon />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(direccion)}
                            sx={{
                              color: '#667eea',
                              '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteDireccion(direccion.id)}
                            sx={{
                              color: 'error.main',
                              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Detalles */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 20, color: '#667eea', mt: 0.3 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              Dirección
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {direccion.direccion}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {direccion.sector}, {direccion.ciudad}
                            </Typography>
                          </Box>
                        </Box>

                        {direccion.telefono && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 20, color: '#4facfe' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                Teléfono
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {direccion.telefono}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {direccion.referencias && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Info sx={{ fontSize: 20, color: '#43e97b', mt: 0.3 }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                Referencias
                              </Typography>
                              <Typography variant="body2">
                                {direccion.referencias}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Dialog Agregar/Editar */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {editingDireccion ? 'Editar Dirección' : 'Nueva Dirección'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre de la dirección"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              margin="normal"
              placeholder="Ej: Casa, Oficina, etc."
            />
            <TextField
              fullWidth
              label="Dirección completa"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="Calle, número, edificio..."
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
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
            </Grid>
            <TextField
              fullWidth
              label="Teléfono de contacto"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              margin="normal"
              placeholder="0999999999"
            />
            <TextField
              fullWidth
              label="Referencias"
              value={formData.referencias}
              onChange={(e) => setFormData({ ...formData, referencias: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="Casa de color azul, frente al parque..."
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.esPrincipal}
                  onChange={(e) => setFormData({ ...formData, esPrincipal: e.target.checked })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#667eea'
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#667eea'
                    }
                  }}
                />
              }
              label="Establecer como dirección principal"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveDireccion}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              {editingDireccion ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MisDirecciones;
