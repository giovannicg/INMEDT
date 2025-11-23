# Configuración de Google OAuth

## 1. Obtener Client ID de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a "APIs & Services" > "Credentials"
4. Click en "Create Credentials" > "OAuth 2.0 Client ID"
5. Configura el consentimiento screen si es necesario
6. Selecciona "Web application"
7. Agrega los orígenes autorizados:
   - `http://localhost:3000` (desarrollo)
   - `http://localhost:8085` (backend)
   - Tu dominio de producción
8. Agrega los URIs de redirección:
   - `http://localhost:3000` (desarrollo)
   - Tu dominio de producción

## 2. Configurar el Backend

Agregar al archivo `docker-compose.dev.yml` en la sección `backend`:

```yaml
environment:
  GOOGLE_CLIENT_ID: "TU_CLIENT_ID_AQUI.apps.googleusercontent.com"
```

## 3. Configurar el Frontend

Agregar al archivo `docker-compose.dev.yml` en la sección `frontend`:

```yaml
environment:
  REACT_APP_GOOGLE_CLIENT_ID: "TU_CLIENT_ID_AQUI.apps.googleusercontent.com"
```

## 4. Instalar dependencias del frontend

Ejecuta en el directorio `frontend/`:

```bash
npm install @react-oauth/google
```

## 5. Reiniciar los contenedores

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d --build
```

## Nota de Seguridad

- **NUNCA** subas tu Client ID a un repositorio público
- Usa variables de entorno para configuración sensible
- En producción, restringe los orígenes autorizados a tu dominio específico

