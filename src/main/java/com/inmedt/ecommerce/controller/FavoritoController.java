package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.FavoritoResponse;
import com.inmedt.ecommerce.model.User;
import com.inmedt.ecommerce.repository.UserRepository;
import com.inmedt.ecommerce.service.FavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favoritos")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<FavoritoResponse>> getMisFavoritos(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            List<FavoritoResponse> favoritos = favoritoService.getFavoritosByUser(userId);
            return ResponseEntity.ok(favoritos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{productoId}")
    public ResponseEntity<?> addFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            FavoritoResponse favorito = favoritoService.addFavorito(userId, productoId);
            return ResponseEntity.ok(favorito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<?> removeFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            favoritoService.removeFavorito(userId, productoId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{productoId}/toggle")
    public ResponseEntity<?> toggleFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            FavoritoResponse favorito = favoritoService.toggleFavorito(userId, productoId);
            
            if (favorito != null) {
                return ResponseEntity.ok(Map.of("action", "added", "favorito", favorito));
            } else {
                return ResponseEntity.ok(Map.of("action", "removed"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{productoId}/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Long userId = getUserIdFromEmail(userDetails.getUsername());
            
            boolean isFavorito = favoritoService.isFavorito(userId, productoId);
            return ResponseEntity.ok(Map.of("isFavorito", isFavorito));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/producto/{productoId}/count")
    public ResponseEntity<Map<String, Long>> getFavoritosCount(@PathVariable Long productoId) {
        try {
            long count = favoritoService.getFavoritosCountByProducto(productoId);
            return ResponseEntity.ok(Map.of("count", count));
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
