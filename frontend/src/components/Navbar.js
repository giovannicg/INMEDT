import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  Divider,
  ListItemIcon,
  useScrollTrigger,
  Slide
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  ExitToApp,
  Login,
  AdminPanelSettings,
  Category,
  Favorite,
  LocationOn,
  Receipt,
  Store
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Hide on scroll component
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = (props) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <HideOnScroll {...props}>
      <AppBar 
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Logo */}
            <Box
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                mr: 4,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                INMEDT
              </Typography>
            </Box>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
              <Button
                onClick={() => navigate('/productos')}
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    transform: 'translateY(-2px)'
                  }
                }}
                startIcon={<Store />}
              >
                Productos
              </Button>

              {user && (
                <Button
                  onClick={() => navigate('/favoritos')}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(240, 147, 251, 0.1)',
                      color: '#f093fb',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  startIcon={<Favorite />}
                >
                  Favoritos
                </Button>
              )}
            </Box>

            {/* Cart Icon */}
            <IconButton
              onClick={() => navigate('/carrito')}
              sx={{
                mr: 1,
                color: 'text.primary',
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#667eea',
                  color: 'white',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Badge 
                badgeContent={cartItemsCount} 
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    fontWeight: 'bold'
                  }
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Menu or Login */}
            {user ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 'bold'
                    }}
                  >
                    {user.nombre?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 240,
                      borderRadius: 2,
                      '& .MuiMenuItem-root': {
                        py: 1.5,
                        px: 2,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          transform: 'translateX(5px)'
                        }
                      }
                    }
                  }}
                >
                  {/* User Info */}
                  <Box sx={{ px: 2, py: 1.5, mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {user.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  {/* User Menu Items */}
                  <MenuItem onClick={() => { navigate('/pedidos'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <Receipt fontSize="small" sx={{ color: '#667eea' }} />
                    </ListItemIcon>
                    <Typography>Mis Pedidos</Typography>
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/direcciones'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <LocationOn fontSize="small" sx={{ color: '#4facfe' }} />
                    </ListItemIcon>
                    <Typography>Mis Direcciones</Typography>
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/favoritos'); handleMenuClose(); }}>
                    <ListItemIcon>
                      <Favorite fontSize="small" sx={{ color: '#f093fb' }} />
                    </ListItemIcon>
                    <Typography>Mis Favoritos</Typography>
                  </MenuItem>

                  {/* Admin Menu Items */}
                  {user.role === 'ROLE_ADMIN' && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                        <ListItemIcon>
                          <AdminPanelSettings fontSize="small" sx={{ color: '#fa709a' }} />
                        </ListItemIcon>
                        <Typography fontWeight="bold">Administración</Typography>
                      </MenuItem>
                      <MenuItem onClick={() => { navigate('/admin/categorias'); handleMenuClose(); }}>
                        <ListItemIcon>
                          <Category fontSize="small" sx={{ color: '#43e97b' }} />
                        </ListItemIcon>
                        <Typography>Categorías</Typography>
                      </MenuItem>
                    </>
                  )}

                  <Divider sx={{ my: 1 }} />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1) !important'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ExitToApp fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    <Typography>Cerrar Sesión</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Login />}
                onClick={() => navigate('/login')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
