package com.inmedt.ecommerce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inmedt.ecommerce.model.*;
import com.inmedt.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class CatalogoImportService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private VarianteProductoRepository varianteProductoRepository;

    @Autowired
    private UnidadDeVentaRepository unidadDeVentaRepository;

    public Map<String, Object> importarCatalogo(String jsonFilePath) {
        Map<String, Object> resultado = new HashMap<>();
        int categoriasCreadas = 0;
        int productosCreados = 0;
        int variantesCreadas = 0;
        int unidadesCreadas = 0;
        int errores = 0;

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            
            // Buscar el archivo en la raíz del proyecto
            File jsonFile = new File(jsonFilePath);
            if (!jsonFile.exists()) {
                throw new RuntimeException("❌ Archivo no encontrado: " + jsonFilePath);
            }
            
            System.out.println("📄 Leyendo archivo: " + jsonFile.getAbsolutePath());
            
            JsonNode rootNode = objectMapper.readTree(jsonFile);
            JsonNode catalogoNode = rootNode.get("catalogo");
            JsonNode categoriasArray = catalogoNode.get("categorias");

            for (JsonNode categoriaNode : categoriasArray) {
                try {
                    String nombreCategoria = categoriaNode.get("nombre").asText();
                    
                    // Crear o buscar categoría
                    Categoria categoria = categoriaRepository.findByNombre(nombreCategoria)
                            .orElse(null);
                    
                    if (categoria == null) {
                        categoria = new Categoria();
                        categoria.setNombre(nombreCategoria);
                        categoria.setDescripcion("Categoría de " + nombreCategoria);
                        categoria.setActiva(true);
                        categoria = categoriaRepository.save(categoria);
                        categoriasCreadas++;
                        System.out.println("✅ Categoría creada: " + nombreCategoria);
                    }

                    // Procesar productos de la categoría
                    JsonNode productosArray = categoriaNode.get("productos");
                    if (productosArray != null && productosArray.isArray()) {
                        for (JsonNode productoNode : productosArray) {
                            try {
                                Producto producto = procesarProducto(productoNode, categoria);
                                if (producto != null) {
                                    productosCreados++;
                                    
                                    // Procesar variantes
                                    JsonNode variantesArray = productoNode.get("variantes");
                                    if (variantesArray != null && variantesArray.isArray()) {
                                        for (JsonNode varianteNode : variantesArray) {
                                            try {
                                                VarianteProducto variante = procesarVariante(varianteNode, producto);
                                                if (variante != null) {
                                                    variantesCreadas++;
                                                    
                                                    // Procesar unidades de venta
                                                    JsonNode unidadesArray = varianteNode.get("unidadesDeVenta");
                                                    if (unidadesArray != null && unidadesArray.isArray()) {
                                                        for (JsonNode unidadNode : unidadesArray) {
                                                            try {
                                                                UnidadDeVenta unidad = procesarUnidadVenta(unidadNode, variante);
                                                                if (unidad != null) {
                                                                    unidadesCreadas++;
                                                                }
                                                            } catch (Exception e) {
                                                                errores++;
                                                                System.err.println("❌ Error en unidad: " + e.getMessage());
                                                            }
                                                        }
                                                    }
                                                }
                                            } catch (Exception e) {
                                                errores++;
                                                System.err.println("❌ Error en variante: " + e.getMessage());
                                            }
                                        }
                                    }
                                }
                            } catch (Exception e) {
                                errores++;
                                System.err.println("❌ Error en producto: " + e.getMessage());
                            }
                        }
                    }
                } catch (Exception e) {
                    errores++;
                    System.err.println("❌ Error en categoría: " + e.getMessage());
                }
            }

            resultado.put("success", true);
            resultado.put("categoriasCreadas", categoriasCreadas);
            resultado.put("productosCreados", productosCreados);
            resultado.put("variantesCreadas", variantesCreadas);
            resultado.put("unidadesCreadas", unidadesCreadas);
            resultado.put("errores", errores);
            resultado.put("mensaje", "Importación completada con " + errores + " errores");

        } catch (Exception e) {
            resultado.put("success", false);
            resultado.put("error", e.getMessage());
            e.printStackTrace();
        }

        return resultado;
    }

    private Producto procesarProducto(JsonNode productoNode, Categoria categoria) {
        try {
            String nombre = productoNode.get("nombre").asText();
            // Truncar nombre si es muy largo
            if (nombre.length() > 200) {
                nombre = nombre.substring(0, 197) + "...";
            }
            
            String descripcion = productoNode.has("descripcion") && !productoNode.get("descripcion").isNull() 
                    ? productoNode.get("descripcion").asText() 
                    : "";
            // Truncar descripción si es muy larga
            if (descripcion.length() > 1000) {
                descripcion = descripcion.substring(0, 997) + "...";
            }
            
            String marca = productoNode.has("marca") && !productoNode.get("marca").isNull() 
                    ? productoNode.get("marca").asText() 
                    : "Sin marca";
            // Truncar marca si es muy larga
            if (marca.length() > 100) {
                marca = marca.substring(0, 97) + "...";
            }

            // Verificar si el producto ya existe
            if (productoRepository.existsByNombreAndCategoriaId(nombre, categoria.getId())) {
                System.out.println("⚠️  Producto ya existe: " + nombre);
                return productoRepository.findByNombreAndCategoriaId(nombre, categoria.getId()).orElse(null);
            }

            Producto producto = new Producto();
            producto.setNombre(nombre);
            producto.setDescripcion(descripcion);
            producto.setMarca(marca);
            producto.setCategoria(categoria);
            producto.setActivo(true);

            producto = productoRepository.save(producto);
            System.out.println("  ✅ Producto creado: " + nombre);
            return producto;

        } catch (Exception e) {
            System.err.println("❌ Error al procesar producto: " + e.getMessage());
            return null;
        }
    }

    private VarianteProducto procesarVariante(JsonNode varianteNode, Producto producto) {
        try {
            String nombreVariante = varianteNode.get("nombre").asText();

            // Verificar si la variante ya existe
            if (varianteProductoRepository.existsByNombreAndProductoId(nombreVariante, producto.getId())) {
                System.out.println("    ⚠️  Variante ya existe: " + nombreVariante);
                return varianteProductoRepository.findByNombreAndProductoId(nombreVariante, producto.getId()).orElse(null);
            }

            VarianteProducto variante = new VarianteProducto();
            variante.setNombre(nombreVariante);
            variante.setDescripcion("Variante " + nombreVariante);
            variante.setProducto(producto);
            variante.setActiva(true);

            variante = varianteProductoRepository.save(variante);
            System.out.println("    ✅ Variante creada: " + nombreVariante);
            return variante;

        } catch (Exception e) {
            System.err.println("❌ Error al procesar variante: " + e.getMessage());
            return null;
        }
    }

    private UnidadDeVenta procesarUnidadVenta(JsonNode unidadNode, VarianteProducto variante) {
        try {
            String descripcion = unidadNode.get("descripcion").asText();
            BigDecimal precio = BigDecimal.valueOf(unidadNode.get("precio").asDouble());

            // Generar SKU único
            String sku = generarSKUUnico(variante, descripcion);

            // Verificar si ya existe una unidad con este SKU
            if (unidadDeVentaRepository.findBySku(sku).isPresent()) {
                System.out.println("      ⚠️  Unidad ya existe: " + descripcion + " (SKU: " + sku + ")");
                return unidadDeVentaRepository.findBySku(sku).get();
            }

            UnidadDeVenta unidad = new UnidadDeVenta();
            unidad.setSku(sku);
            unidad.setDescripcion(descripcion);
            unidad.setPrecio(precio);
            unidad.setStock(100); // Stock inicial por defecto
            unidad.setVariante(variante);
            unidad.setActiva(true);

            unidad = unidadDeVentaRepository.save(unidad);
            System.out.println("      ✅ Unidad creada: " + descripcion + " - $" + precio);
            return unidad;

        } catch (Exception e) {
            System.err.println("❌ Error al procesar unidad de venta: " + e.getMessage());
            return null;
        }
    }

    private String generarSKU(VarianteProducto variante, String descripcion) {
        // Generar un SKU basado en el producto, variante y descripción
        String productoNombre = variante.getProducto().getNombre()
                .replaceAll("[^A-Za-z0-9]", "")
                .toUpperCase();
        String varianteNombre = variante.getNombre()
                .replaceAll("[^A-Za-z0-9]", "")
                .toUpperCase();
        
        // Tomar primeras 3 letras del producto, primeras 3 de la variante
        String skuBase = (productoNombre.length() > 3 ? productoNombre.substring(0, 3) : productoNombre) + 
                         "-" + 
                         (varianteNombre.length() > 3 ? varianteNombre.substring(0, 3) : varianteNombre);
        
        // Agregar un timestamp corto para unicidad
        String timestamp = String.valueOf(System.currentTimeMillis() % 100000);
        
        return skuBase + "-" + timestamp;
    }

    private String generarSKUUnico(VarianteProducto variante, String descripcion) {
        String skuBase = generarSKU(variante, descripcion);
        String sku = skuBase;
        int contador = 1;
        
        // Si el SKU ya existe, agregar un contador
        while (unidadDeVentaRepository.findBySku(sku).isPresent()) {
            sku = skuBase + "-" + contador;
            contador++;
        }
        
        return sku;
    }
}
