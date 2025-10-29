package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.service.CatalogoImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/catalogo")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class CatalogoImportController {

    @Autowired
    private CatalogoImportService catalogoImportService;

    @PostMapping("/importar")
    public ResponseEntity<?> importarCatalogo(@RequestParam(required = false) String filePath) {
        try {
            // Si no se proporciona ruta, usar la ruta por defecto
            if (filePath == null || filePath.isEmpty()) {
                filePath = "catalogo.json";
            }

            Map<String, Object> resultado = catalogoImportService.importarCatalogo(filePath);
            
            if ((Boolean) resultado.get("success")) {
                return ResponseEntity.ok(resultado);
            } else {
                return ResponseEntity.badRequest().body(resultado);
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
