import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Grid,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Star,
  StarBorder
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios, { IMAGES_URL } from '../config/axios';

const ProductoImagenesManager = ({ producto, onUpdate }) => {
  const [uploading, setUploading] = useState(false);

  const handleUploadPrincipal = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no debe superar 10MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('imagen', file);

      const response = await axios.post(
        `/admin/productos/${producto.id}/imagen-principal`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Imagen principal actualizada');
        onUpdate();
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error(error.response?.data?.error || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadGaleria = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no debe superar 10MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('imagen', file);

      const response = await axios.post(
        `/admin/productos/${producto.id}/imagenes-galeria`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Imagen agregada a la galería');
        onUpdate();
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error(error.response?.data?.error || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePrincipal = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar la imagen principal?')) {
      return;
    }

    try {
      setUploading(true);
      await axios.delete(`/admin/productos/${producto.id}/imagen-principal`);
      toast.success('Imagen principal eliminada');
      onUpdate();
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      toast.error(error.response?.data?.error || 'Error al eliminar la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGaleria = async (filename) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      setUploading(true);
      await axios.delete(
        `/admin/productos/${producto.id}/imagenes-galeria?filename=${encodeURIComponent(filename)}`
      );
      toast.success('Imagen eliminada de la galería');
      onUpdate();
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      toast.error(error.response?.data?.error || 'Error al eliminar la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Gestión de Imágenes
      </Typography>

      {/* Imagen Principal */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Imagen Principal
        </Typography>
        
        {producto.imagenPrincipal ? (
          <Card sx={{ maxWidth: 300 }}>
              <CardMedia
                component="img"
                height="200"
                image={`${IMAGES_URL}${producto.imagenPrincipal}`}
                alt={producto.nombre}
              />
            <CardActions>
              <Button
                size="small"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeletePrincipal}
                disabled={uploading}
              >
                Eliminar
              </Button>
              <Button
                size="small"
                component="label"
                disabled={uploading}
              >
                Cambiar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUploadPrincipal}
                />
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Button
            variant="outlined"
            component="label"
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
            disabled={uploading}
          >
            Subir Imagen Principal
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleUploadPrincipal}
            />
          </Button>
        )}
      </Box>

      {/* Galería de Imágenes */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Galería de Imágenes
        </Typography>
        
        <Grid container spacing={2}>
          {producto.imagenesGaleria && producto.imagenesGaleria.map((imagen, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`${IMAGES_URL}${imagen}`}
                    alt={`Galería ${index + 1}`}
                  />
                <CardActions>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteGaleria(imagen)}
                    disabled={uploading}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          
          <Grid item xs={6} sm={4} md={3}>
            <Card
              sx={{
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                cursor: 'pointer',
              }}
            >
              <Button
                component="label"
                disabled={uploading}
                sx={{ height: '100%', width: '100%' }}
              >
                {uploading ? <CircularProgress /> : <CloudUpload fontSize="large" />}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUploadGaleria}
                />
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductoImagenesManager;

