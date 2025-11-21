package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.CategoriaRequest;
import com.inmedt.ecommerce.dto.CategoriaResponse;
import com.inmedt.ecommerce.service.AdminCategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/categorias")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@CrossOrigin(origins = "*")
public class AdminCategoriaController {

    @Autowired
    private AdminCategoriaService adminCategoriaService;

    @GetMapping
    public ResponseEntity<Page<CategoriaResponse>> getAllCategorias(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CategoriaResponse> categorias = adminCategoriaService.getAllCategorias(pageable);
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> getCategoriaById(@PathVariable Long id) {
        CategoriaResponse categoria = adminCategoriaService.getCategoriaById(id);
        return ResponseEntity.ok(categoria);
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> createCategoria(@Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse categoria = adminCategoriaService.createCategoria(request);
        return ResponseEntity.ok(categoria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> updateCategoria(
            @PathVariable Long id, 
            @Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse categoria = adminCategoriaService.updateCategoria(id, request);
        return ResponseEntity.ok(categoria);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CategoriaResponse> toggleCategoriaStatus(
            @PathVariable Long id,
            @RequestParam boolean activa) {
        CategoriaResponse categoria = adminCategoriaService.toggleCategoriaStatus(id, activa);
        return ResponseEntity.ok(categoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Long id) {
        adminCategoriaService.deleteCategoria(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalCategorias() {
        Long count = adminCategoriaService.getTotalCategorias();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Endpoint funcionando correctamente");
    }
}
