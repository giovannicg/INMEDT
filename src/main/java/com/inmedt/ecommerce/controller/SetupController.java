package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.service.CatalogoImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador temporal para configuración inicial del sistema.
 * Este controlador NO requiere autenticación y debe ser deshabilitado en producción.
 */
@RestController
@RequestMapping("/setup")
@CrossOrigin(origins = "*")
public class SetupController {

    @Autowired
    private CatalogoImportService catalogoImportService;

    @PostMapping("/importar-catalogo")
    public ResponseEntity<?> importarCatalogoInicial() {
        try {
            // Importar desde el archivo catalogo.json en la raíz del proyecto
            Map<String, Object> resultado = catalogoImportService.importarCatalogo("catalogo.json");
            
            if ((Boolean) resultado.get("success")) {
                return ResponseEntity.ok(resultado);
            } else {
                return ResponseEntity.badRequest().body(resultado);
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "detalle", "Asegúrate de que el archivo catalogo.json esté en la raíz del proyecto"
            ));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(Map.of(
            "message", "Setup endpoint activo",
            "nota", "Este endpoint debe ser deshabilitado en producción"
        ));
    }
}
