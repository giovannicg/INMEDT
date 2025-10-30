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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Search, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFavoritos } from '../context/FavoritosContext';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

const Productos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toggleFavorito, isFavorito } = useFavoritos();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [marcas, setMarcas] = useState([]);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const fetchMarcas = async () => {
    try {
      // Obtener todas las marcas disponibles
      const response = await axios.get('/productos?page=0&size=1000');
      const marcasUnicas = [...new Set(response.data.content.map(p => p.marca).filter(Boolean))];
      setMarcas(marcasUnicas.sort());
    } catch (error) {
      console.error('Error al obtener marcas:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      let url = `/productos?page=${page}&size=12&sort=${sortBy},${sortDir}`;
      
      if (searchTerm) {
        url = `/productos/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=12&sort=${sortBy},${sortDir}`;
      } else if (selectedCategoria) {
        url = `/productos/categoria/${selectedCategoria}?page=${page}&size=12&sort=${sortBy},${sortDir}`;
      } else if (selectedMarca) {
        url = `/productos/marca/${encodeURIComponent(selectedMarca)}?page=${page}&size=12&sort=${sortBy},${sortDir}`;
      }

      const response = await axios.get(url);
      setProductos(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchMarcas();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [page, sortBy, sortDir, searchTerm, selectedCategoria, selectedMarca]);

  useEffect(() => {
    const search = searchParams.get('search');
    const categoria = searchParams.get('categoria');
    if (search) setSearchTerm(search);
    if (categoria) setSelectedCategoria(categoria);
  }, [searchParams]);

  const handleSearch = () => {
    setPage(0);
    setSelectedCategoria('');
    setSelectedMarca('');
  };

  const handleCategoriaChange = (value) => {
    setSelectedCategoria(value);
    setSelectedMarca('');
    setSearchTerm('');
    setPage(0);
  };

  const handleMarcaChange = (value) => {
    setSelectedMarca(value);
    setSelectedCategoria('');
    setSearchTerm('');
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleToggleFavorito = async (e, productoId) => {
    e.stopPropagation(); // Evitar que se navegue al detalle del producto
    
    if (!user) {
      navigate('/login');
      return;
    }

    await toggleFavorito(productoId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Productos Médicos
      </Typography>

      {/* Filtros */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategoria}
                onChange={(e) => handleCategoriaChange(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Marca</InputLabel>
              <Select
                value={selectedMarca}
                onChange={(e) => handleMarcaChange(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {marcas.map((marca) => (
                  <MenuItem key={marca} value={marca}>
                    {marca}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="marca">Marca</MenuItem>
                <MenuItem value="createdAt">Fecha</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Dirección</InputLabel>
              <Select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
              >
                <MenuItem value="asc">Ascendente</MenuItem>
                <MenuItem value="desc">Descendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Productos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {productos.map((producto) => (
              <Grid item xs={12} sm={6} md={4} key={producto.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => navigate(`/productos/${producto.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {producto.marca}
                    </Typography>
                    <Chip
                      label={producto.categoriaNombre}
                      size="small"
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {producto.descripcion?.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/productos/${producto.id}`);
                      }}
                      sx={{ flexGrow: 1, mr: 1 }}
                    >
                      Ver Detalles
                    </Button>
                    
                    {user && (
                      <Tooltip title={isFavorito(producto.id) ? "Remover de favoritos" : "Agregar a favoritos"}>
                        <IconButton
                          onClick={(e) => handleToggleFavorito(e, producto.id)}
                          color={isFavorito(producto.id) ? "error" : "default"}
                          size="small"
                        >
                          {isFavorito(producto.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
    </Container>
  );
};

export default Productos;
