# 🔧 Soluciones Aplicadas - Problema de Registro de Usuarios

## 📋 Resumen del Problema

**Síntoma:** Los productos se pueden ver, pero no se puede crear un usuario.

**Error observado:** 400 Bad Request al intentar registrar un usuario desde el frontend desplegado en Vercel hacia el backend en Render.

---

## ✅ Soluciones Implementadas

### 1. **Mejora en la Configuración de CORS** 

**Archivo:** `src/main/java/com/inmedt/ecommerce/security/SecurityConfig.java`

**Cambios:**
- ✅ Agregado método PATCH a los métodos permitidos
- ✅ Agregado `setExposedHeaders` para Authorization
- ✅ Agregado `setMaxAge(3600L)` para cachear preflight requests
- ✅ Mejorada la limpieza de espacios en los orígenes permitidos

```java
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
configuration.setExposedHeaders(Arrays.asList("Authorization"));
configuration.setAllowCredentials(true);
configuration.setMaxAge(3600L);
```

**Por qué era necesario:**
- Los navegadores hacen peticiones OPTIONS (preflight) antes de POST
- Sin la configuración correcta, estas peticiones fallaban
- El MaxAge evita hacer preflight en cada petición

---

### 2. **Mejora en el Manejo del Campo `rucCedula`**

**Archivo:** `src/main/java/com/inmedt/ecommerce/dto/RegisterRequest.java`

**Cambios:**
- ✅ Agregada anotación `@JsonSetter(nulls = Nulls.AS_EMPTY)` al campo `rucCedula`

```java
@JsonSetter(nulls = Nulls.AS_EMPTY)
private String rucCedula;
```

**Por qué era necesario:**
- El frontend enviaba `null` para campos opcionales
- Jackson (librería JSON de Spring) necesitaba instrucciones explícitas sobre cómo manejar valores null

---

### 3. **Limpieza de Datos en el Servicio**

**Archivo:** `src/main/java/com/inmedt/ecommerce/service/AuthService.java`

**Cambios:**
- ✅ Agregada lógica para convertir strings vacíos a null antes de validar

```java
// Limpiar rucCedula si está vacío o es null
String rucCedulaClean = request.getRucCedula();
if (rucCedulaClean != null && rucCedulaClean.trim().isEmpty()) {
    rucCedulaClean = null;
}
```

**Por qué era necesario:**
- Prevenir errores de validación con strings vacíos
- Mantener consistencia en la base de datos (null vs string vacío)

---

### 4. **Mejora en el Frontend**

**Archivo:** `frontend/src/pages/Register.js`

**Cambios:**
- ✅ Mejorada la lógica para enviar string vacío en lugar de null

```javascript
rucCedula: formData.rucCedula && formData.rucCedula.trim() !== '' ? formData.rucCedula : ''
```

**Por qué era necesario:**
- Evitar enviar `null` en el JSON
- Asegurar compatibilidad con la validación del backend

---

### 5. **Actualización de Variables de Entorno**

**Archivo:** `src/main/resources/application-prod.properties`

**Cambios:**
- ✅ Agregado soporte para subdominios de Vercel

```properties
spring.web.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:https://*.vercel.app,https://inmedt.vercel.app,https://inmedt.onrender.com}
```

**Por qué era necesario:**
- Vercel genera subdominios únicos para cada deployment y preview
- Necesitamos permitir todos los subdominios de vercel.app

---

## 🚀 Pasos para Desplegar las Correcciones

### Paso 1: Subir los Cambios al Repositorio

```bash
# Estás en: /Users/giovannicapote/Documents/INMEDT
git add .
git commit -m "Fix: Corregido registro de usuarios - CORS y manejo de rucCedula"
git push origin main
```

### Paso 2: Verificar Variables de Entorno en Render

Ve a [Render Dashboard](https://dashboard.render.com) y verifica que tengas configurado:

```
CORS_ALLOWED_ORIGINS=https://inmedt.vercel.app,https://*.vercel.app
```

⚠️ **MUY IMPORTANTE:** 
- Si no tienes esta variable, CRÉALA
- NO incluyas espacios entre las comas
- Incluye TODOS los dominios (principal y wildcard para previews)

### Paso 3: Redeploy en Render

Render detectará automáticamente los cambios y hará el redeploy. Si no:
1. Ve a tu servicio en Render
2. Click en "Manual Deploy" → "Deploy latest commit"

### Paso 4: Verificar el Frontend en Vercel

Vercel también debe hacer redeploy automáticamente. Verifica en:
1. [Vercel Dashboard](https://vercel.com/dashboard)
2. Tu proyecto → Deployments
3. Verifica que el último deployment tenga estado "Ready"

---

## 🧪 Cómo Probar

### Opción 1: Usar el Script de Prueba

```bash
./test-registro.sh
```

Este script hará una petición de prueba al endpoint de registro y te mostrará:
- ✅ Si el registro funciona correctamente
- ❌ Si hay errores y cuáles podrían ser las causas

### Opción 2: Probar Manualmente

1. Ve a: https://inmedt.vercel.app/register
2. Completa el formulario:
   - Nombre: "Test Usuario"
   - Email: "test@ejemplo.com" (usa un email único cada vez)
   - RUC/Cédula: (déjalo vacío o complétalo)
   - Contraseña: "Test123456"
   - Confirmar contraseña: "Test123456"
3. Click en "Crear cuenta"

**Resultado esperado:**
- ✅ Mensaje de éxito: "¡Registro exitoso! Bienvenido"
- ✅ Redirección automática a la página principal
- ✅ Usuario autenticado (puedes ver tu nombre en la barra de navegación)

### Opción 3: Probar con cURL

```bash
curl -X POST https://inmedt.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Usuario",
    "email": "test@ejemplo.com",
    "password": "Test123456",
    "rucCedula": ""
  }'
```

---

## 🔍 Debugging

Si después de aplicar estos cambios aún tienes problemas:

### 1. Verifica los Logs de Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Selecciona tu servicio del backend
3. Ve a "Logs"
4. Busca mensajes que contengan:
   - `Intento de registro para email:`
   - `Error en registro para email:`
   - `CORS`

### 2. Verifica la Consola del Navegador

1. Abre la página de registro: https://inmedt.vercel.app/register
2. Presiona F12 (o Cmd+Option+I en Mac)
3. Ve a la pestaña "Console"
4. Intenta registrarte
5. Observa si hay errores relacionados con:
   - CORS
   - 400 Bad Request
   - Network errors

### 3. Verifica las Variables de Entorno

**En Render:**
- `CORS_ALLOWED_ORIGINS` debe incluir el dominio de Vercel
- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` deben estar correctas

**En Vercel:**
- `REACT_APP_API_URL=https://inmedt.onrender.com`

---

## 📊 Comparación Antes vs Después

### Antes ❌
```
Frontend (Vercel) → POST /api/auth/register → Backend (Render)
                                               ↓
                                            Error 400
                                            CORS Error
                                            rucCedula: null causa problemas
```

### Después ✅
```
Frontend (Vercel) → POST /api/auth/register → Backend (Render)
                                               ↓
                                            CORS OK ✅
                                            rucCedula manejado correctamente ✅
                                            Usuario creado ✅
                                            Token JWT generado ✅
```

---

## 📚 Archivos Modificados

1. ✅ `src/main/java/com/inmedt/ecommerce/security/SecurityConfig.java`
2. ✅ `src/main/java/com/inmedt/ecommerce/dto/RegisterRequest.java`
3. ✅ `src/main/java/com/inmedt/ecommerce/service/AuthService.java`
4. ✅ `frontend/src/pages/Register.js`
5. ✅ `src/main/resources/application-prod.properties`

## 📄 Documentos Creados

1. ✅ `DEPLOY_RENDER_VERCEL.md` - Guía completa de despliegue
2. ✅ `test-registro.sh` - Script de prueba automatizado
3. ✅ `SOLUCIONES_APLICADAS.md` - Este documento

---

## 🎯 Próximos Pasos

1. [ ] Hacer commit y push de los cambios
2. [ ] Verificar que Render redeploy automáticamente
3. [ ] Verificar que Vercel redeploy automáticamente
4. [ ] Configurar las variables de entorno en Render (si no están)
5. [ ] Probar el registro de usuario
6. [ ] Verificar que el login funcione
7. [ ] Verificar que el carrito funcione después del registro

---

## 💡 Consejos Adicionales

- **Siempre revisa los logs** cuando algo no funcione
- **Usa el script de prueba** para verificar rápidamente el backend
- **Mantén las variables de entorno actualizadas** en ambos servicios
- **Documenta los cambios** para futuras referencias

---

## 🆘 ¿Necesitas Más Ayuda?

Si después de aplicar todas estas correcciones aún tienes problemas:

1. Ejecuta el script de prueba y comparte el output
2. Comparte los logs de Render (últimas 50 líneas)
3. Comparte los errores de la consola del navegador
4. Verifica que TODAS las variables de entorno estén configuradas

---

**Creado:** 25 de Noviembre, 2025
**Última actualización:** 25 de Noviembre, 2025

