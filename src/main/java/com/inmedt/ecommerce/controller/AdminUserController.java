package com.inmedt.ecommerce.controller;

import com.inmedt.ecommerce.dto.UserResponse;
import com.inmedt.ecommerce.service.AdminUserService;
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
@RequestMapping("/admin/usuarios")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminUserController {
    
    @Autowired
    private AdminUserService adminUserService;
    
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nombre") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<UserResponse> users = adminUserService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsersList() {
        List<UserResponse> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserResponse user = adminUserService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        try {
            UserResponse user = adminUserService.updateUserRole(id, role);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestParam Boolean enabled) {
        try {
            UserResponse user = adminUserService.updateUserStatus(id, enabled);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/password")
    public ResponseEntity<?> updateUserPassword(@PathVariable Long id, @RequestParam String password) {
        try {
            UserResponse user = adminUserService.updateUserPassword(id, password);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminUserService.deleteUser(id);
            return ResponseEntity.ok("Usuario eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            List<UserResponse> users = adminUserService.getUsersByRole(role);
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/status/{enabled}")
    public ResponseEntity<List<UserResponse>> getUsersByStatus(@PathVariable Boolean enabled) {
        List<UserResponse> users = adminUserService.getUsersByStatus(enabled);
        return ResponseEntity.ok(users);
    }
}
