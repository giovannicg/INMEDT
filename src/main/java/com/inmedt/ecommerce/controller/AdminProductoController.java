package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.*;
import com.inmedt.ecommerce.service.AdminProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/productos")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductoController {
    
    @Autowired
    private AdminProductoService adminProductoService;
    
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
}
