import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  People,
  ShoppingCart,
  Inventory,
  TrendingUp,
  Category,
  AttachMoney,
  LocalShipping,
  CheckCircle
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

  const getEstadoConfig = (estado) => {
    const configs = {
      PENDIENTE: { color: '#ffa000', bg: 'rgba(255, 160, 0, 0.1)', icon: <ShoppingCart /> },
      CONFIRMADO: { color: '#4facfe', bg: 'rgba(79, 172, 254, 0.1)', icon: <CheckCircle /> },
      EN_PROCESO: { color: '#667eea', bg: 'rgba(102, 126, 234, 0.1)', icon: <Inventory /> },
      ENVIADO: { color: '#43e97b', bg: 'rgba(67, 233, 123, 0.1)', icon: <LocalShipping /> },
      ENTREGADO: { color: '#43e97b', bg: 'rgba(67, 233, 123, 0.15)', icon: <CheckCircle /> },
      CANCELADO: { color: '#f5576c', bg: 'rgba(245, 87, 108, 0.1)', icon: <ShoppingCart /> }
    };
    return configs[estado] || configs.PENDIENTE;
  };

  const StatCard = ({ title, value, icon, gradient, trend, loading }) => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'visible',
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={600}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={100} height={40} />
            ) : (
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {value}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 16, color: '#43e97b' }} />
                <Typography variant="caption" sx={{ color: '#43e97b', fontWeight: 600 }}>
                  +{trend}% este mes
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: gradient,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <LinearProgress
          variant="determinate"
          value={75}
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(0,0,0,0.05)',
            '& .MuiLinearProgress-bar': {
              background: gradient,
              borderRadius: 2
            }
          }}
        />
      </CardContent>
    </Card>
  );

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
            Panel de Administración
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Bienvenido, {user?.nombre}
          </Typography>
        </Box>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Usuarios"
              value={stats.totalUsers}
              icon={<People sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              trend={12}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Productos"
              value={stats.totalProducts}
              icon={<Inventory sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              trend={8}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Pedidos"
              value={stats.totalOrders}
              icon={<ShoppingCart sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              trend={15}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Ingresos Totales"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              icon={<AttachMoney sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              trend={23}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Categorías"
              value={stats.totalCategories}
              icon={<Category sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Pedidos Recientes */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: 3,
              color: 'white'
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Pedidos Recientes
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay pedidos recientes
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => {
                    const estadoConfig = getEstadoConfig(order.estado);
                    return (
                      <TableRow
                        key={order.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                            cursor: 'pointer'
                          },
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => navigate('/admin/pedidos')}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            #{order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}
                            >
                              {order.userNombre?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">
                              {order.userNombre || 'Usuario'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            ${order.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={estadoConfig.icon}
                            label={order.estado}
                            size="small"
                            sx={{
                              backgroundColor: estadoConfig.bg,
                              color: estadoConfig.color,
                              fontWeight: 600,
                              border: '1px solid',
                              borderColor: estadoConfig.color + '30'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Accesos Rápidos */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            {
              title: 'Gestionar Productos',
              description: 'Ver y editar productos',
              icon: <Inventory />,
              gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              path: '/admin/productos'
            },
            {
              title: 'Gestionar Pedidos',
              description: 'Ver y procesar pedidos',
              icon: <ShoppingCart />,
              gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              path: '/admin/pedidos'
            },
            {
              title: 'Gestionar Usuarios',
              description: 'Ver y editar usuarios',
              icon: <People />,
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              path: '/admin/usuarios'
            },
            {
              title: 'Gestionar Categorías',
              description: 'Ver y editar categorías',
              icon: <Category />,
              gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              path: '/admin/categorias'
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    borderColor: 'transparent'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      background: item.gradient
                    }}
                  >
                    {React.cloneElement(item.icon, { sx: { fontSize: 30 } })}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
