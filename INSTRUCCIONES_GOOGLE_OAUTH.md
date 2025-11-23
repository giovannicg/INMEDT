# 🔐 Integración de Google OAuth - Instrucciones

## ✅ Archivos Implementados

He implementado la autenticación con Google OAuth en el proyecto. Los siguientes archivos han sido creados/modificados:

### Backend:
1. **`pom.xml`** - Agregada dependencia de Google API Client
2. **`src/main/java/com/inmedt/ecommerce/service/GoogleOAuthService.java`** - Servicio de autenticación con Google
3. **`src/main/java/com/inmedt/ecommerce/controller/AuthController.java`** - Endpoint `/auth/google`
4. **`src/main/resources/application.properties`** - Configuración de Google Client ID

### Frontend:
1. **`frontend/src/components/GoogleLoginButton.js`** - Componente del botón de Google
2. **`frontend/src/pages/Login.js`** - Integrado botón de Google
3. **`frontend/src/pages/Register.js`** - Integrado botón de Google

### Configuración:
1. **`docker-compose.dev.yml`** - Variables de entorno agregadas
2. **`GOOGLE_OAUTH_SETUP.md`** - Guía completa de configuración

---

## 🚀 Pasos para Activar Google OAuth

### Paso 1: Obtener Google Client ID

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Navega a **"APIs & Services"** > **"Credentials"**
4. Click en **"Create Credentials"** > **"OAuth 2.0 Client ID"**
5. Configura la pantalla de consentimiento si es necesario
6. Selecciona **"Web application"**
7. Agrega los **Orígenes JavaScript autorizados**:
   ```
   http://localhost:3000
   http://localhost:8085
   ```
8. Copia el **Client ID** que se genera (algo como: `xxxxx.apps.googleusercontent.com`)

### Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI.apps.googleusercontent.com
```

**IMPORTANTE:** Reemplaza `TU_CLIENT_ID_AQUI` con tu Client ID real.

### Paso 3: Reconstruir los Contenedores

Ejecuta estos comandos en orden:

```bash
# 1. Detener los contenedores
docker compose -f docker-compose.dev.yml down

# 2. Reconstruir todo (esto instalará la nueva dependencia de Google)
docker compose -f docker-compose.dev.yml up -d --build

# 3. Ver los logs para verificar que todo está bien
docker compose -f docker-compose.dev.yml logs -f backend
```

---

## 🧪 Probar la Integración

### Modo de Prueba (Sin configurar Google Client ID):

Si ejecutas el proyecto **sin configurar el Client ID**, el botón de Google mostrará un mensaje:

> "La autenticación con Google no está configurada aún. Por favor, usa el login normal."

Esto permite que el proyecto funcione sin romper nada, pero sin la funcionalidad de Google.

### Modo Producción (Con Google Client ID configurado):

Una vez que configures el Client ID:

1. Abre el navegador en `http://localhost:3000`
2. Ve a Login o Register
3. Click en **"Continuar con Google"**
4. Se abrirá el popup de Google para autenticarse
5. Después de autenticarse, el usuario será:
   - Creado automáticamente si no existe
   - Logeado automáticamente
   - Redirigido a la página principal

---

## 🔒 Seguridad

- ✅ El token de Google es verificado en el backend
- ✅ No se guardan contraseñas para usuarios de Google (se genera una aleatoria)
- ✅ Los usuarios de Google obtienen el rol `ROLE_CLIENTE` automáticamente
- ✅ El Client ID está protegido con variables de entorno
- ⚠️ **NUNCA** subas el archivo `.env` al repositorio

---

## 📝 Notas Adicionales

### Si Google OAuth no está configurado:
- El botón aparecerá pero mostrará un mensaje informativo
- Los usuarios pueden usar login/register normal
- No afecta ninguna otra funcionalidad

### Si Google OAuth está configurado:
- Los usuarios pueden elegir entre login normal o Google
- Los usuarios de Google se crean automáticamente
- Si un usuario ya existe con ese email, se usa el existente

---

## 🐛 Troubleshooting

### Error: "Token de Google inválido"
- Verifica que el Client ID esté correctamente configurado
- Asegúrate de que el origen esté autorizado en Google Console

### Error: "Google Identity Services no está disponible"
- Verifica tu conexión a internet
- Revisa la consola del navegador para errores de scripts

### El botón no hace nada:
- Abre la consola del navegador (F12)
- Revisa si hay errores de JavaScript
- Verifica que `REACT_APP_GOOGLE_CLIENT_ID` esté configurado

---

## 📞 Comandos Útiles

```bash
# Ver logs del backend
docker compose -f docker-compose.dev.yml logs -f backend

# Ver logs del frontend
docker compose -f docker-compose.dev.yml logs -f frontend

# Reiniciar solo el backend
docker compose -f docker-compose.dev.yml restart backend

# Reiniciar solo el frontend
docker compose -f docker-compose.dev.yml restart frontend

# Ver variables de entorno del backend
docker compose -f docker-compose.dev.yml exec backend env | grep GOOGLE

# Ver variables de entorno del frontend
docker compose -f docker-compose.dev.yml exec frontend env | grep GOOGLE
```

---

¡Listo! La integración está completa. Solo necesitas obtener el Client ID de Google y reconstruir los contenedores. 🎉

