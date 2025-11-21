import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Skeleton,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import {
  Search,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart,
  GridView,
  ViewList
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFavoritos } from '../context/FavoritosContext';
import { useAuth } from '../context/AuthContext';
import axios, { IMAGES_URL } from '../config/axios';

const Productos = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toggleFavorito, isFavorito } = useFavoritos();
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [page, searchTerm, selectedCategoria]);

  useEffect(() => {
    const categoriaId = searchParams.get('categoria');
    if (categoriaId) {
      setSelectedCategoria(categoriaId);
    }
  }, [searchParams]);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      let url = `/productos?page=${page}&size=24`;
      
      if (searchTerm) {
        url = `/productos/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=24`;
      } else if (selectedCategoria && selectedCategoria !== 'all') {
        url = `/productos/categoria/${selectedCategoria}?page=${page}&size=24`;
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCategoriaChange = (event, newValue) => {
    setSelectedCategoria(newValue);
    setPage(0);
  };

  const handleToggleFavorito = async (e, productoId) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleFavorito(productoId);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            fontWeight="bold"
            textAlign="center"
          >
            Explorar Productos
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ opacity: 0.9, mb: 4 }}
          >
            Encuentra el equipo médico perfecto para ti
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(0,0,0,0.4)' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'white',
                  borderRadius: 3,
                  '& fieldset': { border: 'none' },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 6 }}>
        {/* Category Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedCategoria}
            onChange={handleCategoriaChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                minHeight: 48,
                borderRadius: 3,
                mx: 0.5,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)'
                },
                '&.Mui-selected': {
                  color: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea',
                height: 3,
                borderRadius: 3
              }
            }}
          >
            <Tab label="Todos" value="all" />
            {categorias.map((cat) => (
              <Tab key={cat.id} label={cat.nombre} value={cat.id.toString()} />
            ))}
          </Tabs>
        </Box>

        {/* Results Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {loading ? 'Cargando...' : `${productos.length} productos encontrados`}
          </Typography>
          
          {/* View Mode Toggle */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                backgroundColor: viewMode === 'grid' ? '#667eea' : 'transparent',
                color: viewMode === 'grid' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor: viewMode === 'grid' ? '#764ba2' : 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              <GridView />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                backgroundColor: viewMode === 'list' ? '#667eea' : 'transparent',
                color: viewMode === 'list' ? 'white' : 'text.secondary',
                '&:hover': {
                  backgroundColor: viewMode === 'list' ? '#764ba2' : 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              <ViewList />
            </IconButton>
          </Box>
        </Box>

        {/* Products Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from(new Array(12)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 3 }} />
                <Skeleton sx={{ mt: 1 }} />
                <Skeleton width="60%" />
              </Grid>
            ))}
          </Grid>
        ) : productos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No se encontraron productos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Intenta con otra búsqueda o categoría
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {productos.map((producto, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
                <Fade in={true} timeout={300 + index * 50}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                        borderColor: '#667eea'
                      }
                    }}
                    onClick={() => navigate(`/productos/${producto.id}`)}
                  >
                    {/* Favorite Button */}
                    {user && (
                      <IconButton
                        onClick={(e) => handleToggleFavorito(e, producto.id)}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 1,
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'white',
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        {isFavorito(producto.id) ? (
                          <FavoriteIcon sx={{ color: '#f093fb' }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ color: 'text.secondary' }} />
                        )}
                      </IconButton>
                    )}

                    {/* Product Image */}
                    <CardMedia
                      component="div"
                      sx={{
                        height: 280,
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {producto.imagenThumbnail ? (
                        <img
                          src={`${IMAGES_URL}${producto.imagenThumbnail}`}
                          alt={producto.nombre}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            color: 'text.secondary'
                          }}
                        >
                          <ShoppingCart sx={{ fontSize: 48, opacity: 0.3 }} />
                          <Typography variant="caption">Sin imagen</Typography>
                        </Box>
                      )}

                      {/* Category Badge */}
                      {producto.categoriaNombre && (
                        <Chip
                          label={producto.categoriaNombre}
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 12,
                            left: 12,
                            backgroundColor: 'white',
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}
                        />
                      )}
                    </CardMedia>

                    {/* Product Info */}
                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '2.6em',
                          color: 'text.primary'
                        }}
                      >
                        {producto.nombre}
                      </Typography>

                      {producto.marca && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'text.secondary',
                            mb: 1,
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.5px'
                          }}
                        >
                          {producto.marca}
                        </Typography>
                      )}

                      {/* Status Badge */}
                      <Chip
                        label={producto.activo ? 'Disponible' : 'Agotado'}
                        size="small"
                        sx={{
                          backgroundColor: producto.activo
                            ? 'rgba(67, 233, 123, 0.15)'
                            : 'rgba(158, 158, 158, 0.15)',
                          color: producto.activo ? '#43e97b' : '#9e9e9e',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: producto.activo
                            ? 'rgba(67, 233, 123, 0.3)'
                            : 'rgba(158, 158, 158, 0.3)'
                        }}
                      />
                    </CardContent>

                    {/* View Button */}
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          borderRadius: 2,
                          py: 1,
                          boxShadow: 'none',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 3,
                p: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => {
                      setPage(i);
                      handleScrollToTop();
                    }}
                    variant={page === i ? 'contained' : 'outlined'}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: 2,
                      ...(page === i
                        ? {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none'
                          }
                        : {
                            borderColor: 'divider',
                            color: 'text.secondary',
                            '&:hover': {
                              borderColor: '#667eea',
                              color: '#667eea',
                              backgroundColor: 'rgba(102, 126, 234, 0.05)'
                            }
                          })
                    }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Productos;
