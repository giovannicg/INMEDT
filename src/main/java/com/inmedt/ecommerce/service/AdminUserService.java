package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.UserResponse;
import com.inmedt.ecommerce.model.User;
import com.inmedt.ecommerce.repository.UserRepository;
import com.inmedt.ecommerce.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminUserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::convertToUserResponse);
    }
    
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToUserResponse(user);
    }
    
    public UserResponse updateUserRole(Long id, String newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        try {
            User.Role role = User.Role.valueOf(newRole.toUpperCase());
            user.setRole(role);
            User savedUser = userRepository.save(user);
            return convertToUserResponse(savedUser);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rol inválido: " + newRole);
        }
    }
    
    public UserResponse updateUserStatus(Long id, Boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setEnabled(enabled);
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    
    public UserResponse updateUserPassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // No permitir eliminar el último admin
        if (user.getRole() == User.Role.ROLE_ADMIN) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == User.Role.ROLE_ADMIN)
                    .count();
            if (adminCount <= 1) {
                throw new RuntimeException("No se puede eliminar el último administrador");
            }
        }
        
        userRepository.delete(user);
    }
    
    public List<UserResponse> getUsersByRole(String role) {
        try {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            List<User> users = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == userRole)
                    .collect(Collectors.toList());
            return users.stream()
                    .map(this::convertToUserResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rol inválido: " + role);
        }
    }
    
    public List<UserResponse> getUsersByStatus(Boolean enabled) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getEnabled().equals(enabled))
                .collect(Collectors.toList());
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }
    
    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse(
            user.getId(),
            user.getNombre(),
            user.getEmail(),
            user.getRucCedula(),
            user.getRole().name(),
            user.getEnabled(),
            user.getCreatedAt()
        );
        
        // Contar pedidos del usuario
        int totalPedidos = pedidoRepository.findByUserOrderByCreatedAtDesc(user).size();
        response.setTotalPedidos(totalPedidos);
        
        return response;
    }
}
