package com.inmedt.ecommerce.dto;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String nombre;
    private String email;
    private String role;
    
    // Constructores
    public AuthResponse() {}
    
    public AuthResponse(String token, Long userId, String nombre, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.nombre = nombre;
        this.email = email;
        this.role = role;
    }
    
    // Getters y Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
