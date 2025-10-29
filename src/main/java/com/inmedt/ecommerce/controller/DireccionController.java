package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.DireccionRequest;
import com.inmedt.ecommerce.dto.DireccionResponse;
import com.inmedt.ecommerce.model.User;
import com.inmedt.ecommerce.repository.UserRepository;
import com.inmedt.ecommerce.service.DireccionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/direcciones")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public class DireccionController {

    @Autowired
    private DireccionService direccionService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<DireccionResponse>> getMisDirecciones(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            // Necesitamos obtener el ID del usuario desde el email
            // Por simplicidad, asumimos que tenemos un método para esto
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            List<DireccionResponse> direcciones = direccionService.getDireccionesByUser(userId);
            return ResponseEntity.ok(direcciones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createDireccion(
            @Valid @RequestBody DireccionRequest request,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            DireccionResponse direccion = direccionService.createDireccion(userId, request);
            return ResponseEntity.ok(direccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDireccion(
            @PathVariable Long id,
            @Valid @RequestBody DireccionRequest request,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            DireccionResponse direccion = direccionService.updateDireccion(userId, id, request);
            return ResponseEntity.ok(direccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDireccion(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            direccionService.deleteDireccion(userId, id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/principal")
    public ResponseEntity<?> setPrincipal(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            DireccionResponse direccion = direccionService.setPrincipal(userId, id);
            return ResponseEntity.ok(direccion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/principal")
    public ResponseEntity<DireccionResponse> getDireccionPrincipal(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            DireccionResponse direccion = direccionService.getDireccionPrincipal(userId);
            if (direccion != null) {
                return ResponseEntity.ok(direccion);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Método auxiliar para obtener el ID del usuario desde el email
    private Long getUserIdFromEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return user.getId();
    }
}
