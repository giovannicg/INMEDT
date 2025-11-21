package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.PedidoResponse;
import com.inmedt.ecommerce.dto.UpdatePedidoInfoRequest;
import com.inmedt.ecommerce.service.AdminPedidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/pedidos")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminPedidoController {
    
    @Autowired
    private AdminPedidoService adminPedidoService;
    
    @GetMapping
    public ResponseEntity<Page<PedidoResponse>> getAllPedidos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<PedidoResponse> pedidos = adminPedidoService.getAllPedidos(pageable);
        return ResponseEntity.ok(pedidos);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<PedidoResponse>> getAllPedidosList() {
        List<PedidoResponse> pedidos = adminPedidoService.getAllPedidos();
        return ResponseEntity.ok(pedidos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPedidoById(@PathVariable Long id) {
        try {
            PedidoResponse pedido = adminPedidoService.getPedidoById(id);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> updatePedidoEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            PedidoResponse pedido = adminPedidoService.updatePedidoEstado(id, estado);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> getPedidosByEstado(@PathVariable String estado) {
        try {
            List<PedidoResponse> pedidos = adminPedidoService.getPedidosByEstado(estado);
            return ResponseEntity.ok(pedidos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/usuario/{userId}")
    public ResponseEntity<List<PedidoResponse>> getPedidosByUser(@PathVariable Long userId) {
        List<PedidoResponse> pedidos = adminPedidoService.getPedidosByUser(userId);
        return ResponseEntity.ok(pedidos);
    }
    
    @GetMapping("/fecha")
    public ResponseEntity<List<PedidoResponse>> getPedidosByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<PedidoResponse> pedidos = adminPedidoService.getPedidosByDateRange(fechaInicio, fechaFin);
        return ResponseEntity.ok(pedidos);
    }
    
    @PutMapping("/{id}/info")
    public ResponseEntity<?> updatePedidoInfo(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePedidoInfoRequest request) {
        try {
            PedidoResponse pedido = adminPedidoService.updatePedidoInfo(id, request);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePedido(@PathVariable Long id) {
        try {
            adminPedidoService.deletePedido(id);
            return ResponseEntity.ok("Pedido eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
