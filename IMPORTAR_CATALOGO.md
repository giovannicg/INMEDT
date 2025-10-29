# 📦 Guía para Importar el Catálogo a la Base de Datos

## 🚀 Método 1: Usando el Endpoint REST (Recomendado)

### Paso 1: Asegúrate de que el archivo esté en la ubicación correcta
El archivo `catalogo.json` debe estar en la **raíz del proyecto** (donde está el `pom.xml`).

### Paso 2: Inicia la aplicación
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Paso 3: Ejecuta la importación

Puedes usar cualquiera de estos métodos:

#### Opción A: Usando curl (Terminal/PowerShell)
```bash
curl -X POST http://localhost:8085/setup/importar-catalogo
```

#### Opción B: Usando PowerShell
```powershell
Invoke-WebRequest -Uri "http://localhost:8085/setup/importar-catalogo" -Method POST
```

#### Opción C: Usando Postman o Thunder Client
- **Method**: POST
- **URL**: `http://localhost:8085/setup/importar-catalogo`
- **Headers**: No se requieren
- **Body**: No se requiere

#### Opción D: Desde el navegador
Simplemente abre esta URL en tu navegador:
```
http://localhost:8085/setup/importar-catalogo
```

### Paso 4: Verifica la respuesta
Deberías recibir una respuesta JSON como esta:

```json
{
  "success": true,
  "categoriasCreadas": 15,
  "productosCreados": 150,
  "variantesCreadas": 500,
  "unidadesCreadas": 800,
  "mensaje": "Importación completada exitosamente"
}
```

## 📊 ¿Qué se importará?

El sistema importará automáticamente desde el archivo `catalogo.json`:

- ✅ **15 Categorías** (Guantes, Resucitadores, Agujas y Jeringas, etc.)
- ✅ **Productos** con sus descripciones y marcas
- ✅ **Variantes** de cada producto (tallas, colores, números, etc.)
- ✅ **Unidades de Venta** con precios y descripciones

### Categorías que se importarán:
1. Guantes
2. Resucitadores
3. Agujas y Jeringas
4. Catéteres
5. Algodón
6. Antisépticos y Desinfección
7. Suturas
8. Esparadrapos
9. Insumos Varios
10. Ropa Descartable
11. Soluciones
12. Vendas
13. Insumos Ginecológicos
14. Esterilización

## ⚙️ Características del Importador

- 🔄 **Evita duplicados**: Si un producto ya existe, no lo vuelve a crear
- 📦 **SKU automático**: Genera SKUs únicos para cada unidad de venta
- 💰 **Precios en USD**: Todos los precios se importan correctamente
- 📊 **Stock inicial**: Cada unidad empieza con stock de 100 unidades
- ✅ **Activación automática**: Todos los productos se marcan como activos

## 🔍 Verificar la Importación

Después de importar, puedes verificar que todo se importó correctamente:

1. **Ver categorías**:
   ```
   http://localhost:8085/categorias
   ```

2. **Ver productos**:
   ```
   http://localhost:8085/productos
   ```

3. **Ver un producto específico** (ejemplo: ID 1):
   ```
   http://localhost:8085/productos/1
   ```

## ⚠️ Notas Importantes

1. **Ejecutar una sola vez**: La importación debe ejecutarse solo una vez cuando la base de datos esté vacía.

2. **Endpoint temporal**: El endpoint `/setup/**` está diseñado para configuración inicial y debe ser deshabilitado en producción.

3. **Si necesitas reimportar**:
   - Detén la aplicación
   - Elimina la base de datos (o usa `docker-compose down -v`)
   - Vuelve a iniciar y ejecuta la importación

## 🐛 Solución de Problemas

### Error: "Archivo no encontrado"
- ✅ Verifica que `catalogo.json` esté en la raíz del proyecto (mismo nivel que `pom.xml`)
- ✅ Verifica que el nombre del archivo sea exactamente `catalogo.json`

### Error: "Productos ya existen"
- ℹ️ Esto es normal si ya ejecutaste la importación antes
- ℹ️ El sistema detecta duplicados automáticamente

### Error de conexión
- ✅ Verifica que el backend esté corriendo: `http://localhost:8085/setup/status`
- ✅ Verifica que PostgreSQL esté corriendo: `docker ps`

## 📝 Logs

Durante la importación, verás logs en la consola del backend:
```
✅ Categoría creada: Guantes
  ✅ Producto creado: Guantes de Examinación Látex
    ✅ Variante creada: X-Small
      ✅ Unidad creada: Caja x 100 Unidades - $3.30
      ✅ Unidad creada: Carton x 10 Cajitas - $33.00
```

---

**¡Listo!** Tu catálogo completo estará disponible en la aplicación. 🎉

