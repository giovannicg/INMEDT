package com.inmedt.ecommerce.service;

import com.inmedt.ecommerce.dto.AuthResponse;
import com.inmedt.ecommerce.dto.LoginRequest;
import com.inmedt.ecommerce.dto.RegisterRequest;
import com.inmedt.ecommerce.model.Carrito;
import com.inmedt.ecommerce.model.User;
import com.inmedt.ecommerce.repository.UserRepository;
import com.inmedt.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Verificar si el RUC/Cédula ya existe (si se proporciona)
        if (request.getRucCedula() != null && !request.getRucCedula().isEmpty() 
            && userRepository.existsByRucCedula(request.getRucCedula())) {
            throw new RuntimeException("El RUC/Cédula ya está registrado");
        }
        
        // Crear nuevo usuario
        User user = new User();
        user.setNombre(request.getNombre());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRucCedula(request.getRucCedula());
        user.setRole(User.Role.ROLE_CLIENTE);
        
        User savedUser = userRepository.save(user);
        
        // Crear carrito para el usuario
        Carrito carrito = new Carrito(savedUser);
        // El carrito se creará automáticamente cuando se acceda por primera vez
        
        // Generar JWT
        String token = jwtUtil.generateToken(savedUser);
        
        return new AuthResponse(
            token,
            savedUser.getId(),
            savedUser.getNombre(),
            savedUser.getEmail(),
            savedUser.getRole().name()
        );
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);
        
        return new AuthResponse(
            token,
            user.getId(),
            user.getNombre(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}
