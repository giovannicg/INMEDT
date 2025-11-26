import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import {
  ArrowForward,
  LocalShipping,
  VerifiedUser,
  Support,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios, { getImageUrl } from '../config/axios';
import SEO from '../components/SEO';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [categorias, setCategorias] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    {
      title: 'Equipamiento Médico de Calidad',
      subtitle: 'Todo lo que necesitas para tu práctica profesional',
      cta: 'Explorar Productos',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      link: '/productos'
    },
    {
      title: 'Antisépticos y Desinfección',
      subtitle: 'Mantén tus espacios seguros y limpios',
      cta: 'Ver Categoría',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      link: '/productos?categoria=antisepticos'
    },
    {
      title: 'Envío Rápido a Todo el País',
      subtitle: 'Recibe tus productos en 24-48 horas',
      cta: 'Comprar Ahora',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      link: '/productos'
    }
  ];

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriasRes, productosRes] = await Promise.all([
        axios.get('/categorias'),
        axios.get('/productos?page=0&size=8')
      ]);
      setCategorias(categoriasRes.data.slice(0, 6));
      setProductosDestacados(productosRes.data.content);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <Box>
      <SEO 
        title="INMEDT - Equipamiento Médico Profesional en Ecuador | Quito"
        description="Tu proveedor confiable de equipamiento médico profesional en Ecuador. Amplio catálogo de productos médicos de calidad garantizada. Envío gratis en compras mayores a $40. Atención en Quito y todo el país."
        keywords="equipamiento médico Ecuador, productos médicos Quito, instrumental médico, suministros médicos, equipos hospitalarios, material médico profesional, antisépticos, desinfección, guantes médicos"
        canonicalPath="/"
      />
      {/* Hero Section con Slider */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '400px', md: '500px' },
          background: heroSlides[heroIndex].background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden',
          mb: 6
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                animation: 'fadeIn 0.5s ease-in'
              }}
            >
              {heroSlides[heroIndex].title}
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                animation: 'fadeIn 0.5s ease-in 0.2s both'
              }}
            >
              {heroSlides[heroIndex].subtitle}
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(heroSlides[heroIndex].link)}
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                animation: 'fadeIn 0.5s ease-in 0.4s both',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {heroSlides[heroIndex].cta}
            </Button>
          </Box>
        </Container>

        {/* Controles del Slider */}
        <IconButton
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.3)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' }
          }}
          onClick={handlePrevHero}
        >
          <KeyboardArrowLeft sx={{ color: 'white', fontSize: 40 }} />
        </IconButton>
        <IconButton
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.3)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' }
          }}
          onClick={handleNextHero}
        >
          <KeyboardArrowRight sx={{ color: 'white', fontSize: 40 }} />
        </IconButton>

        {/* Indicadores */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1
          }}
        >
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: heroIndex === index ? 30 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: heroIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => setHeroIndex(index)}
            />
          ))}
        </Box>
      </Box>

      {/* Beneficios */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={3}>
          {[
            { icon: <LocalShipping />, title: 'Envío Rápido', desc: 'Entrega en 24-48h' },
            { icon: <VerifiedUser />, title: 'Productos Certificados', desc: 'Calidad garantizada' },
            { icon: <Support />, title: 'Soporte 24/7', desc: 'Siempre disponibles' }
          ].map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  backgroundColor: 'transparent',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    mb: 2
                  }}
                >
                  {React.cloneElement(benefit.icon, { sx: { fontSize: 40 } })}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categorías */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Compra por Categoría
        </Typography>

        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            : categorias.map((categoria) => (
                <Grid item xs={6} sm={4} md={2} key={categoria.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                    onClick={() => navigate(`/productos?categoria=${categoria.id}`)}
                  >
                    <CardActionArea>
                      <Box
                        sx={{
                          height: 150,
                          background: `linear-gradient(135deg, ${
                            ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'][
                              categoria.id % 6
                            ]
                          } 0%, ${
                            ['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#fee140', '#fa709a'][
                              categoria.id % 6
                            ]
                          } 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold" textAlign="center" px={1}>
                          {categoria.nombre}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>

      {/* Productos Destacados */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Productos Destacados
          </Typography>
          <Button
            endIcon={<ArrowForward />}
            onClick={() => navigate('/productos')}
            sx={{ fontWeight: 'bold' }}
          >
            Ver Todos
          </Button>
        </Box>

        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                  <Skeleton sx={{ mt: 1 }} />
                  <Skeleton width="60%" />
                </Grid>
              ))
            : productosDestacados.map((producto) => (
                <Grid item xs={12} sm={6} md={3} key={producto.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8
                      }
                    }}
                    onClick={() => navigate(`/productos/${producto.id}`)}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 250,
                        backgroundColor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {producto.imagenThumbnail ? (
                        <img
                          src={getImageUrl(producto.imagenThumbnail)}
                          alt={producto.nombre}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin imagen
                        </Typography>
                      )}
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {producto.categoriaNombre}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {producto.nombre}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>

      {/* CTA Final */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            ¿Listo para equipar tu práctica médica?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Explora nuestro catálogo completo y encuentra todo lo que necesitas
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/productos')}
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'scale(1.05)'
              }
            }}
          >
            Explorar Catálogo
          </Button>
        </Container>
      </Box>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Home;
