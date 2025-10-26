import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  ExitToApp,
  Login,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
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
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          INMEDT
        </Typography>

        <Button
          color="inherit"
          onClick={() => navigate('/productos')}
        >
          Productos
        </Button>

        <IconButton
          color="inherit"
          onClick={() => navigate('/carrito')}
        >
          <Badge badgeContent={cartItemsCount} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {user ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
            >
              <Person />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { navigate('/pedidos'); handleMenuClose(); }}>
                Mis Pedidos
              </MenuItem>
              {user.role === 'ROLE_ADMIN' && (
                <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                  <AdminPanelSettings sx={{ mr: 1 }} />
                  Administración
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            startIcon={<Login />}
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
