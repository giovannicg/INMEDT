package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.*;
import com.inmedt.ecommerce.service.AdminProductoService;
import com.inmedt.ecommerce.service.ImageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/productos")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminProductoController {
    
    @Autowired
    private AdminProductoService adminProductoService;
    
    @Autowired
    private ImageService imageService;
    
    // Gestión de Productos
    @GetMapping
    public ResponseEntity<Page<ProductoResponse>> getAllProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nombre") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ProductoResponse> productos = adminProductoService.getAllProductos(pageable);
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductoById(@PathVariable Long id) {
        try {
            ProductoResponse producto = adminProductoService.getProductoById(id);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createProducto(@Valid @RequestBody ProductoRequest request) {
        try {
            ProductoResponse producto = adminProductoService.createProducto(request);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        try {
            ProductoResponse producto = adminProductoService.updateProducto(id, request);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Long id) {
        try {
            adminProductoService.deleteProducto(id);
            return ResponseEntity.ok("Producto eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Gestión de Categorías
    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaResponse>> getAllCategorias() {
        List<CategoriaResponse> categorias = adminProductoService.getAllCategorias();
        return ResponseEntity.ok(categorias);
    }
    
    @PostMapping("/categorias")
    public ResponseEntity<?> createCategoria(@Valid @RequestBody CategoriaRequest request) {
        try {
            CategoriaResponse categoria = adminProductoService.createCategoria(request);
            return ResponseEntity.ok(categoria);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/categorias/{id}")
    public ResponseEntity<?> updateCategoria(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        try {
            CategoriaResponse categoria = adminProductoService.updateCategoria(id, request);
            return ResponseEntity.ok(categoria);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<?> deleteCategoria(@PathVariable Long id) {
        try {
            adminProductoService.deleteCategoria(id);
            return ResponseEntity.ok("Categoría eliminada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Gestión de Variantes
    @GetMapping("/{productoId}/variantes")
    public ResponseEntity<List<ProductoResponse.VarianteResponse>> getVariantesByProducto(@PathVariable Long productoId) {
        List<ProductoResponse.VarianteResponse> variantes = adminProductoService.getVariantesByProducto(productoId);
        return ResponseEntity.ok(variantes);
    }
    
    @PostMapping("/variantes")
    public ResponseEntity<?> createVariante(@Valid @RequestBody VarianteRequest request) {
        try {
            ProductoResponse.VarianteResponse variante = adminProductoService.createVariante(request);
            return ResponseEntity.ok(variante);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/variantes/{id}")
    public ResponseEntity<?> updateVariante(@PathVariable Long id, @Valid @RequestBody VarianteUpdateRequest request) {
        try {
            ProductoResponse.VarianteResponse variante = adminProductoService.updateVariante(id, request);
            return ResponseEntity.ok(variante);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/variantes/{id}")
    public ResponseEntity<?> deleteVariante(@PathVariable Long id) {
        try {
            adminProductoService.deleteVariante(id);
            return ResponseEntity.ok("Variante eliminada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Gestión de Unidades de Venta
    @GetMapping("/variantes/{varianteId}/unidades")
    public ResponseEntity<List<ProductoResponse.UnidadVentaResponse>> getUnidadesByVariante(@PathVariable Long varianteId) {
        List<ProductoResponse.UnidadVentaResponse> unidades = adminProductoService.getUnidadesByVariante(varianteId);
        return ResponseEntity.ok(unidades);
    }
    
    @PostMapping("/unidades")
    public ResponseEntity<?> createUnidadVenta(@Valid @RequestBody UnidadVentaRequest request) {
        try {
            ProductoResponse.UnidadVentaResponse unidad = adminProductoService.createUnidadVenta(request);
            return ResponseEntity.ok(unidad);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/unidades/{id}")
    public ResponseEntity<?> updateUnidadVenta(@PathVariable Long id, @Valid @RequestBody UnidadVentaUpdateRequest request) {
        try {
            ProductoResponse.UnidadVentaResponse unidad = adminProductoService.updateUnidadVenta(id, request);
            return ResponseEntity.ok(unidad);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/unidades/{id}")
    public ResponseEntity<?> deleteUnidadVenta(@PathVariable Long id) {
        try {
            adminProductoService.deleteUnidadVenta(id);
            return ResponseEntity.ok("Unidad de venta eliminada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Gestión de Imágenes
    @PostMapping("/{id}/imagen-principal")
    public ResponseEntity<?> uploadImagenPrincipal(
            @PathVariable Long id,
            @RequestParam("imagen") MultipartFile file) {
        try {
            Map<String, String> urls = imageService.saveProductImage(file, true);
            String mainUrl = urls.get("main");
            String thumbnailUrl = urls.get("thumbnail");
            
            ProductoResponse producto = adminProductoService.updateImagenPrincipal(id, mainUrl, thumbnailUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imagenPrincipal", producto.getImagenPrincipal());
            response.put("imagenThumbnail", producto.getImagenThumbnail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PostMapping("/{id}/imagenes-galeria")
    public ResponseEntity<?> uploadImagenGaleria(
            @PathVariable Long id,
            @RequestParam("imagen") MultipartFile file) {
        try {
            Map<String, String> urls = imageService.saveProductImage(file, false);
            String mainUrl = urls.get("main");
            
            ProductoResponse producto = adminProductoService.addImagenGaleria(id, mainUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imagenesGaleria", producto.getImagenesGaleria());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{id}/imagen-principal")
    public ResponseEntity<?> deleteImagenPrincipal(@PathVariable Long id) {
        try {
            adminProductoService.deleteImagenPrincipal(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Imagen eliminada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{productoId}/imagenes-galeria")
    public ResponseEntity<?> deleteImagenGaleria(
            @PathVariable Long productoId,
            @RequestParam("filename") String filename) {
        try {
            ProductoResponse producto = adminProductoService.deleteImagenGaleria(productoId, filename);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("imagenesGaleria", producto.getImagenesGaleria());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
