import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

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
      const response = await axios.get('/api/pedidos/all');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'warning';
      case 'CONFIRMADO':
        return 'info';
      case 'EN_PROCESO':
        return 'primary';
      case 'ENVIADO':
        return 'secondary';
      case 'ENTREGADO':
        return 'success';
      case 'CANCELADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Pedidos
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : pedidos.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes pedidos realizados
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/productos')}
          >
            Ver Productos
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {pedidos.map((pedido) => (
            <Grid item xs={12} key={pedido.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Pedido #{pedido.numeroPedido}
                    </Typography>
                    <Chip
                      label={pedido.estado}
                      color={getEstadoColor(pedido.estado)}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fecha: {formatFecha(pedido.createdAt)}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Dirección:</strong> {pedido.direccionEnvio}
                  </Typography>
                  
                  {pedido.telefonoContacto && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Teléfono:</strong> {pedido.telefonoContacto}
                    </Typography>
                  )}
                  
                  {pedido.notas && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Notas:</strong> {pedido.notas}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total: ${pedido.total.toFixed(2)}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Productos ({pedido.items.length}):
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell align="center">Cantidad</TableCell>
                          <TableCell align="right">Precio Unit.</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pedido.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Typography variant="body2">
                                {item.unidadVenta.productoNombre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.unidadVenta.varianteNombre} - {item.unidadVenta.descripcion}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">{item.cantidad}</TableCell>
                            <TableCell align="right">${item.precioUnitario.toFixed(2)}</TableCell>
                            <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Pedidos;
