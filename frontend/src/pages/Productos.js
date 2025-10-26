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
  CircularProgress
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Productos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, [page, sortBy, sortDir, fetchCategorias, fetchProductos]);

  useEffect(() => {
    const search = searchParams.get('search');
    const categoria = searchParams.get('categoria');
    if (search) setSearchTerm(search);
    if (categoria) setSelectedCategoria(categoria);
  }, [searchParams]);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      let url = `/api/productos?page=${page}&size=12&sort=${sortBy},${sortDir}`;
      
      if (searchTerm) {
        url = `/api/productos/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=12&sort=${sortBy},${sortDir}`;
      } else if (selectedCategoria) {
        url = `/api/productos/categoria/${selectedCategoria}?page=${page}&size=12&sort=${sortBy},${sortDir}`;
      } else if (selectedMarca) {
        url = `/api/productos/marca/${encodeURIComponent(selectedMarca)}?page=${page}&size=12&sort=${sortBy},${sortDir}`;
      }

      const response = await axios.get(url);
      setProductos(response.data.content);
      setTotalPages(response.data.totalPages);
      
      // Extraer marcas únicas de los productos
      const marcasUnicas = [...new Set(response.data.content.map(p => p.marca).filter(Boolean))];
      setMarcas(marcasUnicas);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchProductos();
  };

  const handleFilterChange = () => {
    setPage(0);
    fetchProductos();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
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
                onChange={(e) => {
                  setSelectedCategoria(e.target.value);
                  setSelectedMarca('');
                  handleFilterChange();
                }}
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
                onChange={(e) => {
                  setSelectedMarca(e.target.value);
                  setSelectedCategoria('');
                  handleFilterChange();
                }}
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
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleFilterChange();
                }}
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
                onChange={(e) => {
                  setSortDir(e.target.value);
                  handleFilterChange();
                }}
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
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/productos/${producto.id}`);
                      }}
                    >
                      Ver Detalles
                    </Button>
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
