package com.inmedt.ecommerce.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.inmedt.ecommerce.dto.AuthResponse;
import com.inmedt.ecommerce.model.User;
import com.inmedt.ecommerce.repository.UserRepository;
import com.inmedt.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
@Transactional
public class GoogleOAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${google.client.id:dummy-client-id}")
    private String googleClientId;

    public AuthResponse authenticateWithGoogle(String idTokenString) {
        try {
            // Verificar el token de Google
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                
                // Buscar o crear usuario
                User user = userRepository.findByEmail(email)
                        .orElseGet(() -> {
                            User newUser = new User();
                            newUser.setNombre(name);
                            newUser.setEmail(email);
                            // Generar contraseña aleatoria (no será usada, pero es requerida)
                            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                            newUser.setRole(User.Role.ROLE_CLIENTE);
                            newUser.setEnabled(true);
                            
                            // Guardar el usuario
                            return userRepository.save(newUser);
                        });
                
                // Generar JWT
                String token = jwtUtil.generateToken(user);
                
                return new AuthResponse(
                        token,
                        user.getId(),
                        user.getNombre(),
                        user.getEmail(),
                        user.getRole().name()
                );
            } else {
                throw new RuntimeException("Token de Google inválido");
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Error al autenticar con Google: " + e.getMessage());
        }
    }
}

