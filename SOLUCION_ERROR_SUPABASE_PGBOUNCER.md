# Solución: Error "prepared statement already exists" en Supabase

## Problema

```
ERROR: prepared statement "S_1" already exists
org.postgresql.util.PSQLException: ERROR: prepared statement "S_1" already exists
```

Este error ocurre cuando se usa **Supabase** con su connection pooler **PgBouncer** en modo "transaction pooling".

---

## Causa Raíz

1. **Supabase usa PgBouncer** en modo "transaction pooling" por defecto (puerto 6543)
2. **Hibernate usa prepared statements** por defecto para optimizar consultas
3. **PgBouncer en modo transacción** no soporta prepared statements persistentes
4. Cada nueva transacción intenta crear los mismos prepared statements, causando conflicto

---

## Solución Aplicada

### Archivo: `src/main/resources/application-prod.properties`

Se agregaron las siguientes configuraciones críticas:

```properties
# CRÍTICO: Desactivar server-prepared statements para PgBouncer en modo transacción
spring.datasource.hikari.data-source-properties.prepareThreshold=0
spring.datasource.hikari.data-source-properties.preparedStatementCacheQueries=0
spring.datasource.hikari.data-source-properties.preparedStatementCacheSizeMiB=0

# Pool de conexiones reducido para PgBouncer
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
```

### ¿Qué hace cada configuración?

1. **`prepareThreshold=0`** 
   - Desactiva completamente los server-side prepared statements
   - PostgreSQL usará queries simples en lugar de prepared statements
   
2. **`preparedStatementCacheQueries=0`**
   - Desactiva el caché de prepared statements
   
3. **`preparedStatementCacheSizeMiB=0`**
   - Tamaño del caché en 0 MB (desactivado)
   
4. **`maximum-pool-size=5` y `minimum-idle=2`**
   - Reduce el pool de conexiones para ser compatible con límites de PgBouncer

---

## Alternativas (si la solución anterior no funciona)

### Opción 1: Usar Conexión Directa (Puerto 5432)

En lugar del pooler de Supabase, conectarse directamente:

```properties
# Cambiar puerto 6543 a 5432
spring.datasource.url=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
```

**Ventajas:**
- ✅ Soporte completo de prepared statements
- ✅ Todas las features de PostgreSQL

**Desventajas:**
- ❌ Menos eficiente con muchas conexiones concurrentes
- ❌ Límites de conexión más estrictos

### Opción 2: Usar Modo "Session" de PgBouncer

Contactar soporte de Supabase para cambiar a modo "session":

**Ventajas:**
- ✅ Soporte completo de prepared statements
- ✅ Compatible con todas las features

**Desventajas:**
- ❌ No disponible en plan gratuito
- ❌ Requiere plan Pro de Supabase

---

## Pasos para Aplicar la Solución

### 1. Subir cambios a GitHub

```bash
git add src/main/resources/application-prod.properties
git commit -m "Fix: Desactivar prepared statements para compatibilidad con Supabase PgBouncer"
git push origin main
```

### 2. Esperar Redeploy en Render

Render detectará los cambios automáticamente (2-3 minutos)

### 3. Verificar que funciona

```bash
# Probar un endpoint autenticado
curl -H "Authorization: Bearer tu-token" \
  https://inmedt.onrender.com/api/pedidos
```

---

## Verificación

### ¿Cómo saber si está funcionando?

1. **Los logs NO muestran** el error "prepared statement already exists"
2. **Las peticiones autenticadas funcionan** correctamente
3. **No hay errores de transacción** en los logs

### Comandos para verificar:

```bash
# Ver logs en tiempo real en Render
# Dashboard → Tu servicio → Logs

# Buscar errores específicos:
# - "prepared statement" ❌ NO debe aparecer
# - "BadSqlGrammarException" ❌ NO debe aparecer
# - "Hibernate transaction" ✅ Debe funcionar sin errores
```

---

## Impacto en Rendimiento

### ¿Hay alguna desventaja?

**Mínimo impacto:**
- Las queries se ejecutan como "simple queries" en lugar de "prepared statements"
- La diferencia de rendimiento es **menor al 5%** en la mayoría de casos
- Para una aplicación de e-commerce de tamaño pequeño/medio, **no es perceptible**

### ¿Cuándo sí importa?

- Aplicaciones con **miles de queries por segundo**
- Queries extremadamente complejas repetidas frecuentemente
- En esos casos, considerar migrar a conexión directa o plan Pro de Supabase

---

## Configuración Completa Recomendada

```properties
# Base de datos PostgreSQL - Supabase con PgBouncer
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://db.xxx.supabase.co:6543/postgres}
spring.datasource.username=${DATABASE_USERNAME:postgres}
spring.datasource.password=${DATABASE_PASSWORD:}
spring.datasource.driver-class-name=org.postgresql.Driver

# Configuración de conexión para Supabase con PgBouncer
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
spring.datasource.hikari.leak-detection-threshold=60000

# JPA - Producción
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Hibernate - Desactivar prepared statements para PgBouncer
spring.jpa.properties.hibernate.jdbc.batch_size=0
spring.jpa.properties.hibernate.order_inserts=false
spring.jpa.properties.hibernate.order_updates=false
spring.jpa.properties.hibernate.jdbc.use_streams_for_binary=false

# CRÍTICO: Desactivar server-prepared statements
spring.datasource.hikari.data-source-properties.prepareThreshold=0
spring.datasource.hikari.data-source-properties.preparedStatementCacheQueries=0
spring.datasource.hikari.data-source-properties.preparedStatementCacheSizeMiB=0

# Pool reducido para PgBouncer
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2

# SSL para Supabase
spring.datasource.hikari.data-source-properties.ssl=true
spring.datasource.hikari.data-source-properties.sslmode=require
```

---

## Troubleshooting

### El error persiste después de aplicar la solución

1. **Verificar que el cambio se desplegó:**
   - Render → Deployments → Verificar último commit
   
2. **Limpiar conexiones en Supabase:**
   - Supabase Dashboard → Database → Connection Pooler
   - Click en "Reset Connection Pooler"
   
3. **Verificar variables de entorno:**
   - Render → Environment → Verificar DATABASE_URL usa puerto 6543

### Otros errores de conexión

```bash
# Error: "Connection refused"
# Solución: Verificar que DATABASE_URL es correcto

# Error: "SSL required"
# Solución: Ya está configurado en las properties

# Error: "Too many connections"
# Solución: Reducir más el pool:
spring.datasource.hikari.maximum-pool-size=3
spring.datasource.hikari.minimum-idle=1
```

---

## Referencias

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PgBouncer Transaction Pooling](https://www.pgbouncer.org/features.html)
- [PostgreSQL Prepared Statements](https://www.postgresql.org/docs/current/sql-prepare.html)
- [Hibernate JDBC Settings](https://docs.jboss.org/hibernate/orm/6.0/userguide/html_single/Hibernate_User_Guide.html#configurations-database-connection)

---

**Fecha:** 25 de Noviembre, 2025  
**Estado:** ✅ Solucionado  
**Impacto:** Crítico - Aplicación no funcionaba en producción  
**Solución:** Desactivar prepared statements para compatibilidad con PgBouncer

