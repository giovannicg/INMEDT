import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Register from './pages/Register';
import Pedidos from './pages/Pedidos';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductos from './pages/AdminProductos';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminPedidos from './pages/AdminPedidos';
import AdminCategorias from './pages/AdminCategorias';
import MisDirecciones from './pages/MisDirecciones';
import MisFavoritos from './pages/MisFavoritos';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritosProvider } from './context/FavoritosContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritosProvider>
          <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/direcciones" element={<MisDirecciones />} />
            <Route path="/favoritos" element={<MisFavoritos />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Rutas de Administración */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
            <Route path="/admin/categorias" element={<AdminCategorias />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/pedidos" element={<AdminPedidos />} />
          </Routes>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          </div>
        </FavoritosProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
