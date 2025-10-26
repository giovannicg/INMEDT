# INMEDT - E-commerce para Productos Médicos

Una aplicación completa de e-commerce especializada en productos médicos, construida con Spring Boot y React.

## 🏗️ Arquitectura

- **Backend**: Spring Boot 3 con API REST
- **Frontend**: React 18 con Material-UI
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Spring Security

## 🚀 Características

### Backend (Spring Boot)
- ✅ API RESTful completa
- ✅ Autenticación y autorización con JWT
- ✅ Gestión de usuarios y roles
- ✅ Catálogo de productos con variantes
- ✅ Carrito de compras
- ✅ Sistema de pedidos
- ✅ Validación de datos
- ✅ CORS configurado

### Frontend (React)
- ✅ Interfaz moderna con Material-UI
- ✅ Autenticación de usuarios
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras interactivo
- ✅ Proceso de checkout
- ✅ Gestión de pedidos
- ✅ Responsive design

## 📦 Modelo de Datos

### Entidades Principales
- **User**: Usuarios del sistema
- **Categoria**: Categorías de productos
- **Producto**: Productos base
- **VarianteProducto**: Variantes de productos (talla, color, etc.)
- **UnidadDeVenta**: SKUs con precio y stock
- **Carrito**: Carrito de compras del usuario
- **CarritoItem**: Items en el carrito
- **Pedido**: Pedidos realizados
- **PedidoItem**: Items de cada pedido

## 🛠️ Instalación y Configuración

### Opción 1: Con Docker (Recomendado)

#### Prerrequisitos
- Docker Desktop
- Docker Compose

#### Ejecutar con Docker

**Modo Desarrollo:**
```bash
# Windows
scripts/start-dev.bat

# Linux/Mac
./scripts/start-dev.sh

# O manualmente
docker-compose -f docker-compose.dev.yml up --build
```

**Modo Producción:**
```bash
# Windows
scripts/start-prod.bat

# Linux/Mac
./scripts/start-prod.sh

# O manualmente
docker-compose up --build -d
```

### Opción 2: Instalación Local

#### Prerrequisitos
- Java 17+
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+

#### Backend (Spring Boot)

1. **Configurar Base de Datos**
   ```sql
   CREATE DATABASE inmedt_ecommerce;
   ```

2. **Configurar application.properties**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/inmedt_ecommerce
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_password
   ```

3. **Ejecutar la aplicación**
   ```bash
   mvn spring-boot:run
   ```

#### Frontend (React)

1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

## 🔗 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Productos
- `GET /api/productos` - Listar productos (paginado)
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/search` - Buscar productos
- `GET /api/productos/categoria/{id}` - Productos por categoría
- `GET /api/productos/marca/{marca}` - Productos por marca

### Categorías
- `GET /api/categorias` - Listar categorías
- `GET /api/categorias/{id}` - Obtener categoría por ID

### Carrito (Requiere autenticación)
- `GET /api/carrito` - Obtener carrito del usuario
- `POST /api/carrito/items` - Agregar item al carrito
- `PUT /api/carrito/items/{id}` - Actualizar cantidad
- `DELETE /api/carrito/items/{id}` - Eliminar item
- `DELETE /api/carrito` - Limpiar carrito

### Pedidos (Requiere autenticación)
- `POST /api/pedidos/checkout` - Realizar pedido
- `GET /api/pedidos` - Listar pedidos del usuario
- `GET /api/pedidos/{id}` - Obtener pedido por ID

## 🎨 Características del Frontend

### Páginas Principales
- **Home**: Página de inicio con categorías y productos destacados
- **Productos**: Catálogo con filtros y búsqueda
- **Producto Detalle**: Vista detallada con variantes
- **Carrito**: Gestión del carrito de compras
- **Checkout**: Proceso de compra
- **Pedidos**: Historial de pedidos
- **Login/Register**: Autenticación de usuarios

### Funcionalidades
- 🔍 Búsqueda avanzada de productos
- 🏷️ Filtros por categoría y marca
- 🛒 Carrito de compras persistente
- 📱 Diseño responsive
- 🔐 Autenticación segura
- 📊 Gestión de pedidos

## 🔧 Configuración de Desarrollo

### Base de Datos
La aplicación creará automáticamente las tablas usando Hibernate DDL.

### Variables de Entorno
Configura las siguientes variables en `application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:postgresql://localhost:5432/inmedt_ecommerce
spring.datasource.username=postgres
spring.datasource.password=password

# JWT
jwt.secret=miClaveSecretaSuperSeguraParaJWT2024
jwt.expiration=86400000

# Email (opcional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-password-app
```

## 🚀 Despliegue

### Backend
```bash
mvn clean package
java -jar target/ecommerce-medical-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Servir los archivos estáticos desde el directorio build/
```

## 📝 Notas de Desarrollo

- La aplicación está configurada para desarrollo local
- El frontend se conecta al backend en `http://localhost:8080`
- CORS está configurado para permitir el frontend en `http://localhost:3000`
- Los tokens JWT tienen una duración de 24 horas
- El carrito se mantiene mientras el usuario esté autenticado

## 🔒 Seguridad

- Autenticación basada en JWT
- Contraseñas encriptadas con BCrypt
- Validación de datos en backend y frontend
- CORS configurado apropiadamente
- Endpoints protegidos según roles

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo.
