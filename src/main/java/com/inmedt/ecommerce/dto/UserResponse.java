package com.inmedt.ecommerce.dto;

import java.time.LocalDateTime;

public class UserResponse {
    
    private Long id;
    private String nombre;
    private String email;
    private String rucCedula;
    private String role;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private Integer totalPedidos;
    
    // Constructores
    public UserResponse() {}
    
    public UserResponse(Long id, String nombre, String email, String rucCedula, String role, Boolean enabled, LocalDateTime createdAt) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rucCedula = rucCedula;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRucCedula() { return rucCedula; }
    public void setRucCedula(String rucCedula) { this.rucCedula = rucCedula; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Integer getTotalPedidos() { return totalPedidos; }
    public void setTotalPedidos(Integer totalPedidos) { this.totalPedidos = totalPedidos; }
}
