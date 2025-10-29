import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert
} from '@mui/material';
import {
  People,
  ShoppingCart,
  Inventory,
  TrendingUp,
  Visibility,
  Category
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas
      const [usersRes, productsRes, ordersRes, categoriasRes] = await Promise.all([
        axios.get('/admin/usuarios/all'),
        axios.get('/admin/productos?size=1000'),
        axios.get('/admin/pedidos/all'),
        axios.get('/admin/categorias/count')
      ]);

      const totalUsers = usersRes.data.length;
      const totalProducts = productsRes.data.totalElements;
      const orders = ordersRes.data;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const totalCategories = categoriasRes.data;

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCategories
      });

      // Obtener pedidos recientes
      const recentOrdersData = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(recentOrdersData);

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
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

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">No tienes permisos para acceder a esta página</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Cargando dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Administración
      </Typography>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalUsers}</Typography>
                  <Typography color="text.secondary">Usuarios</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/usuarios')}>
                Ver todos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalProducts}</Typography>
                  <Typography color="text.secondary">Productos</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/productos')}>
                Ver todos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Category color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalCategories}</Typography>
                  <Typography color="text.secondary">Categorías</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/categorias')}>
                Ver todas
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCart color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalOrders}</Typography>
                  <Typography color="text.secondary">Pedidos</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/admin/pedidos')}>
                Ver todos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
                  <Typography color="text.secondary">Ingresos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Acciones Rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Administra productos, categorías, variantes y unidades de venta
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => navigate('/admin/productos')}>
                Gestionar Productos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Administra usuarios, roles y permisos
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => navigate('/admin/usuarios')}>
                Gestionar Usuarios
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Pedidos Recientes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pedidos Recientes
          </Typography>
          <TableContainer component={Paper} variant="outlined">
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
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.numeroPedido}</TableCell>
                    <TableCell>{order.userNombre || 'N/A'}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.estado}
                        color={getEstadoColor(order.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/pedidos/${order.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
