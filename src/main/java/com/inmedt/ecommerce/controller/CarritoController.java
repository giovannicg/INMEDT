package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.AddToCartRequest;
import com.inmedt.ecommerce.dto.CarritoResponse;
import com.inmedt.ecommerce.dto.UpdateCartItemRequest;
import com.inmedt.ecommerce.service.CarritoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {
    
    @Autowired
    private CarritoService carritoService;
    
    @GetMapping
    public ResponseEntity<CarritoResponse> getCarrito() {
        CarritoResponse carrito = carritoService.getCarrito();
        return ResponseEntity.ok(carrito);
    }
    
    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        try {
            CarritoResponse carrito = carritoService.addToCart(request);
            return ResponseEntity.ok(carrito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId, 
                                           @Valid @RequestBody UpdateCartItemRequest request) {
        try {
            CarritoResponse carrito = carritoService.updateCartItem(itemId, request);
            return ResponseEntity.ok(carrito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long itemId) {
        try {
            CarritoResponse carrito = carritoService.removeFromCart(itemId);
            return ResponseEntity.ok(carrito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping
    public ResponseEntity<CarritoResponse> clearCart() {
        CarritoResponse carrito = carritoService.clearCart();
        return ResponseEntity.ok(carrito);
    }
}
